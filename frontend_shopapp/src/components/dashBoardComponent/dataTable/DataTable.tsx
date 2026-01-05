import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowModes,
  GridRowModesModel,
  GridToolbar,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "./dataTable.scss";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const DataTable = (props: Props) => {
  const [data, setData] = useState(props.rows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleEditClick = (id: number) => {
    setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = (id: number) => {
    setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: GridRowModes.View },
    }));
  };

  const handleCancelClick = (id: number) => {
    setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((row) => (row as { id: number }).id !== id));
  };

  const handleRowDoubleClick = (params: any) => {
    handleEditClick(params.id);
  };

  const processRowUpdate = (newRow: any) => {
    setData((prevData) => prevData.map((row) => ((row as { id: number }).id === newRow.id ? newRow : row)));
    return newRow;
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;
      return (
        <div className="action">
          <Link to={`/${props.slug}/${params.row.id}`}>
            <img src="/view.svg" alt="View" />
          </Link>
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="Delete" />
          </div>
          {!isInEditMode && (
            <div className="edit" onClick={() => handleEditClick(params.row.id)}>
              <img src="/edit.svg" alt="Edit" />
            </div>
          )}

          {isInEditMode && (
            <div className="editActions">
              <div className="save" onClick={() => handleSaveClick(params.row.id)}>
                <img src="/save.svg" alt="Save" />
              </div>
              <div className="cancel" onClick={() => handleCancelClick(params.row.id)}>
                <img src="/cancel.svg" alt="Cancel" />
              </div>
            </div>
          )}
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={data}
        columns={[...props.columns, actionColumn]}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowDoubleClick={handleRowDoubleClick}
        processRowUpdate={processRowUpdate}
        onRowEditStop={(params) => {
          if (params.reason === 'escapeKeyDown' || params.reason === 'rowFocusOut') {
            handleCancelClick(params.row.id);
          }
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
