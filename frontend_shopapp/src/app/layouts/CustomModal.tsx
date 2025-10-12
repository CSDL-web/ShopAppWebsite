import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface CustomModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onOk?: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  open,
  onClose,
  onOk,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        {onOk && (
          <Button onClick={onOk} color="primary" variant="contained">
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
