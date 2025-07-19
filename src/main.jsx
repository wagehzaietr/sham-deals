import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import './i18n/index.js'
import { SearchProvider } from './context/SearchContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-bg)',
            color: 'var(--color-fg)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      </SearchProvider>
    </AuthProvider>
  </StrictMode>
)
