import DocumentScannerRoundedIcon from "@mui/icons-material/DocumentScannerRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { PageContainer } from "../../components/layout/PageContainer";
import { GlassCard } from "../../components/ui/GlassCard";
import { PrimaryFab } from "../../components/ui/PrimaryFab";
import { TransactionList } from "../../components/transactions/TransactionList";
import { dashboardApiResponseMock } from "../../data/mock/dashboardApi";
import { transactionsApiResponseMock } from "../../data/mock/transactionsApi";
import { selectDashboardSummary } from "../../data/selectors/dashboardSelectors";
import { formatMoney } from "../../utils/formatters";

const summary = selectDashboardSummary(dashboardApiResponseMock);
const recentTransactions = transactionsApiResponseMock.slice(0, 4);
const currentMonthLabel = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
}).format(new Date());

export function SpendingDashboardPage() {
  const navigate = useNavigate();

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
                    {formatMoney(summary.currentMonthSpend)}
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
              >
                View all
              </Button>
            </Stack>

            <TransactionList transactions={recentTransactions} />
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
