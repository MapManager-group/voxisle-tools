import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

let savedTheme: string | null = null
try { savedTheme = localStorage.getItem('voxisle-theme') } catch { /* Use the system theme when storage is unavailable. */ }
document.documentElement.dataset.theme = savedTheme === 'dark' || savedTheme === 'light'
  ? savedTheme
  : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
