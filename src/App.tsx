import { useEffect, useState } from 'react'
import { LcVerifyPage } from './features/lcverify/LcVerifyPage'
import type { Tool } from './config'
import { LorianCityPage } from './features/lorian-city/LorianCityPage'
import { SchematicPage } from './features/schematic/SchematicPage'
import { HomePage } from './features/home/HomePage'
import { ResourcesPage } from './features/resources/ResourcesPage'

function currentTool(): Tool {
  if (location.hash === '#schematic') return 'schematic'
  if (location.hash === '#lorian-city') return 'lorian-city'
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
  return tool === 'lorian-city' ? <LorianCityPage/> : tool === 'schematic' ? <SchematicPage/> : tool === 'resources' ? <ResourcesPage/> : <HomePage/>
}

export default App
