import { useState } from "react";
import { TextField, Button } from "@mui/material"; // Box removed
import styles from "./AddSpendingPage.module.css"; // Import the CSS module

const AddSpendingPage = () => {
  const [date, setDate] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleSubmit = () => {
    console.log({
      date,
      merchantName,
      category,
      amount,
      additionalInfo,
    });
    // TODO: upload this data to a backend or state management store
  };

  return (
    <>
      <h2>Add New Spending</h2>
      <div className={styles.FormContainer}>
        <TextField
          label="Date"
          fullWidth // Makes TextField take the full width of its container
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Merchant Name"
          fullWidth
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
        <TextField
          label="Category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          label="Amount"
          fullWidth
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          label="Additional Info (Optional)"
          fullWidth
          multiline
          rows={3}
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          className={styles.submitButton} // Using class from CSS module
        >
          Submit
        </Button>
      </div>
    </>
  );
};
export default AddSpendingPage;
