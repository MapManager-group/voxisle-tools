# Arkitektonika API 文档

本文档依据当前仓库源码编写，适用于 `2.1.1-SNAPSHOT`。它描述的是程序的实际行为；仓库中的 `endpoints.yml` 与部分旧版 README
内容存在差异时，以本文和当前源码为准。

## 1. 项目用途

Arkitektonika 是一个用于存储 GZIP 压缩 NBT 数据的轻量 REST 服务，主要适合保存 Minecraft schematic 等 NBT 文件。

一次完整的文件生命周期如下：

1. 客户端以 `multipart/form-data` 上传文件；
2. 服务端解压并解析 NBT，验证文件是否合法以及解压后的大小；
3. 服务端将文件保存到本地文件系统，并将文件名、下载密钥、删除密钥等元数据写入 SQLite；
4. 客户端通过下载密钥获取文件，通过应当保密的删除密钥删除文件；
5. 运维方可以执行 prune 任务，清理超期文件、孤立文件和缺失文件的元数据。

服务不提供用户系统、登录、API Token 或权限分组。下载密钥和删除密钥本身就是访问凭证。

## 2. 基本约定

### 2.1 基础地址

自建实例默认监听：

```text
http://localhost:3000
```

公开示例实例：

```text
https://api.schematic.cloud
```

本文使用 `{BASE_URL}` 表示实例地址。路径没有额外的 `/api` 前缀。

### 2.2 数据和密钥

| 名称           | 格式                     | 用途                               |
|----------------|--------------------------|------------------------------------|
| `download_key` | 32 位小写十六进制字符串  | 查询和下载文件，可以分享给下载者   |
| `delete_key`   | 32 位小写十六进制字符串  | 查询和删除文件，应当像密码一样保密 |
| 上传文件       | GZIP 压缩的有效 NBT 数据 | 表单字段名必须为 `schematic`       |

服务端不会检查 URL 中密钥的长度或字符集。格式不正确或不存在的密钥最终都会按“未找到记录”处理。

### 2.3 通用响应

JSON 响应使用：

```json
{
  "error": "具体错误信息"
}
```

错误信息是便于诊断的文本，不建议客户端依赖其精确内容；客户端应以 HTTP 状态码为主要判断依据。

除下载成功响应以外，Express 会发送普通 JSON 或空响应。当前实现没有统一的 API 版本字段、请求 ID 或错误代码字段。

### 2.4 CORS

每个响应都会包含：

```http
Access-Control-Allow-Origin: <allowedOrigin 配置值>
```

默认值为 `*`。预检请求支持：

| 路径             | `Access-Control-Allow-Methods` |
|------------------|--------------------------------|
| `/upload`        | `POST`                         |
| `/download/:key` | `HEAD, GET`                    |
| `/delete/:key`   | `HEAD, DELETE`                 |

当前实现没有显式设置 `Access-Control-Allow-Headers`。

## 3. API 总览

| 方法      | 路径                       | 功能                       | 成功状态 |
|-----------|----------------------------|----------------------------|----------|
| `GET`     | `/`                        | 获取服务名称和版本         | `200`    |
| `POST`    | `/upload`                  | 上传并验证 NBT 文件        | `200`    |
| `HEAD`    | `/download/{download_key}` | 下载前检查                 | `200`    |
| `GET`     | `/download/{download_key}` | 下载原始上传文件           | `200`    |
| `HEAD`    | `/delete/{delete_key}`     | 删除前检查                 | `200`    |
| `DELETE`  | `/delete/{delete_key}`     | 删除文件并将记录标记为过期 | `200`    |
| `OPTIONS` | 上述三个资源路径           | 浏览器 CORS 预检           | `204`    |

## 4. 接口详情

### 4.1 获取服务信息

```http
GET /
```

不需要参数。

成功响应：`200 OK`

```json
{
  "name": "arkitektonika",
  "version": "2.1.1-SNAPSHOT",
  "made": {
    "with": "love",
    "by": "IntellectualSites"
  }
}
```

`version` 来自运行实例的 `../package.json`，不同部署可能返回不同值。

示例：

```bash
curl 'http://localhost:3000/'
```

### 4.2 上传文件

```http
POST /upload
Content-Type: multipart/form-data
```

表单参数：

| 字段        | 类型 | 必填 | 说明                                       |
|-------------|------|------|--------------------------------------------|
| `schematic` | 文件 | 是   | GZIP 压缩的有效 NBT 文件；字段名区分大小写 |

服务端验证过程：

1. 检查 `schematic` 字段是否存在；
2. 对上传内容执行 GZIP 解压；
3. 使用 NBT 解析器解码，且根节点必须存在；
4. 检查解析结果的长度是否超过 `maxSchematicSize`；
5. 分别生成下载密钥和删除密钥；
6. 写入元数据并保存原始上传文件。

成功响应：`200 OK`

```json
{
  "download_key": "db6186c8795740379d26fc61ecba1a24",
  "delete_key": "11561161dffe4a1298992ce063be5ff9"
}
```

请立即持久化两个密钥。服务端没有用于重新查询删除密钥的公开接口。

可能的响应：

| 状态码 | 条件                                            | 响应示例                                                              |
|--------|-------------------------------------------------|-----------------------------------------------------------------------|
| `200`  | 验证和保存成功                                  | `{ "download_key": "...", "delete_key": "..." }`                      |
| `400`  | 缺少文件                                        | `{ "error": "Missing file" }`                                         |
| `400`  | 不是 GZIP 数据、无法解析为 NBT，或 NBT 根值为空 | `{ "error": "File is not valid NBT" }`                                |
| `413`  | 解压并解析后的内容超过配置上限                  | `{ "error": "Submitted NBT file exceeds max size of 1000000 bytes" }` |
| `500`  | 无法生成唯一密钥                                | `{ "error": "Failed to generate download and / or deletion key" }`    |
| `500`  | 元数据或文件持久化失败                          | `{ "error": "Failed to persist data in table" }`                      |

上传处理的超时时间为 15 秒。默认 `maxSchematicSize` 为 `1,000,000` 字节；实例管理员可以修改此值。

curl 示例：

```bash
curl --fail-with-body \
  --form 'schematic=@/path/to/build.schem' \
  'http://localhost:3000/upload'
```

JavaScript 示例（浏览器或 Node.js 18+）：

```js
const form = new FormData();
form.append("schematic", file, file.name);

const response = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    body: form
});
const result = await response.json();

if (!response.ok) {
    throw new Error(result.error ?? `Upload failed: ${response.status}`);
}

console.log(result.download_key, result.delete_key);
```

不要手动填写 `Content-Type`；`fetch` 或 HTTP 客户端需要自动生成包含 boundary 的 multipart 请求头。

### 4.3 检查文件是否可下载

```http
HEAD /download/{download_key}
```

路径参数：

| 参数           | 类型   | 说明                     |
|----------------|--------|--------------------------|
| `download_key` | string | 上传成功后获得的下载密钥 |

此接口执行与实际下载相同的记录和文件检查，但不传输文件内容。

可能的响应：

| 状态码 | 含义                                         |
|--------|----------------------------------------------|
| `200`  | 记录存在、未标记过期，且磁盘文件存在         |
| `404`  | 数据库中没有对应下载密钥                     |
| `420`  | 记录已过期，或数据库有记录但磁盘文件已经丢失 |
| `500`  | 元数据损坏，例如记录缺少 ID                  |

示例：

```bash
curl --head \
  'http://localhost:3000/download/db6186c8795740379d26fc61ecba1a24'
```

`HEAD` 响应没有可供客户端读取的 JSON 响应体。只需判断状态码。

### 4.4 下载文件

```http
GET /download/{download_key}
```

参数和状态码与下载检查接口相同。

成功时，响应体是上传时的原始文件字节，并包含：

```http
Content-Disposition: attachment; filename="原始文件名"
```

当前实现没有显式声明成功响应的 `Content-Type` 和 `Content-Length`。客户端应按二进制流处理，不应尝试把成功响应解析为 JSON。

curl 示例：

```bash
curl --fail-with-body \
  --output downloaded.schem \
  'http://localhost:3000/download/db6186c8795740379d26fc61ecba1a24'
```

JavaScript 示例：

```js
const response = await fetch(`${baseUrl}/download/${downloadKey}`);

if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? `Download failed: ${response.status}`);
}

const data = await response.arrayBuffer();
```

### 4.5 检查文件是否可删除

```http
HEAD /delete/{delete_key}
```

路径参数：

| 参数         | 类型   | 说明                               |
|--------------|--------|------------------------------------|
| `delete_key` | string | 上传成功后获得且应当保密的删除密钥 |

可能的响应：

| 状态码 | 含义                        |
|--------|-----------------------------|
| `200`  | 记录存在且未标记过期        |
| `404`  | 数据库中没有对应删除密钥    |
| `420`  | 记录已过期                  |
| `500`  | 元数据损坏，例如记录缺少 ID |

此检查不会验证对应文件是否仍存在于磁盘；只检查数据库记录。

示例：

```bash
curl --head \
  'http://localhost:3000/delete/11561161dffe4a1298992ce063be5ff9'
```

下载接口不受删除接口的慢速限制影响。`HEAD /delete/...` 和 `DELETE /delete/...` 共享按客户端 IP 计算的慢速策略。

### 4.6 删除文件

```http
DELETE /delete/{delete_key}
```

成功响应：`200 OK`

```json
{}
```

成功时服务端会：

1. 在 SQLite 中将记录标记为已过期；
2. 如果磁盘文件存在，则删除文件；
3. 保留已过期的元数据记录。

可能的错误状态与删除检查接口相同。若记录存在但文件已经不在磁盘，删除仍会返回 `200` 并完成记录过期操作。

示例：

```bash
curl --fail-with-body \
  --request DELETE \
  'http://localhost:3000/delete/11561161dffe4a1298992ce063be5ff9'
```

删除成功后，再使用同一下载密钥请求时会因文件已经不存在而获得 `420`。再次使用删除密钥时，按接口设计也应获得 `420`
，但当前版本存在下文所述的过期时间判断缺陷，不应依赖这一结果来确认是否已经删除。

## 5. 状态码与错误速查

| 状态码                      | 使用场景                               |
|-----------------------------|----------------------------------------|
| `200 OK`                    | 普通查询、上传、检查、下载或删除成功   |
| `204 No Content`            | CORS `OPTIONS` 预检成功                |
| `400 Bad Request`           | 缺少上传文件或文件不是有效的 GZIP NBT  |
| `404 Not Found`             | 指定密钥没有对应数据库记录             |
| `413 Content Too Large`     | 解压、解析后的上传内容超过实例配置上限 |
| `420`                       | 记录已经过期，或下载时发现磁盘文件丢失 |
| `500 Internal Server Error` | 密钥生成、持久化或元数据发生内部错误   |

注意：当前源码使用非标准状态码 `420` 表示资源过期，不是 README 旧表格中的 `410 Gone`。客户端应兼容实际的 `420`。

## 6. 删除接口慢速限制

为了降低删除密钥被暴力猜测的风险，删除检查和删除请求使用渐进延迟，而不是固定次数后直接返回 `429`。

默认配置：

| 配置                 |  默认值 | 含义                                |
|----------------------|--------:|-------------------------------------|
| `limiter.windowMs`   | `60000` | 统计窗口为 60 秒                    |
| `limiter.delayAfter` |    `30` | 同一 IP 前 30 次请求不增加延迟      |
| `limiter.delayMs`    |   `500` | 超出阈值后，每多一次请求增加 500 ms |

例如默认配置下，第 31 次请求额外延迟约 500 ms，第 32 次约 1000 ms。当前实现没有配置最大延迟，也不会按设计主动返回 `429`
；代理或上游超时仍可能产生其他错误。

## 7. 推荐客户端流程

### 上传并保存凭证

1. 使用字段名 `schematic` 上传文件；
2. 确认状态码为 `200`；
3. 保存 `download_key` 和 `delete_key`；
4. 只向需要下载文件的人暴露 `download_key`。

### 安全下载

1. 可选：发送 `HEAD /download/{download_key}`；
2. 收到 `200` 后发送 `GET`；
3. 将成功响应按二进制流保存；
4. 对 `404`、`420` 和 `500` 分别处理。

`HEAD` 仅适合减少不必要的文件传输，不能消除检查和下载之间文件状态发生变化的可能。客户端仍必须处理 `GET` 的失败状态。

### 安全删除

1. 从安全存储中读取 `delete_key`；
2. 可选：发送 `HEAD /delete/{delete_key}`；
3. 发送 `DELETE /delete/{delete_key}`；
4. 收到 `200` 后清除本地保存的两个密钥。

删除操作不可通过 API 恢复。

## 8. 服务部署相关行为

API 行为受 `data/config.json` 控制：

```json
{
  "port": 3000,
  "prune": 1800000,
  "maxIterations": 20,
  "maxSchematicSize": 1000000,
  "allowedOrigin": "*",
  "limiter": {
    "windowMs": 60000,
    "delayAfter": 30,
    "delayMs": 500
  }
}
```

| 配置项             | API 影响                                       |
|--------------------|------------------------------------------------|
| `port`             | HTTP 服务监听端口                              |
| `prune`            | prune 任务将多久以前的记录视为应过期，单位毫秒 |
| `maxIterations`    | 生成唯一密钥时允许的最大尝试次数               |
| `maxSchematicSize` | 上传 NBT 解析结果允许的最大长度，单位字节      |
| `allowedOrigin`    | `Access-Control-Allow-Origin` 响应头           |
| `limiter.*`        | 删除检查和删除请求的渐进延迟策略               |

数据目录结构：

```text
data/
├── config.json
├── database.db
└── schemata/
    └── <download_key>
```

prune 不是 HTTP API。需在服务端执行：

```bash
yarn start:prod --prune
```

它会标记并删除超期文件，清理没有数据库记录的孤立文件，并将文件已丢失的数据库记录标记为过期。

## 9. 当前实现限制和兼容注意事项

- API 没有版本化路径，升级实例前应检查发布变更；
- 没有认证系统，密钥泄露即意味着对应下载或删除权限泄露；
- 上传只接受能够被 GZIP 解压并被 NBT 解析器读取的数据；
- 下载不会刷新 `last_accessed`，因此 prune 的过期时间实际按上传时间计算，而不是按最近下载时间计算；
- 当前版本检查记录是否过期时错误地使用了 JavaScript `Date.getMilliseconds()`（只返回当前秒内的 0–999
  毫秒），而不是比较完整时间戳。因此，仅凭数据库中的 `expired` 字段进行的过期判断可能间歇性失效；下载接口通常还会因文件已删除而返回
  `420`，但删除检查和重复删除可能错误地返回 `200`。客户端应将成功的首次 `DELETE` 视为最终结果，不要通过重复删除验证；
- `420` 是项目自定义的过期状态码；
- 删除限流是增加响应延迟，不保证返回 `429`；
- 下载成功响应没有显式 `Content-Type`，客户端应按二进制处理；
- 没有列表、元数据查询、修改、恢复、批量上传或重新获取删除密钥的公开接口；

## 10. 与旧接口描述的差异

当前仓库中的 `endpoints.yml` 可作为旧版 Swagger 2.0 草案参考，但以下内容与源码不一致：

| 旧描述                         | 当前源码实际行为              |
|--------------------------------|-------------------------------|
| 上传成功字段为 `deletion_key`  | 实际字段为 `delete_key`       |
| 删除操作为 `GET /delete/{key}` | 实际为 `DELETE /delete/{key}` |
| README 部分表格使用 `410`      | 实际使用 `420`                |
| 可能因限流返回 `429`           | 当前慢速中间件只渐进增加延迟  |

集成客户端时不要依据这些旧字段或方法生成调用代码。
