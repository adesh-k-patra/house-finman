/**
 * Main Entry Point for House FinMan React Application
 * 
 * Purpose: Bootstrap the React application with providers and global styles
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import AppTest from './AppTest'
import './styles/globals.css'

console.log('App Main Entry Point');
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
