import { AppLayout } from '../../components/layout/AppLayout'
import { Card } from '../../components/ui'
import { Icon } from '../../components/ui/Icon'

const links = [
  { name: '游玩指南', description: '了解洛林·世界的游玩方式。', href: 'https://lorianstudio.feishu.cn/wiki/GVgSw7M0hiw2kekUSnRcy5P4n9b', action: '阅读指南' },
  { name: '洛林·世界网页地图', description: '在网页中浏览洛林·世界地图。', href: 'https://dynmap.voxisle.art', action: '打开地图' },
  { name: '建筑白名单申请', description: '申请洛林·世界建筑白名单。', href: 'https://hanamizu.feishu.cn/share/base/form/shrcnAKCPZ1o87t1E8dETDXlS7c', action: '填写申请' },
  { name: 'Axiom 权限申请', description: '申请在洛林·世界使用 Axiom 的权限。', href: 'https://hanamizu.feishu.cn/share/base/form/shrcn3OYmCAe5nkREtZCKamUQvc', action: '填写申请' },
  { name: 'WorldEdit 权限申请', description: '申请在洛林·世界使用 WorldEdit 的权限。', href: 'https://hanamizu.feishu.cn/share/base/form/shrcnZOqfrGAJZeImd67OgbY21e', action: '填写申请' },
  { name: '玩家邀请', description: '通过已有权限的玩家邀请，一次性申请多个权限。', href: 'https://hanamizu.feishu.cn/share/base/form/shrcnbxivp3TFo12eKLIBSJjZpb', action: '填写邀请申请' },
]

export function LorianCityPage() {
  return <AppLayout activeTool="lorian-city" eyebrow="LORIAN CITY" title="洛林 · 世界 Lorian City 专区" description="查询指南、网页地图、申请建筑权限。">
    <div className="tool-grid">
      {links.map(link => <Card key={link.href} title={link.name} description={link.description} className="tool-card">
        <a className="button button-secondary button-wide" href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.action}：${link.name}（新标签页）`}>
          {link.action}<Icon name="external"/>
        </a>
      </Card>)}
    </div>
  </AppLayout>
}
