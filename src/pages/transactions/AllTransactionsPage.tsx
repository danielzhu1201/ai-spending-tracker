import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";

import { renderMaterialIcon } from "../../components/icons/materialIconMap";
import { PageContainer } from "../../components/layout/PageContainer";
import { TransactionRow } from "../../components/transactions/TransactionRow";
import { FilterChip } from "../../components/ui/FilterChip";
import { transactionsApiResponseMock } from "../../data/mock/transactionsApi";
import { selectTransactionsPageViewModel } from "../../data/selectors/transactionsSelectors";
import type { TransactionCategory, TransactionInfo } from "../../types/domain";
import { formatMoney } from "../../utils/formatters";
import {
  getManualExpenseCategoryDisplay,
  toManualExpenseMoney,
} from "../../utils/manualExpense";

const viewModel = selectTransactionsPageViewModel(transactionsApiResponseMock);

type TransactionTimeFilter = "this-week" | "this-month" | "last-3-months";

const timeFilters: Array<{
  id: string;
  label: string;
  value: TransactionTimeFilter;
  selected?: boolean;
}> = [
  {
    id: "time-this-week",
    label: "This Week",
    value: "this-week",
  },
  {
    id: "time-this-month",
    label: "This Month",
    value: "this-month",
    selected: true,
  },
  {
    id: "time-last-3-months",
    label: "Last 3 Months",
    value: "last-3-months",
  },
];

function parseTransactionDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  const start = startOfDay(date);
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  return start;
}

function startOfLastThreeMonths(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 2, 1);
}

export function AllTransactionsPage() {
  const [query, setQuery] = useState("");
  const [selectedTimeValue, setSelectedTimeValue] = useState(
    timeFilters.find((filter) => filter.selected)?.value ??
      timeFilters[0].value,
  );
  const [selectedCategoryValue, setSelectedCategoryValue] =
    useState<TransactionCategory | null>(null);

  const categoryFilters = useMemo(() => {
    const categories = Array.from(
      new Set(
        viewModel.transactions.map((transaction) => transaction.category),
      ),
    );

    return categories.map((category) => {
      const categoryDisplay = getManualExpenseCategoryDisplay(category);

      return {
        id: `category-${category}`,
        label: categoryDisplay.label,
        value: category,
        icon: categoryDisplay.icon,
      };
    });
  }, []);

  const filteredTransactions = useMemo(() => {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekStart = startOfWeek(today);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastThreeMonthsStart = startOfLastThreeMonths(today);

    const matchesTimeFilter = (transaction: TransactionInfo): boolean => {
      const transactionDate = parseTransactionDate(transaction.transactionDate);

      switch (selectedTimeValue) {
        case "this-week":
          return transactionDate >= weekStart && transactionDate < tomorrow;
        case "last-3-months":
          return (
            transactionDate >= lastThreeMonthsStart &&
            transactionDate < tomorrow
          );
        case "this-month":
          return transactionDate >= monthStart && transactionDate < tomorrow;
        default:
          return true;
      }
    };

    const queryLower = query.trim().toLowerCase();

    return viewModel.transactions.filter((transaction) => {
      if (
        selectedCategoryValue &&
        transaction.category !== selectedCategoryValue
      ) {
        return false;
      }

      if (!matchesTimeFilter(transaction)) {
        return false;
      }

      if (queryLower.length === 0) {
        return true;
      }

      const categoryDisplay = getManualExpenseCategoryDisplay(
        transaction.category,
      );
      const searchableText = [
        transaction.note,
        categoryDisplay.label,
        transaction.transactionDate,
        formatMoney(toManualExpenseMoney(transaction)),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(queryLower);
    });
  }, [query, selectedCategoryValue, selectedTimeValue]);

  return (
    <>
      <PageContainer>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h2" sx={{ color: "var(--aura-primary)" }}>
              Transactions
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "var(--aura-on-surface-variant)" }}
            >
              Review your recent mindful spending.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              placeholder={viewModel.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchRoundedIcon
                      sx={{
                        color: "var(--aura-outline)",
                        mr: 1,
                      }}
                    />
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "var(--aura-surface-container-low)",
                  borderRadius: "12px",
                },
              }}
            />

            <Box className="no-scrollbar" sx={{ overflowX: "auto", pb: 0.5 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  width: "max-content",
                  alignItems: "center",
                }}
              >
                {timeFilters.map((filter) => (
                  <FilterChip
                    key={filter.id}
                    label={filter.label}
                    selected={selectedTimeValue === filter.value}
                    onClick={() => {
                      setSelectedTimeValue(filter.value);
                    }}
                  />
                ))}

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {categoryFilters.map((filter) => (
                  <FilterChip
                    key={filter.id}
                    label={filter.label}
                    icon={
                      filter.icon
                        ? renderMaterialIcon(filter.icon, { fontSize: "small" })
                        : undefined
                    }
                    selected={selectedCategoryValue === filter.value}
                    onClick={() => {
                      setSelectedCategoryValue((current) =>
                        current === filter.value ? null : filter.value,
                      );
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              overflow: "hidden",
              borderRadius: "12px",
              borderColor: "var(--aura-outline-variant)",
            }}
          >
            {filteredTransactions.length === 0 ? (
              <Stack spacing={1} sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--aura-primary)" }}
                >
                  No transactions found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--aura-on-surface-variant)" }}
                >
                  Try changing filters or search terms.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={0}>
                {filteredTransactions.map((transaction, index) => (
                  <TransactionRow
                    key={`${transaction.transactionDate}-${transaction.category}-${transaction.amount}-${index}`}
                    transaction={transaction}
                    withDivider={index < filteredTransactions.length - 1}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Stack>
      </PageContainer>
    </>
  );
}
