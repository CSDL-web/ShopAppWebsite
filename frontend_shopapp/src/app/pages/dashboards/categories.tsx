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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { api } from "@/lib/api";


type CategoryRow = {
  uid: number;      // key thật
  id: number;       // STT hiển thị
  name: string;     // category name
  createdAt: string;
  active: boolean;
};

// format dd.mm.yyyy
const pad2 = (n: number) => String(n).padStart(2, "0");
const createdAtFromUid = (uid: number) => {
  const base = new Date(2023, 1, 1);
  const d = new Date(base);
  d.setDate(base.getDate() + uid);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
};
const reindex = (list: CategoryRow[]) => list.map((r, i) => ({ ...r, id: i + 1 }));

export default function CategoriesPage() {
  console.log(import.meta.env.VITE_API_URL);

  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // dialog add/edit
  const [open, setOpen] = useState(false);
  const [editingUid, setEditingUid] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", active: "true" });

  // mock load
useEffect(() => {
  (async () => {
    try {
      setLoading(true);

      const res = await api.get<{ id: number; name: string }[]>(
        "/categories/get_all_categories"
      );

      const mapped: CategoryRow[] = res.data.map((c, idx) => ({
        uid: c.id,
        id: idx + 1,
        name: c.name,
        createdAt: createdAtFromUid(c.id), // tạm
        active: true, // backend chưa trả thì để true
      }));

      setRows(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  })();
}, []);


  const filteredRows = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(k) || r.createdAt.includes(k) || String(r.id).includes(k)
    );
  }, [rows, q]);

  const close = () => {
    setOpen(false);
    setEditingUid(null);
    setForm({ name: "", active: "true" });
  };

  const openAdd = () => {
    setEditingUid(null);
    setForm({ name: "", active: "true" });
    setOpen(true);
  };

  const openEdit = (row: CategoryRow) => {
    setEditingUid(row.uid);
    setForm({ name: row.name, active: row.active ? "true" : "false" });
    setOpen(true);
  };

  const handleSave = () => {
    const name = form.name.trim();
    if (!name) return;

    const active = form.active === "true";

    // edit
    if (editingUid !== null) {
      setRows((prev) =>
        reindex(
          prev.map((r) =>
            r.uid === editingUid ? { ...r, name, active } : r
          )
        )
      );
      close();
      return;
    }

    // add
    const maxUid = rows.reduce((m, r) => Math.max(m, r.uid), 0);
    const uid = maxUid + 1;

    const newRow: CategoryRow = {
      uid,
      id: 0,
      name,
      createdAt: createdAtFromUid(uid),
      active,
    };

    setRows((prev) => reindex([newRow, ...prev]));
    close();
  };

  const handleDelete = (uid: number) => {
    setRows((prev) => reindex(prev.filter((r) => r.uid !== uid)));
  };

  const columns: GridColDef<CategoryRow>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 240 },
    { field: "createdAt", headerName: "Created At", width: 160 },
    {
      field: "active",
      headerName: "Active",
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
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => openEdit(p.row)}>
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(p.row.uid)}>
            <DeleteOutlineRoundedIcon fontSize="small" />
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
          zIndex: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Categories
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ bgcolor: "white", color: "#111", "&:hover": { bgcolor: "#eee" } }}
          >
            Add New Category
          </Button>
        </Stack>
      </Box>

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

      {/* Dialog add/edit */}
      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {editingUid !== null ? "Edit Category" : "Add New Category"}
          <IconButton onClick={close} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Active ("true" / "false")'
              value={form.active}
              onChange={(e) => setForm((p) => ({ ...p, active: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

