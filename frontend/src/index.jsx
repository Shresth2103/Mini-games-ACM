import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Routes from './Routes.jsx'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from './LandingPage.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
    <Routes />
  </BrowserRouter>,
)
