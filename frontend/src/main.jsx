import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './main.scss'
import { AuthContextProvider } from './components/context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <App />
      <ToastContainer position="top-center" autoClose={3000} />
    </AuthContextProvider>
  </StrictMode>,
)
