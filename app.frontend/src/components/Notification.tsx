import { Snackbar, Alert } from "@mui/material";
import React from "react";

export interface NotificationProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = "success",
  autoHideDuration = 2500,
  anchorOrigin = { vertical: "top", horizontal: "right" },
  onClose,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={anchorOrigin}
  >
    <Alert severity={severity} sx={{ width: "100%" }} onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;
