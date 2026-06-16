import DocumentScannerRoundedIcon from "@mui/icons-material/DocumentScannerRounded";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageContainer } from "../../components/layout/PageContainer";
import { GlassCard } from "../../components/ui/GlassCard";
import { PrimaryFab } from "../../components/ui/PrimaryFab";
import { TransactionList } from "../../components/transactions/TransactionList";
import type { DashboardApiResponse } from "../../data/mock/dashboardApi";
import { selectDashboardSummary } from "../../data/selectors/dashboardSelectors";
import { apiEndpoints } from "../../lib/apiConfig";
import { authenticatedFetch } from "../../lib/authenticatedFetch";
import { formatMoney } from "../../utils/formatters";

const currentMonthLabel = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
}).format(new Date());

const emptyDashboard: DashboardApiResponse = {
  currentMonthSpend: 0,
  recentTransactions: [],
};

export function SpendingDashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] =
    useState<DashboardApiResponse>(emptyDashboard);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadDashboard() {
      try {
        setIsLoadingDashboard(true);
        setDashboardError(null);

        const response = await authenticatedFetch(apiEndpoints.dashboard, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Dashboard request failed: ${response.status}`);
        }

        const data = (await response.json()) as DashboardApiResponse;
        setDashboard(data);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setDashboardError(
          error instanceof Error ? error.message : "Unable to load dashboard.",
        );
        setDashboard(emptyDashboard);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingDashboard(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      abortController.abort();
    };
  }, []);

  const summary = useMemo(
    () => selectDashboardSummary(dashboard),
    [dashboard],
  );
  const recentTransactions = summary.recentTransactions.slice(0, 5);

  return (
    <>
      <PageContainer>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: "var(--aura-on-surface-variant)",
                  letterSpacing: "0.08em",
                }}
              >
                MONTHLY OVERVIEW
              </Typography>
              <Typography variant="h2" sx={{ color: "var(--aura-primary)" }}>
                Spending Dashboard
              </Typography>
            </Stack>
          </Stack>

          <div className="grid grid-cols-1 gap-6">
            <GlassCard>
              <Stack spacing={1.5}>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--aura-on-surface-variant)" }}
                >
                  MONTHLY SPENDING • {currentMonthLabel}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    alignItems: "baseline",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", md: "3rem" },
                      fontWeight: 700,
                      lineHeight: 1.1,
                      color: "var(--aura-primary)",
                    }}
                  >
                    {isLoadingDashboard ? (
                      <Skeleton variant="text" width={180} />
                    ) : (
                      formatMoney(summary.currentMonthSpend)
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </GlassCard>
          </div>

          <Stack spacing={1.5}>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h3" sx={{ color: "var(--aura-primary)" }}>
                Recent Transactions
              </Typography>
              <Button
                size="small"
                sx={{ color: "var(--aura-secondary)", fontWeight: 600 }}
                onClick={() => navigate("/transactions")}
              >
                View all
              </Button>
            </Stack>

            {isLoadingDashboard ? (
              <Stack
                spacing={1.5}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid var(--aura-outline-variant)",
                  bgcolor: "var(--aura-surface-container-lowest)",
                }}
              >
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} variant="rounded" height={56} />
                ))}
              </Stack>
            ) : dashboardError ? (
              <Stack spacing={1} sx={{ p: 2.25 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--aura-primary)" }}
                >
                  Unable to load dashboard
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--aura-on-surface-variant)" }}
                >
                  {dashboardError}
                </Typography>
              </Stack>
            ) : recentTransactions.length === 0 ? (
              <Stack spacing={1} sx={{ p: 2.25 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--aura-primary)" }}
                >
                  No recent transactions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--aura-on-surface-variant)" }}
                >
                  Add a transaction to see it here.
                </Typography>
              </Stack>
            ) : (
              <TransactionList transactions={recentTransactions} />
            )}
          </Stack>
        </Stack>
      </PageContainer>

      <PrimaryFab
        icon={<DocumentScannerRoundedIcon />}
        label="Scan Receipt"
        onClick={() => navigate("/scan")}
      />
    </>
  );
}
