import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OptiScaleApp from "./OptiScale.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OptiScaleApp />
  </StrictMode>,
)
