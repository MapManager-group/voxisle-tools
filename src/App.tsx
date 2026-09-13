import { useEffect, useState } from 'react'
import type { Tool } from './config'
import { QrCodePage } from './features/qrcode/QrCodePage'
import { SchematicPage } from './features/schematic/SchematicPage'
import { HomePage } from './features/home/HomePage'
import './App.css'

function currentTool(): Tool {
  if (location.hash === '#schematic') return 'schematic'
  if (location.hash === '#qrcode') return 'qrcode'
  return 'home'
}

function App() {
  const [tool, setTool] = useState<Tool>(currentTool)
  useEffect(() => {
    const update = () => setTool(currentTool())
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [])
  return tool === 'qrcode' ? <QrCodePage/> : tool === 'schematic' ? <SchematicPage/> : <HomePage/>
}

export default App
