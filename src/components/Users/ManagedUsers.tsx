import React, { useEffect, useState } from 'react'
import StripedDataTable from "../StripedDataTable";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, IconButton, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";

import { IExam, IUser } from "../../helpers/constants";
import { deleteExamById, deleteUserById, getExamsByCurrentUser, getUsers } from "../../helpers/fetch";

export const useDebouncedEffect = (effect: () => void, deps: any[], delay: number): void => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

interface ActionCellProps {
  id: string;
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
  const [openCreate, setOpenCreate] = useState(false)

  const ActionCell: React.FC<ActionCellProps> = ({ id }) => {
    const handleEdit = async () => {
      console.log(id);

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
        <Button sx={{ lineHeight: '0' }} onClick={handleEdit}>
          <EditIcon color="primary" />
        </Button>

        <Button
          sx={{ lineHeight: '0' }}
          title="Delete"
          color="primary"
          onClick={handleDelete}
        >
          <DeleteIcon color="error" />
        </Button>
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
      headerName: 'Action',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <ActionCell id={params.value} />
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
      .matches(/^.{8,30}$/, "Password should have at least 8 characters and max 30.")
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
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {

        // const dataContact = await createContact({ ...values, author: userName });
        // if (id) {
        //   if (typeof dataContact === "object") {
        //     await updateContactToOpp(id, {
        //       contactId: dataContact._id,
        //     });
        //     formik.resetForm();
        //   }
        //   else {
        //     if (dataContact) {
        //       await updateContactToOpp(id, {
        //         contactId: dataContact
        //       })
        //       formik.resetForm();
        //     }
        //   }
        // } else {
        //   if (typeof dataContact === "string") {
        //     toast.error("Email address already exists");
        //     setOpenCreate(true);
        //   } else {
        //     toast.success("Email address added successfully");
        //     setOpenCreate(false);
        //     formik.resetForm();
        //   }
        // }
        // loadDataTable();
      } catch (error) {
        // toast.error(`${error}`);
      }
    },
  });

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setIsCreateBtnDisabled(false)
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
              type='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

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
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button autoFocus onClick={handleCloseCreate} type='submit' title={"Create user"} sx={{ width: "40%", margin: "10px 0" }}>
              Create a new user
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
