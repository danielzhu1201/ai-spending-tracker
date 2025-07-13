import { useState, useEffect, useMemo } from "react";
<<<<<<< HEAD
import CoffeeIconMUI from "@mui/icons-material/Coffee"; // Renamed to avoid conflict if custom CoffeeIcon was global
import ShoppingCartIconMUI from "@mui/icons-material/ShoppingCart";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit"; // Or TrainIcon
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"; // Replacement for TicketIcon
import CheckroomIcon from "@mui/icons-material/Checkroom"; // Replacement for ShirtIcon

=======
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TheatersIcon from "@mui/icons-material/Theaters";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FlightIcon from "@mui/icons-material/Flight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
>>>>>>> upstream/feature/spending-summary-page
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";

import TransactionDetail from "../atoms/TransactionDetail";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import styles from "./TransactionPage.module.css";
import { getTransactions } from "../api/api";

// --- Define a type for our transaction data ---
interface Transaction {
  id: number;
  icon: React.ReactNode;
  name: string;
  category: string;
  amount: number;
  date: string;
}

<<<<<<< HEAD

const mockData: Transaction[] = [

  {
    id: 1,
    icon: <CoffeeIconMUI />,
    name: "Cafe Mocha",
    category: "Coffee",
    amount: 4.5,
    date: "2024-05-30",
  },
  {
    id: 2,
    icon: <ShoppingCartIconMUI />,
    name: "Supermart",
    category: "Groceries",
    amount: 75.2,
    date: "2024-05-30",
  },
  {
    id: 3,
    icon: <LocalPizzaIcon />,
    name: "Pizza Palace",
    category: "Dining",
    amount: 25.0,
    date: "2024-05-29",
  },
  {
    id: 4,
    icon: <DirectionsTransitIcon />,
    name: "Metro Fare",
    category: "Transportation",
    amount: 2.75,
    date: "2024-05-29",
  },
  {
    id: 5,
    icon: <ConfirmationNumberIcon />,
    name: "Cinema Tickets",
    category: "Entertainment",
    amount: 30.0,
    date: "2024-05-28",
  },
  {
    id: 6,
    icon: <CheckroomIcon />,
    name: "Clothing Store",
    category: "Shopping",
    amount: 120.0,
    date: "2024-05-27",
  },
];

const TransactionPage = () => {
  
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
=======
const getIconForCategory = (category: string): React.ReactNode => {
  switch (category) {
    case "Food & Dining":
      return <RestaurantIcon />;
    case "Shopping":
      return <ShoppingCartIcon />;
    case "Transportation":
      return <DirectionsCarIcon />;
    case "Health & Fitness":
      return <FitnessCenterIcon />;
    case "Entertainment":
      return <TheatersIcon />;
    case "Utilities":
      return <ReceiptLongIcon />;
    case "Travel":
      return <FlightIcon />;
    case "Other":
      return <MoreHorizIcon />;
    default:
      // Return a default icon for any unhandled cases
      return <MoreHorizIcon />;
  }
};

const TransactionPage = () => {
  const [authenticated, setIsAuthenticated] = useState(false);
>>>>>>> upstream/feature/spending-summary-page
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        const fetchAndSetTransactions = async () => {
          try {
            const apiData = await getTransactions();

            const mappedTransactions: Transaction[] = apiData.map(
              (item: any) => ({
                id: item.id,
                name: item.merchantName,
                category: item.category,
                amount: item.amount,
                date: new Date(item.date).toLocaleDateString(),
                icon: getIconForCategory(item.category),
              })
            );
            setTransactions(mappedTransactions);
            setIsDataLoaded(true);
          } catch (error) {
            console.error("Failed to fetch transactions:", error);
          }
        };

        fetchAndSetTransactions();
      }
    });

    return () => unsubscribe();
  }, []);

  const uniqueDates = useMemo(() => {
    const dates = new Set(transactions.map((t) => t.date));
    // Sort dates in descending order (most recent first)
    return Array.from(dates).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [transactions]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(transactions.map((t) => t.category));
    return Array.from(categories).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        transaction.name.toLowerCase().includes(lowerSearchTerm) ||
        transaction.category.toLowerCase().includes(lowerSearchTerm);
      const matchesDate =
        selectedDate === "" || transaction.date === selectedDate;
      const matchesCategory =
        selectedCategory === "" || transaction.category === selectedCategory;
      return matchesSearchTerm && matchesDate && matchesCategory;
    });
  }, [transactions, searchTerm, selectedDate, selectedCategory]);

  if (!authenticated) {
    return <p>Please login to view this page</p>;
  }

  return (
    <>
      <h2>Total Spending: ${totalAmount.toFixed(2)}</h2>

      <h2>Transactions</h2>

      <div className={styles.FilterContainer}>
        <TextField
          label="Search Transactions"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "300px" } }}
        />
        <div className={styles.DropdownContainer}>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="date-filter-label">Date</InputLabel>
            <Select
              labelId="date-filter-label"
              value={selectedDate}
              label="Date"
              onChange={(e: SelectChangeEvent<string>) =>
                setSelectedDate(e.target.value)
              }
            >
              <MenuItem value="">
                <em>All Dates</em>
              </MenuItem>
              {uniqueDates.map((date) => (
                <MenuItem key={date} value={date}>
                  {date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              label="Category"
              onChange={(e: SelectChangeEvent<string>) =>
                setSelectedCategory(e.target.value)
              }
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {!isDataLoaded && <p>Loading transactions...</p>}

      {isDataLoaded && filteredTransactions.length === 0 && (
        <p>No transactions found matching your criteria.</p>
      )}

      {isDataLoaded &&
        filteredTransactions.length > 0 &&
        filteredTransactions.map((transaction) => (
          <TransactionDetail
            key={transaction.id} // Ensure key is on the outermost element in the map
            icon={transaction.icon}
            merchant={transaction.name}
            type={transaction.category}
            amount={transaction.amount}
            date={transaction.date}
          />
        ))}
    </>
  );
};

export default TransactionPage;
