import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext';
import { FontSizeProvider } from './context/FontSizeContext';
import { SoundProvider } from './context/SoundContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <FontSizeProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </FontSizeProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
