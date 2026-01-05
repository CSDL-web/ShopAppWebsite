import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
import { Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IconButton, Stack, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch } from "@/stores";
import {
  blockUnblockUser,
  deleteUser,
  updateUserProfile,
} from "@/stores/users";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  loading?: boolean;
  paginationModel?: any;
  onPaginationModelChange?: (model: any) => void;
  pageSizeOptions?: number[];
  onBlockUnblock?: (id: number, isActive: boolean) => void;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: any) => Promise<void>;
  refetchData?: () => void;
};

const DataTable = (props: Props) => {
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>({});

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        if (props.onDelete) {
          props.onDelete(id);
        } else {
          await dispatch(deleteUser(id)).unwrap();
          if (props.refetchData) {
            props.refetchData();
          }
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleBlockUnblock = async (id: number, isActive: boolean) => {
    const action = isActive ? "block" : "unblock";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        if (props.onBlockUnblock) {
          props.onBlockUnblock(id, isActive);
        } else {
          await dispatch(
            blockUnblockUser({ user_id: id, active: !isActive })
          ).unwrap();
          if (props.refetchData) {
            props.refetchData();
          }
        }
      } catch (error) {
        console.error(`Failed to ${action} user:`, error);
        alert(`Failed to ${action} user. Please try again.`);
      }
    }
  };

  const handleSave = async (id: number) => {
    const data = editingData[id];

    if (!data) {
      console.warn("No data to save for user:", id);
      return;
    }

    try {
      if (props.onUpdate) {
        await props.onUpdate(id, data);
      }

      setEditingId(null);
      setEditingData((prev: any) => {
        const clone = { ...prev };
        delete clone[id];
        return clone;
      });

      props.refetchData?.();
      console.log("User updated successfully:", data);
      const payload = {
        fullname: data.fullname,
        address: data.address,
        email: data.email,
      };
      const res = dispatch(updateUserProfile(payload)).unwrap();
      alert("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setEditingData((prev: any) => ({
      ...prev,
      [row.id]: { ...row },
    }));
  };

  const handleEditChange = (id: number, field: string, value: any) => {
    if (editingId !== id) return;
    setEditingData((prev: any) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {}),
        [field]: value,
      },
    }));
  };

  const handleCancel = (id: number) => {
    setEditingId(null);
    setEditingData((prev: any) => {
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });
  };

  const renderEditableCell = (params: any) => {
    const { id, field, value } = params;
    const isEditing = editingId === id;

    const EDITABLE_FIELDS = ["fullname", "address", "email"];

    if (isEditing && EDITABLE_FIELDS.includes(field)) {
      return (
        <input
          value={editingData[id]?.[field] ?? value ?? ""}
          onChange={(e) => handleEditChange(id, field, e.target.value)}
          className="editable-input"
        />
      );
    }

    return value ?? "-";
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Actions",
    width: 200,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const { id, is_active } = params.row;
      const isEditing = editingId === id;

      return (
        <div className="action-cell-container">
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="center"
          >
            {!isEditing ? (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(params.row)}
                    className="action-button"
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* BLOCK/UNBLOCK BUTTON */}
                <Tooltip title={is_active ? "Block User" : "Unblock User"}>
                  <IconButton
                    size="small"
                    color={is_active ? "warning" : "success"}
                    onClick={() => handleBlockUnblock(id, is_active)}
                    className="action-button"
                  >
                    {is_active ? (
                      <BlockIcon fontSize="small" />
                    ) : (
                      <CheckCircleIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>

                {/* DELETE BUTTON */}
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(id)}
                    className="action-button"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                {/* SAVE BUTTON */}
                <Tooltip title="Save">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleSave(id)}
                    className="action-button"
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* CANCEL BUTTON */}
                <Tooltip title="Cancel">
                  <IconButton
                    size="small"
                    onClick={() => setEditingId(null)}
                    className="action-button"
                  >
                    <CloseIcon
                      fontSize="small"
                      onClick={() => handleCancel(id)}
                    />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        </div>
      );
    },
  };

  // Add edit handlers to columns
  const editableColumns = props.columns.map((col) => {
    if (col.field !== "action" && col.field !== "id") {
      return {
        ...col,
        renderCell: renderEditableCell,
        editable: true,
      };
    }
    return col;
  });

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...editableColumns, actionColumn]}
        loading={props.loading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={props.pageSizeOptions || [5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        paginationModel={props.paginationModel}
        onPaginationModelChange={props.onPaginationModelChange}
        getRowId={(row) => row.id}
        autoHeight
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-row": {
            minHeight: "60px !important",
          },
        }}
      />
    </div>
  );
};

export default DataTable;
