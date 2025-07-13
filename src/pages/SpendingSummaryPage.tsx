import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import styles from "./SpendingSummaryPage.module.css";
import { getSpendingSummary } from "../api/api";

interface SpendingSummaryProps {
  // You can define props here if needed, e.g., transaction data
}

const convertTabValue = (tabValue: number) => {
  switch (tabValue) {
    case 0:
      return "daily";
    case 1:
      return "weekly";
    case 2:
      return "monthly";
    default:
      return "daily";
  }
};

const SpendingSummaryPage: React.FC<SpendingSummaryProps> = () => {
  const [tabValue, setTabValue] = useState(0); // 0: Daily, 1: Weekly, 2: Monthly
  const [authenticated, setIsAuthenticated] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [topCategories, setTopCategories] = useState<
    {
      category: string;
      total_amount: number;
    }[]
  >([]);
  const [insightsAndSuggestions, setInsightsAndSuggestions] = useState("");

  // 1. useEffect that runs once on component startup (mount)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        getSpendingSummary(convertTabValue(tabValue))
          .then((response) => {
            setTotalSpent(response.totalSpent);
            setTopCategories(response.topCategories);
            setInsightsAndSuggestions(response.insights);
            setIsDataLoading(false);
            console.log("Spending summary response:", response);
          })
          .catch((error) => {
            console.error("Error fetching spending summary:", error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. useEffect that runs whenever the `tabValue` state changes
  useEffect(() => {
    const tabName = ["Daily", "Weekly", "Monthly"][tabValue];
    console.log(`Tab selection changed to: ${tabName}. Refetching data...`);
    setIsDataLoading(true);

    getSpendingSummary(convertTabValue(tabValue))
      .then((response) => {
        setTotalSpent(response.totalSpent);
        setTopCategories(response.topCategories);
        setInsightsAndSuggestions(response.insights);
        setIsDataLoading(false);
        console.log("Spending summary response:", response);
      })
      .catch((error) => {
        console.error("Error fetching spending summary:", error);
      });
  }, [tabValue]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!authenticated) {
    return <p>Please login to view this page</p>;
  }

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Spending summary tabs"
        >
          <Tab label="Daily" />
          <Tab label="Weekly" />
          <Tab label="Monthly" />
        </Tabs>
      </Box>

      {/* Content based on selected tab */}
      {isDataLoading ? (
        <p>Loading spending summary...</p>
      ) : (
        <Box sx={{ p: 3 }}>
          {/* The content below is currently static. It can be updated based on the tabValue state. */}
          <Box sx={{ textAlign: "left" }}>
            {/* Total Spent Card */}
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Total Spent (USD)
              </Typography>
              <Typography
                variant="h4"
                component="p"
                sx={{ fontWeight: "bold" }}
              >
                ${totalSpent.toFixed(2)}
              </Typography>
            </Paper>

            {/* Top Categories */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Top Categories
              </Typography>
              <List dense sx={{ p: 0 }}>
                {topCategories.map((cat, index) => (
                  <ListItem key={index} disableGutters sx={{ p: 0 }}>
                    <ListItemText primary={cat.category} />
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      ${cat.total_amount}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Insights & Suggestions */}
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                Insights & Suggestions
              </Typography>
              <Typography variant="body1">{insightsAndSuggestions}</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default SpendingSummaryPage;
