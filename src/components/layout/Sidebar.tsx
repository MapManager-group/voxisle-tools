import type { Tool } from '../../config'
import { Icon } from '../ui/Icon'
import { Brand } from './Brand'

export function Sidebar({ activeTool }: { activeTool: Tool }) {
  return <aside className="sidebar">
    <Brand/>
    <div className="sidebar-menu">
      <nav aria-label="工具导航">
        <a href="#home" className={activeTool === 'home' ? 'active' : ''} aria-current={activeTool === 'home' ? 'page' : undefined} aria-label="工具首页" title="工具首页"><Icon name="home"/><span>工具首页</span></a>
        <a href="#resources" className={activeTool === 'resources' ? 'active' : ''} aria-current={activeTool === 'resources' ? 'page' : undefined} aria-label="素材网站" title="素材网站"><Icon name="image"/><span>素材网站</span></a>
        <a href="#qrcode" className={activeTool === 'qrcode' ? 'active' : ''} aria-label="二维码生成" title="二维码生成"><Icon name="qr"/><span>二维码生成</span></a>
        <a href="#schematic" className={activeTool === 'schematic' ? 'active' : ''} aria-label="Schematic Cloud" title="Schematic Cloud"><Icon name="cloud"/><span>Schematic Cloud</span></a>
      </nav>
      <div className="sidebar-foot"><Icon name="check"/><span>文件由 Voxisle API 处理<br/><small>请勿上传敏感内容</small></span></div>
    </div>
  </aside>
}
