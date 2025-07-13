import axios from "axios";
import { auth } from "../firebase";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Firebase automatically handles token refreshing.
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting auth token: ", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTransactions = async () => {
  try {
    const response = await instance.get(`/transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    throw error;
  }
};

export const addTransaction = async (
  date: string,
  merchantName: string,
  category: string,
  amount: number
) => {
  try {
    const response = await instance.post("/transactions", {
      date,
      merchantName,
      category,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding transaction: ", error);
    throw error;
  }
};

export const receiptScan = async (image_data: string) => {
  try {
    const response = await instance.post("/receipt", { image_data });
    return response.data;
  } catch (error) {
    console.error("Error scanning receipt: ", error);
    throw error;
  }
};

export const getSpendingSummary = async (period: string) => {
  try {
    const response = await instance.get(`/summary/spending?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching spending summary: ", error);
    throw error;
  }
};
