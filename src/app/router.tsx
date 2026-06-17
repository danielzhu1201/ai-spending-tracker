import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { SpendingDashboardPage } from "../pages/dashboard/SpendingDashboardPage";
import { InsightsPage } from "../pages/insights/InsightsPage";
import { LoginPage } from "../pages/login/LoginPage";
import { ManualExpenseEntryPage } from "../pages/manual-entry/ManualExpenseEntryPage";
import { ReceiptScanPage } from "../pages/scan/ReceiptScanPage";
import { AllTransactionsPage } from "../pages/transactions/AllTransactionsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SpendingDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manual-entry"
        element={
          <ProtectedRoute>
            <ManualExpenseEntryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <AllTransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <InsightsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <ReceiptScanPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
