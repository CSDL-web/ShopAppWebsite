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

/* Dữ liệu product từ API DummyJSON (mình chỉ lấy mấy field cần UI) */
type ApiProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail?: string;
};

/* Dòng dữ liệu dùng cho DataGrid
   uid: key thật (ổn định)
   id : STT hiển thị (1..n, tự chạy lại) */
type ProductRow = {
  uid: number;
  id: number;
  thumbnail?: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  createdAt: string; 
  active: boolean; 
};

/* Format số 1 chữ số thành 2 chữ số */
const pad2 = (n: number) => String(n).padStart(2, "0");

/* Tạo ngày giả từ uid để giữ layout UI (sau này thay API thật) */
const createdAtFromUid = (uid: number) => {
  const base = new Date(2023, 1, 1); // 01/02/2023
  const d = new Date(base);
  d.setDate(base.getDate() + uid);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
};

/* Đánh lại STT id = 1..n sau khi add / delete */
const reindex = (list: ProductRow[]) => list.map((r, i) => ({ ...r, id: i + 1 }));

export default function ProductsPage() {
  /* State chứa dữ liệu hiển thị trong bảng */
  const [rows, setRows] = useState<ProductRow[]>([]);

  /* Loading cho DataGrid khi gọi API */
  const [loading, setLoading] = useState(false);

  /* Text search */
  const [q, setQ] = useState("");

  /* State cho dialog thêm product */
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    thumbnail: "",
    active: "true",
  });

  /* Gọi API DummyJSON để lấy products */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/products");
      if (!res.ok) throw new Error("Fetch failed: " + res.status);
      const data: { products: ApiProduct[] } = await res.json();

      const mapped: ProductRow[] = (data.products ?? []).map((p) => ({
        uid: p.id, // key thật lấy từ API
        id: 0, // sẽ được reindex lại
        thumbnail: p.thumbnail,
        title: p.title ?? "",
        category: p.category ?? "",
        price: Number(p.price ?? 0),
        stock: Number(p.stock ?? 0),
        rating: Number(p.rating ?? 0),
        createdAt: createdAtFromUid(p.id),
        active: p.id % 2 === 0, // tạm từ uid
      }));

      setRows(reindex(mapped));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* Load dữ liệu 1 lần khi vào trang */
  useEffect(() => {
    fetchProducts();
  }, []);

  /* Lọc dữ liệu theo search */
  const filteredRows = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return rows;

    return rows.filter((r) => {
      return (
        String(r.id).includes(k) ||
        r.title.toLowerCase().includes(k) ||
        r.category.toLowerCase().includes(k) ||
        String(r.price).includes(k) ||
        String(r.stock).includes(k)
      );
    });
  }, [rows, q]);

  /* Đóng dialog và reset form */
  const close = () => {
    setOpen(false);
    setForm({
      title: "",
      category: "",
      price: "",
      stock: "",
      rating: "",
      thumbnail: "",
      active: "true",
    });
  };

  /* Thêm product mới lên đầu bảng + chạy lại STT */
  const handleAdd = () => {
    const title = form.title.trim();
    const category = form.category.trim();
    if (!title || !category) return;

    const price = Number(form.price || 0);
    const stock = Number(form.stock || 0);
    const rating = Number(form.rating || 0);
    const active = form.active === "true";

    const maxUid = rows.reduce((m, r) => Math.max(m, r.uid), 0);
    const newUid = maxUid + 1;

    const newRow: ProductRow = {
      uid: newUid,
      id: 0,
      thumbnail: form.thumbnail.trim() || `https://picsum.photos/seed/p_${newUid}/80/80`,
      title,
      category,
      price,
      stock,
      rating,
      createdAt: createdAtFromUid(newUid),
      active,
    };

    setRows((prev) => reindex([newRow, ...prev]));
    close();
  };

  /* Action demo – sau này thay bằng API thật */
  const handleConfirm = (uid: number) => {
    alert("Ghi nhận product uid: " + uid);
  };

  /* Xóa product và đánh lại STT */
  const handleCancel = (uid: number) => {
    setRows((prev) => reindex(prev.filter((r) => r.uid !== uid)));
  };

  /* Khai báo cột DataGrid */
  const columns: GridColDef<ProductRow>[] = [
    { field: "id", headerName: "ID", width: 80 },

    {
      field: "thumbnail",
      headerName: "Image",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (p) => (
        <img
          src={p.value || "/noavatar.png"}
          alt=""
          style={{ width: 42, height: 42, borderRadius: 8, objectFit: "cover" }}
        />
      ),
    },

    { field: "title", headerName: "Title", width: 260 },
    { field: "category", headerName: "Category", width: 180 },

    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueGetter: (_value, row) => `$${row.price.toFixed(2)}`,
    },

    { field: "stock", headerName: "Stock", width: 110 },
    { field: "rating", headerName: "Rating", width: 110 },
    { field: "createdAt", headerName: "Created At", width: 150 },

    {
      field: "active",
      headerName: "Active",
      width: 110,
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
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="success" onClick={() => handleConfirm(p.row.uid)}>
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleCancel(p.row.uid)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
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
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ bgcolor: "white", color: "#111", "&:hover": { bgcolor: "#eee" } }}
          >
            Add New Product
          </Button>
        </Stack>
      </Box>

      {/* Bảng dữ liệu */}
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
            getRowId={(row) => row.uid}
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

      {/* Dialog thêm product */}
      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Add New Product
          <IconButton onClick={close} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Category"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                label="Price"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Stock"
                value={form.stock}
                onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Rating"
                value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
                fullWidth
              />
            </Stack>

            <TextField
              label="Thumbnail URL (optional)"
              value={form.thumbnail}
              onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Active (true/false)"
              value={form.active}
              onChange={(e) => setForm((p) => ({ ...p, active: e.target.value }))}
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
