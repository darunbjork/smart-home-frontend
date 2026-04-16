import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { AuthProvider } from './context/AuthContext.tsx'
import { HouseholdProvider } from './context/HouseholdContext.tsx'
import { DeviceProvider } from './context/DeviceContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';

import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router> 
      <AuthProvider> 
        <ToastProvider>
          <HouseholdProvider>
            <DeviceProvider>
              <App />
            </DeviceProvider>
          </HouseholdProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
