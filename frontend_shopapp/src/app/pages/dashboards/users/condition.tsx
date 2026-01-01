import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export type AddUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  img: string;
  verified: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (form: AddUserForm) => void;
};

export default function AddUserDialog({ open, onClose, onAdd }: Props) {
  const [form, setForm] = useState<AddUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    img: "",
    verified: "true",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    onAdd(form);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      img: "",
      verified: "true",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        Add New User
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              name="firstName"
              label="First name"
              value={form.firstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="lastName"
              label="Last name"
              value={form.lastName}
              onChange={handleChange}
              fullWidth
            />
          </Stack>

          <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth />
          <TextField name="phone" label="Phone" value={form.phone} onChange={handleChange} fullWidth />
          <TextField
            name="img"
            label="Avatar URL (optional)"
            value={form.img}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="verified"
            label="Verified (true/false)"
            value={form.verified}
            onChange={handleChange}
            helperText='Nhập "true" hoặc "false"'
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
