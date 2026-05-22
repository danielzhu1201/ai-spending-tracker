import { Navigate, Route, Routes } from 'react-router-dom'

import { SpendingDashboardPage } from '../pages/dashboard/SpendingDashboardPage'
import { ManualExpenseEntryPage } from '../pages/manual-entry/ManualExpenseEntryPage'
import { AllTransactionsPage } from '../pages/transactions/AllTransactionsPage'
import { ComingSoonPage } from '../pages/shared/ComingSoonPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<SpendingDashboardPage />} />
      <Route path="/manual-entry" element={<ManualExpenseEntryPage />} />
      <Route path="/transactions" element={<AllTransactionsPage />} />
      <Route
        path="/insights"
        element={
          <ComingSoonPage
            screenLabel="AI Spending Insights"
            routeLabel="/insights"
          />
        }
      />
      <Route
        path="/scan"
        element={
          <ComingSoonPage
            screenLabel="AI Receipt Scan"
            routeLabel="/scan"
          />
        }
      />
      <Route
        path="/login"
        element={
          <ComingSoonPage
            screenLabel="Firebase Style Login"
            routeLabel="/login"
          />
        }
      />
    </Routes>
  )
}
