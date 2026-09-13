import { LOGO_CDN_URL } from '../../config'

export function Brand() {
  return <a className="brand" href="#home" aria-label="方屿工具箱首页">
    {LOGO_CDN_URL ? <img className="brand-logo" src={LOGO_CDN_URL} alt="方屿"/> : <span className="brand-mark" aria-hidden="true">V</span>}
    <span><strong>方屿工具箱</strong><small>VOXISLE TOOLS</small></span>
  </a>
}
