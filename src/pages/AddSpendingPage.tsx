import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const AddSpendingPage = () => {
  const [date, setDate] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleSubmit = () => {
    // Handle the form submission logic here
    console.log({
      date,
      merchantName,
      category,
      amount,
      additionalInfo,
    });
    // You would typically send this data to a backend or state management store
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, // Spacing between elements
        maxWidth: "500px", // Max width of the form
        margin: "auto", // Center the form
        padding: 2, // Padding around the form
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Add Spending
      </Typography>
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Merchant Name"
        value={merchantName}
        onChange={(e) => setMerchantName(e.target.value)}
      />
      <TextField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        label="Additional Info (Optional)"
        multiline
        rows={3}
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
};
export default AddSpendingPage;
