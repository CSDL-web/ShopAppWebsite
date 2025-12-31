import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

/** Ý nghĩa: Kiểu user từ API DummyJSON */
type ApiUser = {
  id: number;
  image?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

/** Ý nghĩa: Row dùng cho DataGrid (uid = khóa thật, id = STT hiển thị 1..n) */
type UserRow = {
  uid: number; // unique key ổn định cho DataGrid
  id: number; // STT hiển thị (sẽ được reindex sau add/delete)
  img?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string; // dd.mm.yyyy (tạm từ uid)
  verified: boolean; // tạm từ uid
};

/** Ý nghĩa: Format số 1 chữ số -> 2 chữ số (01, 02, ...) */
function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Ý nghĩa: Tạo createdAt “giả” từ uid để giữ UI, sau này thay bằng API thật */
function createdAtFromUid(uid: number) {
  const base = new Date(2023, 1, 1); // 01/02/2023
  const d = new Date(base);
  d.setDate(base.getDate() + uid);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** Ý nghĩa: Đánh lại STT id = 1..n để sau xóa vẫn liên tục */
function reindex(list: UserRow[]) {
  return list.map((r, idx) => ({ ...r, id: idx + 1 }));
}

export default function UsersPage() {
  /** Ý nghĩa: rows là dữ liệu hiển thị trong bảng (uid là key thật) */
  const [rows, setRows] = useState<UserRow[]>([]);

  /** Ý nghĩa: loading cho DataGrid khi đang fetch API */
  const [loading, setLoading] = useState(false);

  /** Ý nghĩa: text search */
  const [q, setQ] = useState("");

  /** Ý nghĩa: state cho dialog thêm user (local) */
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    img: "",
    verified: "true",
  });

  /** Ý nghĩa: Fetch users từ API free và map về UserRow cho DataGrid */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/users");
      if (!res.ok) throw new Error("Fetch failed: " + res.status);
      const data: { users: ApiUser[] } = await res.json();

      const mapped: UserRow[] = (data.users ?? []).map((u) => ({
        uid: u.id, // ✅ key ổn định lấy từ API
        id: 0, // sẽ được reindex() thành STT 1..n
        img: u.image,
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        createdAt: createdAtFromUid(u.id), // tạm từ uid
        verified: u.id % 2 === 0, // tạm từ uid (chẵn = verified)
      }));

      setRows(reindex(mapped));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /** Ý nghĩa: Load dữ liệu 1 lần khi vào trang */
  useEffect(() => {
    fetchUsers();
  }, []);

  /** Ý nghĩa: Lọc dữ liệu theo ô search */
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

  /** Ý nghĩa: Đóng dialog + reset form */
  const close = () => {
    setOpen(false);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      img: "",
      verified: "true",
    });
  };

  /** Ý nghĩa: Add user lên ĐẦU bảng + reindex để STT liên tục */
  const handleAdd = () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const verified = form.verified === "true";
    if (!firstName || !lastName || !email || !phone) return;

    const maxUid = rows.reduce((m, r) => Math.max(m, r.uid), 0);
    const newUid = maxUid + 1;

    const newRow: UserRow = {
      uid: newUid,
      id: 0, // sẽ được reindex
      img: form.img.trim() || `https://i.pravatar.cc/80?u=${newUid}`,
      firstName,
      lastName,
      email,
      phone,
      createdAt: createdAtFromUid(newUid),
      verified,
    };

    setRows((prev) => reindex([newRow, ...prev])); // ✅ lên đầu + STT chạy lại 1..n
    close();
  };

  /** Ý nghĩa: Ghi nhận (demo UI; sau này gọi API thật) */
  const handleConfirm = (uid: number) => {
    alert("Đã ghi nhận user uid: " + uid);
  };

  /** Ý nghĩa: Xóa user theo uid + reindex để STT không bị nhảy */
  const handleCancel = (uid: number) => {
    setRows((prev) => reindex(prev.filter((r) => r.uid !== uid)));
  };

  /** Ý nghĩa: Cột DataGrid (id là STT; getRowId sẽ dùng uid làm key thật) */
  const columns: GridColDef<UserRow>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },

      {
        field: "img",
        headerName: "Avatar",
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <img
            src={params.value || "/noavatar.png"}
            alt=""
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ),
      },

      {
        field: "name",
        headerName: "Name",
        width: 220,
        valueGetter: (_value, row) => `${row.firstName} ${row.lastName}`,
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
        renderCell: (params) =>
          params.value ? (
            <CheckIcon sx={{ color: "success.main" }} />
          ) : (
            <CloseRoundedIcon sx={{ color: "text.disabled" }} />
          ),
      },

      {
        field: "action",
        headerName: "Action",
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="success"
              onClick={() => handleConfirm(params.row.uid)}
            >
              <CheckIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => handleCancel(params.row.uid)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [rows]
  );

  return (
    <Box>
      {/* Ý nghĩa: Header giống hình + nút mở dialog add */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: "#2f3b52",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ bgcolor: "white", color: "#111", "&:hover": { bgcolor: "#eee" } }}
          >
            Add New User
          </Button>
        </Stack>
      </Box>

      {/* Ý nghĩa: Khối chứa search + bảng */}
      <Box sx={{ p: 2 }}>
        <Paper sx={{ borderRadius: 2, p: 2 }}>
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
            getRowId={(row) => row.uid} // ✅ DataGrid dùng uid làm key thật
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": { borderBottom: "1px solid rgba(0,0,0,0.08)" },
              "& .MuiDataGrid-row": { borderBottom: "1px solid rgba(0,0,0,0.05)" },
            }}
          />
        </Paper>
      </Box>

      {/* Ý nghĩa: Dialog add user (add local để dựng UI trước) */}
      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Add New User
          <IconButton onClick={close} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                label="First name"
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Last name"
                value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                fullWidth
              />
            </Stack>

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Avatar URL (optional)"
              value={form.img}
              onChange={(e) => setForm((p) => ({ ...p, img: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Verified (true/false)"
              value={form.verified}
              onChange={(e) => setForm((p) => ({ ...p, verified: e.target.value }))}
              fullWidth
              helperText='Nhập "true" hoặc "false"'
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
