import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { AuthProvider } from './context/AuthContext'
import { RosterProvider } from './context/RoasterContext.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { TeamProvider } from './context/TeamContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <TeamProvider>
              <RosterProvider>
                <App />
              </RosterProvider>
            </TeamProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
