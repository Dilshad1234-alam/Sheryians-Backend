import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Edit from "./Edit";

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    {/* <App /> */}
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/edit/:id" element={<Edit />} />
    </Routes>
  </BrowserRouter>
  
)
