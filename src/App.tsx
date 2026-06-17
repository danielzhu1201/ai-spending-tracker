import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app/router'
import { AuthProvider } from './auth/AuthProvider'
import { AppTopBar } from './components/layout/AppTopBar'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { mobileNavigationItems } from './config/navigation'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppTopBar title="AI Financial Planner" />
        <AppRouter />
        <MobileBottomNav items={mobileNavigationItems} />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
