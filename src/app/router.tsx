import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { SpendingDashboardPage } from '../pages/dashboard/SpendingDashboardPage'
import { ComingSoonPage } from '../pages/shared/ComingSoonPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <SpendingDashboardPage />,
  },
  {
    path: '/manual-entry',
    element: (
      <ComingSoonPage
        screenLabel="Manual Expense Entry"
        routeLabel="/manual-entry"
      />
    ),
  },
  {
    path: '/transactions',
    element: (
      <ComingSoonPage
        screenLabel="All Transactions"
        routeLabel="/transactions"
      />
    ),
  },
  {
    path: '/insights',
    element: (
      <ComingSoonPage
        screenLabel="AI Spending Insights"
        routeLabel="/insights"
      />
    ),
  },
  {
    path: '/scan',
    element: (
      <ComingSoonPage
        screenLabel="AI Receipt Scan"
        routeLabel="/scan"
      />
    ),
  },
  {
    path: '/login',
    element: (
      <ComingSoonPage
        screenLabel="Firebase Style Login"
        routeLabel="/login"
        showNavigation={false}
      />
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
