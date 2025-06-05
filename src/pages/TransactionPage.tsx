import CoffeeIconMUI from "@mui/icons-material/Coffee"; // Renamed to avoid conflict if custom CoffeeIcon was global
import ShoppingCartIconMUI from "@mui/icons-material/ShoppingCart";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit"; // Or TrainIcon
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"; // Replacement for TicketIcon
import CheckroomIcon from "@mui/icons-material/Checkroom"; // Replacement for ShirtIcon
import TransactionDetail from "../atoms/TransactionDetail";

// --- Mock Data ---
const mockData = [
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
  return (
    <>
      <h2>Transactions</h2>
      {mockData.map((transaction) => (
        <TransactionDetail
          icon={transaction.icon}
          merchant={transaction.name}
          type={transaction.category}
          amount={transaction.amount}
          date={transaction.date}
          key={transaction.id}
        />
      ))}
    </>
  );
};
export default TransactionPage;
