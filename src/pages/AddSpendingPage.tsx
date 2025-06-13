import { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Webcam from "react-webcam";
import styles from "./AddSpendingPage.module.css"; // Import the CSS module

const AddSpendingPage = () => {
  const [date, setDate] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [uploadMode, setUploadMode] = useState<"manual" | "camera">("manual"); // State for upload mode
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Webcam related state
  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: "environment",
  };
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (uploadMode === "camera") {
      if (capturedImage) {
        // Populate fields with placeholder values
        // In a real scenario, these might come from OCR/AI processing of the image
        setDate(new Date().toISOString().split("T")[0]); // Set to today's date
        setMerchantName("Scanned Merchant (Edit)");
        setCategory("Scanned Category (Edit)");
        setAmount("0.00"); // Default amount, user should verify
        setAdditionalInfo("Details from scanned receipt (Edit if needed).");

        // Switch to manual mode for user review and final submission
        setUploadMode("manual");
        // The capturedImage remains in state and will be submitted with the manual form.
        // isCameraOpen should already be false if an image was captured.
      } else {
        // This case is ideally prevented by disabling the submit button if no image is captured.
        alert("Please capture an image first or switch to Manual Upload.");
        console.warn("Submit clicked in camera mode without a captured image.");
      }
    } else if (uploadMode === "manual") {
      // This is the final submission (either purely manual or after camera pre-fill)
      console.log("Submitting form data:", {
        date,
        merchantName,
        category,
        amount,
        additionalInfo,
        // Include the capturedImage if it exists (i.e., if this submission originated from a camera scan)
        capturedImage: capturedImage,
      });

      // TODO: Implement actual data upload to a backend or state management store
      alert("Form submitted! Check the console for the data."); // Placeholder feedback

      // Clear form fields and reset state after successful submission
      setDate("");
      setMerchantName("");
      setCategory("");
      setAmount("");
      setAdditionalInfo("");
      setCapturedImage(null); // Clear the captured image after submission
    }
  };

  // Effect to manage camera state when switching modes
  useEffect(() => {
    if (uploadMode === "manual") {
      setIsCameraOpen(false); // Ensure camera is closed if switching to manual mode
      // We no longer clear capturedImage here, as it's needed if switching from camera to manual for pre-fill.
      // It will be cleared after the final submission.
    }
  }, [uploadMode]);

  const handleUploadModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: "manual" | "camera" | null
  ) => {
    if (newMode !== null) {
      // A mode must be selected
      setUploadMode(newMode);
    }
  };

  return (
    <>
      <h2>Add New Spending</h2>

      <ToggleButtonGroup
        value={uploadMode}
        exclusive
        onChange={handleUploadModeChange}
        fullWidth
        aria-label="upload mode button group"
        className={styles.modeButtonGroup}
      >
        <ToggleButton value="manual" aria-label="manual upload">
          Manual Upload
        </ToggleButton>
        <ToggleButton value="camera" aria-label="camera scan">
          Camera Scan
        </ToggleButton>
      </ToggleButtonGroup>

      <div className={styles.FormContainer}>
        {uploadMode === "manual" && (
          <>
            <TextField
              label="Date"
              fullWidth
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
          </>
        )}

        {uploadMode === "camera" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            {!isCameraOpen && !capturedImage && (
              <Button
                variant="outlined"
                fullWidth
                className={styles.cameraButton}
                onClick={() => setIsCameraOpen(true)}
              >
                Open Camera
              </Button>
            )}

            {isCameraOpen && !capturedImage && (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={videoConstraints}
                  className={styles.webcamFeed}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    const imageSrc = webcamRef.current?.getScreenshot();
                    if (imageSrc) {
                      setCapturedImage(imageSrc);
                      setIsCameraOpen(false); // Hide camera after capture
                    }
                  }}
                  fullWidth
                >
                  Take Photo
                </Button>
              </>
            )}

            {capturedImage && (
              <>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className={styles.capturedImagePreview}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    setCapturedImage(null);
                    setIsCameraOpen(true);
                  }}
                  fullWidth
                >
                  Retake Photo
                </Button>
              </>
            )}
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleSubmit}
          className={styles.submitButton} // Using class from CSS module
          disabled={uploadMode === "camera" && !capturedImage}
        >
          Submit
        </Button>
      </div>
    </>
  );
};
export default AddSpendingPage;
