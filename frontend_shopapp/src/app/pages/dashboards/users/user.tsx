import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloseIcon from "@mui/icons-material/Close";

import AddUserDialog, { AddUserForm } from "./condition";

type ApiUser = {
  id: number;
  image?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type UserRow = {
  uid: number;
  id: number; // STT
  img?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  verified: boolean;
};

/* ================= UTILS ================= */

const pad2 = (n: number) => String(n).padStart(2, "0");

const createdAtFromUid = (uid: number) => {
  const base = new Date(2023, 1, 1);
  const d = new Date(base);
  d.setDate(base.getDate() + uid);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
};

const reindex = (list: UserRow[]) =>
  list.map((r, idx) => ({ ...r, id: idx + 1 }));


export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await fetch("https://dummyjson.com/users");
      const data: { users: ApiUser[] } = await res.json();

      const mapped: UserRow[] = data.users.map((u) => ({
        uid: u.id,
        id: 0,
        img: u.image,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        createdAt: createdAtFromUid(u.id),
        verified: u.id % 2 === 0,
      }));

      setRows(reindex(mapped));
      setLoading(false);
    };

    fetchUsers();
  }, []);

  /* ===== SEARCH ===== */
  const filteredRows = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return rows;

    return rows.filter((r) => {
      const name = `${r.firstName} ${r.lastName}`.toLowerCase();
      return (
        String(r.id).includes(k) ||
        String(r.uid).includes(k) ||
        name.includes(k) ||
        r.email.toLowerCase().includes(k) ||
        r.phone.toLowerCase().includes(k)
      );
    });
  }, [rows, q]);

  /* ===== ADD USER ===== */
  const handleAdd = (form: AddUserForm) => {
    const { firstName, lastName, email, phone } = form;
    if (!firstName || !lastName || !email || !phone) return;

    const maxUid = rows.reduce((m, r) => Math.max(m, r.uid), 0);
    const uid = maxUid + 1;

    const newRow: UserRow = {
      uid,
      id: 0,
      img: form.img || `https://i.pravatar.cc/80?u=${uid}`,
      firstName,
      lastName,
      email,
      phone,
      createdAt: createdAtFromUid(uid),
      verified: form.verified === "true",
    };

    setRows((prev) => reindex([newRow, ...prev]));
    setOpen(false);
  };

  const handleCancel = (uid: number) => {
    setRows((prev) => reindex(prev.filter((r) => r.uid !== uid)));
  };

  /* ===== COLUMNS ===== */
  const columns: GridColDef<UserRow>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      {
        field: "img",
        headerName: "Avatar",
        width: 110,
        renderCell: (p) => (
          <img
            src={p.value || "/noavatar.png"}
            style={{ width: 34, height: 34, borderRadius: "50%" }}
          />
        ),
      },
      {
        field: "name",
        headerName: "Name",
        width: 220,
        valueGetter: (_, row) => `${row.firstName} ${row.lastName}`,
      },
      { field: "email", headerName: "Email", width: 260 },
      { field: "phone", headerName: "Phone", width: 180 },
      { field: "createdAt", headerName: "Created At", width: 150 },
      {
        field: "verified",
        headerName: "Verified",
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: (p) =>
          p.value ? (
            <CheckIcon sx={{ color: "success.main" }} />
          ) : (
            <CloseRoundedIcon sx={{ color: "text.disabled" }} />
          ),
      },
      {
        field: "action",
        headerName: "Action",
        width: 140,
        renderCell: (p) => (
          <IconButton
            size="small"
            color="error"
            onClick={() => handleCancel(p.row.uid)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [rows]
  );

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: "#2f3b52", color: "white" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ bgcolor: "white", color: "#111" }}
          >
            Add New User
          </Button>
        </Stack>
      </Box>

      {/* TABLE */}
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <TextField
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            size="small"
            sx={{ mb: 1.5, maxWidth: 420 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.uid}
            autoHeight
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
          />
        </Paper>
      </Box>

      {/* DIALOG */}
      <AddUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
      />
    </Box>
  );
}
