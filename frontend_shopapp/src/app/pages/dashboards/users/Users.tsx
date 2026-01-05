import { GridColDef } from "@mui/x-data-grid";
import "./Users.scss";
import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/dashBoardComponent/dataTable/DataTable";
import Add from "@/components/dashBoardComponent/add/Add";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
  getAllUsers,
  selectUsers,
  selectUsersLoading,
  User,
} from "@/stores/users";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "fullname",
    headerName: "Full Name",
    width: 200,
    editable: true,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 250,
    editable: true,
  },
  {
    field: "phone_number",
    type: "string",
    headerName: "Phone Number",
    width: 150,
    editable: true,
  },
  {
    field: "address",
    type: "string",
    headerName: "Address",
    width: 200,
    editable: true,
  },

  {
    field: "role_id",
    headerName: "Role",
    width: 100,
    type: "number",
    editable: true,
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);

  const fetchUsers = useCallback(() => {
    const skip = paginationModel.page * paginationModel.pageSize;
    const limit = paginationModel.pageSize;
    dispatch(getAllUsers({ skip, limit }));
  }, [dispatch, paginationModel]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePaginationModelChange = (newModel: any) => {
    setPaginationModel(newModel);
  };

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>

      <DataTable
        slug="users"
        columns={columns}
        rows={users}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10, 20, 50]}
      />

      {open && (
        <Add slug="user" columns={columns} setOpen={setOpen} mode="add" />
      )}
    </div>
  );
};

export default Users;
