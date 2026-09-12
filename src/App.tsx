import { useEffect, useState } from 'react'
import type { Tool } from './config'
import { QrCodePage } from './features/qrcode/QrCodePage'
import { SchematicPage } from './features/schematic/SchematicPage'
import './App.css'

function currentTool(): Tool {
  return location.hash === '#schematic' ? 'schematic' : 'qrcode'
}

function App() {
  const [tool, setTool] = useState<Tool>(currentTool)
  useEffect(() => {
    const update = () => setTool(currentTool())
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [])
  return tool === 'qrcode' ? <QrCodePage/> : <SchematicPage/>
}

export default App
