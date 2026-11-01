import { useEffect, useState } from 'react'
import { LcVerifyPage } from './features/lcverify/LcVerifyPage'
import type { Tool } from './config'
import { QrCodePage } from './features/qrcode/QrCodePage'
import { SchematicPage } from './features/schematic/SchematicPage'
import { HomePage } from './features/home/HomePage'
import { ResourcesPage } from './features/resources/ResourcesPage'

function currentTool(): Tool {
  if (location.hash === '#schematic') return 'schematic'
  if (location.hash === '#qrcode') return 'qrcode'
  if (location.hash === '#resources') return 'resources'
  return 'home'
}

function App() {
  const [tool, setTool] = useState<Tool>(currentTool)
  useEffect(() => {
    const update = () => setTool(currentTool())
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [])
  if (location.pathname === '/lcverify' || location.pathname === '/lcverify/') return <LcVerifyPage/>
  return tool === 'qrcode' ? <QrCodePage/> : tool === 'schematic' ? <SchematicPage/> : tool === 'resources' ? <ResourcesPage/> : <HomePage/>
}

export default App
