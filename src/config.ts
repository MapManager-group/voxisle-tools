function requiredEnv(name: keyof ImportMetaEnv) {
  const value = import.meta.env[name]
  if (!value) throw new Error(`缺少环境变量：${name}`)
  return value
}

export const QR_API = requiredEnv('VITE_QR_API_BASE_URL')
export const SCHEMATIC_API = requiredEnv('VITE_SCHEMATIC_API_BASE_URL')
export const LOGO_CDN_URL = requiredEnv('VITE_LOGO_CDN_URL')
export type Tool = 'home' | 'qrcode' | 'schematic'
