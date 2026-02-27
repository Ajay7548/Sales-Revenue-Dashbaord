import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useUploadFileMutation } from "../store/analyticsApi";

export default function FileUpload() {
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const inputRef = useRef(null);

  const handleFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setSnackbar({ open: true, message: "Only .xlsx, .xls, .csv files allowed", severity: "error" });
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const result = await uploadFile(formData).unwrap();
      setSnackbar({
        open: true,
        message: result.message || `${result.inserted} rows imported!`,
        severity: "success",
      });
      setSelectedFile(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.data?.error || "Upload failed",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Paper
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        sx={{
          p: { xs: 3, md: 5 },
          textAlign: "center",
          cursor: "pointer",
          border: "2px dashed",
          borderColor: dragOver ? "#667eea" : "rgba(255,255,255,0.12)",
          borderRadius: 4,
          background: dragOver
            ? "rgba(102,126,234,0.08)"
            : "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          backdropFilter: "blur(12px)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            borderColor: "#667eea",
            background: "rgba(102,126,234,0.06)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 30px rgba(102,126,234,0.15)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)",
            opacity: dragOver ? 1 : 0,
            transition: "opacity 0.3s",
          },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".xlsx,.xls,.csv"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 32, color: "#667eea" }} />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom color="#fff">
          {selectedFile ? selectedFile.name : "Drop CSV/Excel file here"}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
          {selectedFile
            ? `${(selectedFile.size / 1024).toFixed(1)} KB — Click upload to import`
            : "or click to browse · supports .xlsx, .xls, .csv"}
        </Typography>
        {selectedFile && (
          <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<InsertDriveFileIcon />}
              onClick={(e) => { e.stopPropagation(); handleUpload(); }}
              disabled={isLoading}
              sx={{
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                boxShadow: "0 4px 15px rgba(102,126,234,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a72d4, #6a4293)",
                  boxShadow: "0 6px 20px rgba(102,126,234,0.45)",
                },
              }}
            >
              Upload & Import
            </Button>
            <Button
              variant="outlined"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
              disabled={isLoading}
              sx={{
                borderRadius: 2.5,
                textTransform: "none",
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.7)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.4)",
                  bgcolor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
        {isLoading && (
          <LinearProgress
            sx={{
              mt: 3,
              borderRadius: 1,
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #667eea, #764ba2)",
              },
            }}
          />
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
