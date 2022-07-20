
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { TestModule } from "../utils/";

import './global.css'

ReactDOM.createRoot(document.getElementById('root') ).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

setTimeout(() => {
  TestModule('Vite is blazing fast')
}, 1000)