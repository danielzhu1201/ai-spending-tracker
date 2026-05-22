import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app/router'
import { AppTopBar } from './components/layout/AppTopBar'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { mobileNavigationItems } from './config/navigation'

function App() {
  return (
    <BrowserRouter>
      <AppTopBar title="Aura Finance" />
      <AppRouter />
      <MobileBottomNav items={mobileNavigationItems} />
    </BrowserRouter>
  )
}

export default App
