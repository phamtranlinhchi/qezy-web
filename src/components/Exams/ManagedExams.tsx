import React, { useEffect, useState } from 'react'
import StripedDataTable from "../StripedDataTable";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { formatDateTime } from "../../helpers/handleData";
import { IExam } from "../../helpers/constants";
import { deleteExamById, getExamById, getExamsByCurrentUser, updateExamById } from "../../helpers/fetch";

interface ActionCellProps {
  id: string;
  handleEdit: any;
  handleCloseEditDialog: any;
  handleDelete: any;
}

export const useDebouncedEffect = (effect: () => void, deps: any[], delay: number): void => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};
export const ManagedExams = () => {
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
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [isDltBtnDisabled, setIsDltBtnDisabled] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState("");
  const [examEdited, setExamEdited] = useState<any>();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleEdit = async (id: any) => {
    setEditDialogOpen(true);
    setEditId(id);
    const currExam = await getExamById(id);
    delete currExam._id;
    delete currExam.creator;
    delete currExam.createdAt;
    delete currExam.updatedAt;
    delete currExam.__v;
    currExam.questions = currExam.questions.map((question: any) => {
      const { quest, answers } = question.questionId
      const { point } = question
      return {
        questionId: {
          quest,
          answers: answers.map((a: any) => {
            const { answer, isTrue } = a;
            return {
              answer,
              isTrue
            }
          })
        },
        point
      }
    })
    setExamEdited(currExam);
  }

  const handleDelete = async (id: any) => {
    setDeleteId(id);
    handleDeleteExam();
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditId("");
  };
  const ActionCell: React.FC<ActionCellProps> = ({ id, handleEdit, handleCloseEditDialog, handleDelete }) => {

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: '60%',
        }}
      >
        <Tooltip title='See all results of this exam'>
          <span>
            <Button sx={{ lineHeight: '0' }} onClick={() => handleEdit(id)}>
              <ListAltIcon color="success" />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Edit exam">
          <span>
            <Button sx={{ lineHeight: '0' }} onClick={() => handleEdit(id)}>
              <EditIcon color="primary" />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Delete exam">
          <span>
            <Button
              sx={{ lineHeight: '0' }}
              title="Delete"
              color="primary"
              onClick={() => handleDelete(id)}
            >
              <DeleteIcon color="error" />
            </Button>
          </span>
        </Tooltip>
      </Box>
    );
  };


  const examColumns: GridColDef[] = [
    {
      field: "examTitle",
      headerName: "Exam",
      flex: 3,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div>
            <div>
              {/* <a target='_blank' rel='noreferrer' href={params.value}> */}
              {params.value}
              {/* </a> */}
            </div>
          </div>
        );
      },
    },
    {
      field: "questions",
      headerName: "Questions",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const miningDate = new Date(params.value);
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <>
              <div style={{ display: "flex", textAlign: "center" }}>
                {/* <Typography variant='h5' sx={{ marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}> */}
                {/* question:&nbsp; */}
                {/* </Typography> */}
                {params.row.questions.length} {params.row.questions.length > 1 ? "questions" : "question"}
              </div>
              <div style={{ display: "flex", textAlign: "center" }}>
                {/* <Typography variant='h5' sx={{ marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}> */}
                {/* total point:&nbsp; */}
                {/* </Typography> */}
                {params.row.questions.reduce((total: any, question: any) =>
                  total + question.point, 0)
                } point(s)
              </div>
            </>
          </div>
        );
      },
    },
    {
      field: "creator",
      headerName: "Author",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div style={{ display: "flex" }}>
            <Avatar />
            <div style={{ paddingLeft: "10px" }}>
              <div>{params.value.fullName}</div>
              <div style={{ fontSize: "12px" }}>{params.value.username}</div>
            </div>
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const miningDate = new Date(params.value);
        return (
          <div style={{ display: "flex", flexDirection: "column", color: "grey" }}>
            {params.row.createdAt && params.row.updatedAt && (
              <>
                <div style={{ display: "flex", textAlign: "center" }}>
                  <Typography variant='h5' sx={{ marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                    update:&nbsp;
                  </Typography>
                  {formatDateTime(params.row.updatedAt)}
                </div>
                <div style={{ display: "flex", textAlign: "center" }}>
                  <Typography variant='h5' sx={{ marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>
                    create:&nbsp;&nbsp;
                  </Typography>
                  {formatDateTime(params.row.createdAt)}
                </div>
              </>
            )}
          </div>
        );
      },
    },
    {
      field: '_id',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <ActionCell id={params.value}
          handleEdit={handleEdit}
          handleCloseEditDialog={handleCloseEditDialog}
          handleDelete={handleDelete}
        />
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
      let exams;
      exams = await getExamsByCurrentUser(pageSizeOptions, currentPage, searchString);
      if (Array.isArray(exams.docs)) {
        setRows(
          exams.docs.map((exam: IExam) => {
            return { id: exam._id, ...exam };
          })
        );
        setTotalDocs(exams.totalDocs);
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
    let exams: any;
    exams = await getExamsByCurrentUser(pageSizeOptions, currentPage, searchString);
    if (Array.isArray(exams.docs)) {
      const selectRowData = ids.map((id: string) => {
        return exams.docs?.find((exam: IExam) => exam._id === id);
      });
      const filteredSelectRowData = selectRowData.filter((row) => row !== undefined) as IExam[];
      const updatedSelectedRows = [...selectedRows, ...filteredSelectRowData];
      const selectRows = ids?.map((id: string) => {
        return updatedSelectedRows?.find((exam: IExam) => exam._id === id);
      });
      setSelectedRows(selectRows as IExam[]);
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

  const deleteExam = async (id?: string) => {
    if (id)
      await deleteExamById(id);
    else
      for await (const row of selectedRows) {
        await deleteExamById(row._id);
      }
    setConfirmDialogOpen(false);
    loadDataTable()
    setIsDltBtnDisabled(false)
  }

  const handleDeleteExam = () => {
    setConfirmDialogOpen(true);
    setIsDltBtnDisabled(true)
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setIsDltBtnDisabled(false)
    setDeleteId("")
  };

  const editExam = async (id: any) => {
    await updateExamById(id, examEdited);
    setEditDialogOpen(false);
    loadDataTable()
  }

  return (
    <div>
      {/* Confirm delete */}
      <Dialog
        fullScreen={fullScreen}
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirm Deleting Exam"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can not recover the exam{deleteId ? "" : "(s)"} when it is deleted. Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseConfirmDialog}>
            Cancel
          </Button>
          <Button onClick={() => deleteId ? deleteExam(deleteId) : deleteExam()} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Edit Exam"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <pre
              id="json-content"
              style={{ overflow: 'scroll', height: '50vh' }}
            >
              {JSON.stringify(examEdited, null, 2)}
            </pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseEditDialog}>
            Cancel
          </Button>
          <Button onClick={() => editExam(editId)} color="error" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* <h3>My Exams</h3> */}
      <Box
        sx={{
          // marginTop: 3,
          marginBottom: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}>
        <TextField label='Search for exam' id='fullWidth' onChange={handleSearchChange} size="small" sx={{ marginTop: 2, width: "30%" }} />
        <Box sx={{ display: "flex", height: "100%", mt: 1 }}>
          <Tooltip title='Select 1 or many exam(s) to delete'>
            {/* If button is disabled, tooltip wont work without span */}
            <span>
              <Button color='error' onClick={handleDeleteExam} disabled={!(selectedRows.length > 0) || isDltBtnDisabled}>
                <DeleteOutlineIcon sx={{ fontSize: "28px" }} />
                Delete
              </Button>
            </span>
          </Tooltip>
          {/* <a target="_blank" href="http://localhost:8081"> */}
          <a href="http://localhost:8081">
            <Tooltip title='Create exam'>
              <Button color='success'
              // onClick={loadDataTable}
              >
                <AddIcon sx={{ fontSize: "28px" }} />
                Exam
              </Button>
            </Tooltip>
          </a>
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
