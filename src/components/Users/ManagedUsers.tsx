import React, { useEffect, useState } from 'react'
import StripedDataTable from "../StripedDataTable";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import { IExam, IUser } from "../../helpers/constants";
import { deleteUserById, getUserById, getUsers, register, updateUserById } from "../../helpers/fetch";

export const useDebouncedEffect = (effect: () => void, deps: any[], delay: number): void => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

interface ActionCellProps {
  id: string;
  role: string;
}

export const ManagedUsers = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSizeOptions, setPageSizeOptions] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hiddenPaginate, setHiddenPaginate] = useState<boolean>(false);
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<IExam[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<IExam[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isDltBtnDisabled, setIsDltBtnDisabled] = useState<boolean>(false)
  const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState("");
  const [openCreate, setOpenCreate] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errCreate, setErrCreate] = useState("")
  const [errEdit, setErrEdit] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [userEdited, setUserEdited] = useState<any>();

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  const ActionCell: React.FC<ActionCellProps> = ({ id, role }) => {
    const handleEdit = async () => {
      setEditId(id)
      setEditDialogOpen(true);
      const currUser = await getUserById(id)
      setUserEdited(currUser)
      const { username, fullName } = currUser;
      formikEdit.setValues({
        username, password: "", fullName
      });
    }

    const handleDelete = async () => {
      setDeleteId(id);
      handleDeleteUser();
    };


    return (
      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{
          width: '60%',
        }}
      >
        <Tooltip title="Edit user">
          <span>
            <Button sx={{ lineHeight: '0' }} onClick={handleEdit}>
              <EditIcon color="primary" />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Delete user">
          <span>
            <Button
              sx={{ lineHeight: '0' }}
              title="Delete"
              color="error"
              onClick={handleDelete}
              disabled={role === "admin"}

            >
              <DeleteIcon />
            </Button>
          </span>
        </Tooltip>
      </Box>
    );
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const examColumns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Avatar",
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Avatar />
        );
      },
    },
    {
      field: "username",
      headerName: "Username",
      flex: 3,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div>
            <div>
              <a target='_blank' rel='noreferrer' href={params.value}>
                {params.value}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 3,
      filterable: false,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 2,
      sortable: false,
      filterable: false,
    },
    {
      field: '_id',
      headerName: 'Actions',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <ActionCell id={params.value} role={params.row.role} />
      ),
    },
  ];

  async function loadDataTable() {
    setLoading(true);
    try {
      setHiddenPaginate(false);
      if (searchString === "") {
        setSearchString("");
      }
      let users;
      users = await getUsers(pageSizeOptions, currentPage, searchString);
      if (Array.isArray(users.docs)) {
        setRows(
          users.docs.map((user: any) => {
            return { id: user._id, ...user };
          })
        );
        setTotalDocs(users.totalDocs);
      } else {
        setRows([]);
      }
    } catch (error) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  const handleChangePageSizeOptions = (newPageSize: number) => {
    setPageSizeOptions(newPageSize);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const handleCurrentPage = function (page: number) {
    setCurrentPage(page);
  };

  const handleRowSelection = async (ids: string[]) => {
    let users: any;
    users = await getUsers(pageSizeOptions, currentPage, searchString);
    if (Array.isArray(users.docs)) {
      const selectRowData = ids.map((id: string) => {
        return users.docs?.find((user: any) => user._id === id);
      });
      const filteredSelectRowData = selectRowData.filter((row) => row !== undefined) as any[];
      const updatedSelectedRows = [...selectedRows, ...filteredSelectRowData];
      const selectRows = ids?.map((id: string) => {
        return updatedSelectedRows?.find((user: any) => user._id === id);
      });
      setSelectedRows(selectRows as any[]);
    }
  };

  const handleTotalPage = (totalPages: number) => {
    setTotalPages(totalPages);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSearchString(value);
  };

  useDebouncedEffect(
    () => {
      setCurrentPage(1);
      loadDataTable();
    },
    [searchString],
    800
  );

  useEffect(() => {
    loadDataTable();
  }, [currentPage, pageSizeOptions]);

  useEffect(() => {
    setCurrentPage(1);
    loadDataTable();
  }, [searchString]);

  const deleteUser = async (id?: string) => {
    if (id)
      await deleteUserById(id);
    else
      for await (const row of selectedRows) {
        await deleteUserById(row._id);
      }
    setConfirmDialogOpen(false);
    loadDataTable()
    setIsDltBtnDisabled(false);
  }

  const handleDeleteUser = () => {
    setConfirmDialogOpen(true);
    setIsDltBtnDisabled(true)
  }

  const handleCreateUser = () => {
    setOpenCreate(true);
    setIsCreateBtnDisabled(true)
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setIsDltBtnDisabled(false)
    setDeleteId("")
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required("Username is required"),
    password: yup
      .string()
      .matches(/^.{8,30}$/, "Password should have at least 8 characters and max 30")
      .required("Password is required"),
    fullName: yup
      .string()
      .matches(/^[a-zA-Z0-9\s&()_.]+$/, "Full name should only contain letters and spaces")
      .required("Full name is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      fullName: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { username, password, fullName } = values
        const user: any = await register(username, password, fullName);
        if (user?.status !== 200) {
          setOpenCreate(true);
          setErrCreate(user.message)
        } else {
          setOpenCreate(false);
          setErrCreate("")
          formik.resetForm();
          loadDataTable();
        }
      } catch (error) {
        console.log(error);

      }
    },
  });

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setIsCreateBtnDisabled(false)
    formik.resetForm();
    setErrCreate("")
  };

  const validationEditSchema = yup.object({
    username: yup
      .string()
      .required("Username is required"),
    password: yup
      .string()
      .matches(/^.{8,30}$/, "Password should have at least 8 characters and max 30"),
    fullName: yup
      .string()
      .matches(/^[a-zA-Z0-9\s&()_.]+$/, "Full name should only contain letters and spaces")
      .required("Full name is required"),
    role: yup
      .string()
      .required("Role is required")
      .oneOf(["admin", "user"])
  });

  const formikEdit = useFormik({
    initialValues: {
      username: "",
      password: "",
      fullName: "",
    },
    validationSchema: validationEditSchema,
    onSubmit: async (values) => {
      try {
        const { username, password, fullName } = values
        const user: any = await updateUserById(editId, { username, password, fullName });
        if (user?.status !== 200) {
          setEditDialogOpen(true);
          setErrEdit(user.message)
        } else {
          setEditDialogOpen(false);
          setErrEdit("")
          formikEdit.resetForm();
          loadDataTable();
        }
      } catch (error) {
        console.log(error);

      }
    },
  });

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    formikEdit.resetForm();
    setErrEdit("")
  };

  return (
    <div>
      {/* Create user */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={openCreate}
        onClose={handleCloseCreate}
        sx={{ textAlign: "center" }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Create User
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleCloseCreate}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              label='Full Name (*)'
              id='fullName'
              name='fullName'
              type='fullName'
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />

            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              label='Username (*)'
              id='username'
              name='username'
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />

            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              label='Password (*)'
              id='password'
              name='password'
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{ // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.role}
                label="Role"
              // onChange={handleChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {errCreate && <Box sx={{ color: "red", width: "100%", textAlign: "left" }}>
              {errCreate}
            </Box>}
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button autoFocus type='submit' title={"Create user"} sx={{ width: "40%", margin: "10px 0" }}>
              Create a new user
            </Button>
          </DialogActions>
        </form>

      </Dialog>

      {/* Edit user */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={editDialogOpen}
        onClose={handleCloseEdit}
        sx={{ textAlign: "center" }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Edit User
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleCloseEdit}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <form onSubmit={formikEdit.handleSubmit}>
          <DialogContent>
            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              label='Full Name (*)'
              id='fullName'
              name='fullName'
              type='fullName'
              value={formikEdit.values.fullName}
              onChange={formikEdit.handleChange}
              error={formikEdit.touched.fullName && Boolean(formikEdit.errors.fullName)}
              helperText={formikEdit.touched.fullName && formikEdit.errors.fullName}
            />

            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              label='Username'
              id='username'
              name='username'
              disabled
              value={formikEdit.values.username}
              // onChange={formikEdit.handleChange}
              error={formikEdit.touched.username && Boolean(formikEdit.errors.username)}
              helperText={formikEdit.touched.username && formikEdit.errors.username}
            />

            <TextField
              sx={{ marginBottom: "20px" }}
              fullWidth
              label='Set password'
              id='password'
              name='password'
              type={showPassword ? "text" : "password"}
              value={formikEdit.values.password}
              onChange={formikEdit.handleChange}
              error={formikEdit.touched.password && Boolean(formikEdit.errors.password)}
              helperText={formikEdit.touched.password && formikEdit.errors.password}
              InputProps={{ // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {errEdit && <Box sx={{ color: "red", width: "100%", textAlign: "left" }}>
              {errEdit}
            </Box>}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button autoFocus type='submit' color="success" title={"Save user"}>
              Save
            </Button>
          </DialogActions>
        </form>

      </Dialog>

      {/* Confirm delete */}
      <Dialog
        fullScreen={fullScreen}
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirm Deleting User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can not recover the account{deleteId ? "" : "(s)"} when it is deleted. Are you sure you still want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseConfirmDialog}>
            Cancel
          </Button>
          <Button onClick={() => deleteId ? deleteUser(deleteId) : deleteUser()} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* <h3>Users</h3> */}
      <Box
        sx={{
          // marginTop: 3,
          marginBottom: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}>
        <TextField label='Search for username' id='fullWidth' onChange={handleSearchChange} size="small" sx={{ marginTop: 2, width: "30%" }} />
        <Box sx={{ display: "flex", height: "100%", mt: 1 }}>
          <Tooltip title='Select 1 or many exam(s) to delete'>
            {/* If button is disabled, tooltip wont work without span */}
            <span>
              <Button color='error' onClick={handleDeleteUser} disabled={!(selectedRows.length > 0) || isDltBtnDisabled}>
                <DeleteOutlineIcon sx={{ fontSize: "28px" }} />
                Delete
              </Button>
            </span>
          </Tooltip>
          <Tooltip title='Create exam'>
            <Button color='success' onClick={handleCreateUser}>
              <AddIcon sx={{ fontSize: "28px" }} />
              User
            </Button>
          </Tooltip>
          <Tooltip title='Refresh data table'>
            <Button color='primary' onClick={loadDataTable}>
              <RefreshIcon sx={{ fontSize: "28px" }} />
              Refresh
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <StripedDataTable
        currentPage={currentPage}
        initialState={{
          columns: {
            columnVisibilityModel: {
              jobId: false,
            },
          },
        }}

        onChangePageSizeOptions={handleChangePageSizeOptions}
        hiddenFooter={hiddenPaginate}
        handlePage={handleCurrentPage}
        onSelectionModelChange={(ids: string[]) => {
          handleRowSelection(ids);
        }}
        handleTotalPage={handleTotalPage}
        checkboxSelection
        rowCount={totalDocs}
        rows={rows}
        disableVirtualization={hiddenPaginate}
        getHeight={true}
        columns={examColumns}
        loading={loading}
      />
    </div>
  )
}
