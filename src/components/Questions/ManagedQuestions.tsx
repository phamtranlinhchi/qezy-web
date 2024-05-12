import React, { useEffect, useState } from 'react'
import StripedDataTable from "../StripedDataTable";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';

import { formatDateTime } from "../../helpers/handleData";
import { deleteQuestionById, getQuestionsByCurrentUser } from "../../helpers/fetch";

export const useDebouncedEffect = (effect: () => void, deps: any[], delay: number): void => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};
export const ManagedQuestions = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSizeOptions, setPageSizeOptions] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hiddenPaginate, setHiddenPaginate] = useState<boolean>(false);
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<any[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isDltBtnDisabled, setIsDltBtnDisabled] = useState<boolean>(false)

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const questionColumns: GridColDef[] = [
    {
      field: "quest",
      headerName: "Question",
      flex: 2,
      filterable: false,
    },
    {
      field: "answers",
      headerName: "Answers",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const miningDate = new Date(params.value);
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            type: {params.row.type} <br />
            <ul style={{ padding: 0, margin: 0 }}>
              {params.row.answers.map((answer: any) => (<li style={{ color: answer.isTrue ? "green" : "black" }}>- {answer.answer}</li>))}
            </ul>
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
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

  ];

  async function loadDataTable() {
    setLoading(true);
    try {
      setHiddenPaginate(false);
      if (searchString === "") {
        setSearchString("");
      }
      let questions;
      questions = await getQuestionsByCurrentUser(pageSizeOptions, currentPage, searchString);
      if (Array.isArray(questions.docs)) {
        setRows(
          questions.docs.map((question: any) => {
            return { id: question._id, ...question };
          })
        );
        setTotalDocs(questions.totalDocs);
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
    let question: any;
    question = await getQuestionsByCurrentUser(pageSizeOptions, currentPage, searchString);
    if (Array.isArray(question.docs)) {
      const selectRowData = ids.map((id: string) => {
        return question.docs?.find((question: any) => question._id === id);
      });
      const filteredSelectRowData = selectRowData.filter((row) => row !== undefined) as any[];
      const updatedSelectedRows = [...selectedRows, ...filteredSelectRowData];
      const selectRows = ids?.map((id: string) => {
        return updatedSelectedRows?.find((quest: any) => quest._id === id);
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

  const deleteQuestion = async () => {
    for await (const row of selectedRows) {
      await deleteQuestionById(row._id);
    }
    setConfirmDialogOpen(false);
    loadDataTable()
    setIsDltBtnDisabled(false)
  }

  const handleDeleteQuestion = () => {
    setConfirmDialogOpen(true);
    setIsDltBtnDisabled(true)
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setIsDltBtnDisabled(false)
  };

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
          {"Confirm Deleting Question"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can not recover the question(s) when it is deleted and one has been added to exams also be removed. Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseConfirmDialog}>
            Cancel
          </Button>
          <Button onClick={deleteQuestion} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <h3>My Questions</h3>
      <Box
        sx={{
          marginTop: 3,
          marginBottom: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}>
        <TextField label='Search for question' id='fullWidth' onChange={handleSearchChange} size="small" sx={{ marginTop: 2, width: "30%" }} />
        <Box sx={{ display: "flex", height: "100%", mt: 1 }}>
          <Tooltip title='Select 1 or many question(s) to delete'>
            {/* If button is disabled, tooltip wont work without span */}
            <span>
              <Button color='error' onClick={handleDeleteQuestion} disabled={!(selectedRows.length > 0) || isDltBtnDisabled}>
                <DeleteOutlineIcon sx={{ fontSize: "28px" }} />
                Delete
              </Button>
            </span>
          </Tooltip>
          <Tooltip title='Create question'>
            <Button color='success' onClick={loadDataTable}>
              <AddIcon sx={{ fontSize: "28px" }} />
              Question
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
        columns={questionColumns}
        loading={loading}
      />
    </div>
  )
}
