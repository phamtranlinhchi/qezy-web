import React, { useEffect, useState } from 'react'
import StripedDataTable from "../StripedDataTable";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { styled, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { formatDateTime } from "../../helpers/handleData";
import { deleteQuestionById, getQuestionById, getQuestionsByCurrentUser, updateQuestionById } from "../../helpers/fetch";

export const useDebouncedEffect = (effect: () => void, deps: any[], delay: number): void => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

interface ActionCellProps {
  id: string;
  handleEdit: any;
  handleCloseEditDialog: any;
  handleDelete: any;
}

export const ManagedQuestions = () => {
  // Dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [createQuestDialogOpen, setCreateQuestDialogOpen] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSizeOptions, setPageSizeOptions] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hiddenPaginate, setHiddenPaginate] = useState<boolean>(false);
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<any[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isDltBtnDisabled, setIsDltBtnDisabled] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState("");
  const [questionEdited, setQuestionEdited] = useState<any>();


  // Create question dialog
  const [quest, setQuest] = useState("")
  const [questionType, setQuestionType] = useState('radio');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  const DialogContentMemoized = React.memo(DialogContent);

  const handleEdit = async (id: any) => {
    setEditDialogOpen(true);
    setEditId(id);
    const currQuestion = await getQuestionById(id)
    setQuestionEdited(currQuestion)
  }

  const handleDelete = async (id: any) => {
    setDeleteId(id);
    handleDeleteQuestion();
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditId("");
  };
  const ActionCell: React.FC<ActionCellProps> = ({ id, handleEdit, handleCloseEditDialog, handleDelete }) => {

    return (
      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{
          width: '100%',
        }}
      >
        <Tooltip title="Edit question">
          <span>
            <Button sx={{ lineHeight: '0' }} onClick={() => handleEdit(id)}>
              <EditIcon color="primary" />
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Delete question">
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

  const questionColumns: GridColDef[] = [
    {
      field: "quest",
      headerName: "Question",
      flex: 3,
      filterable: false,
    },
    {
      field: "answers",
      headerName: "Answers",
      flex: 3,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const miningDate = new Date(params.value);
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* type: {params.row.type} <br /> */}
            <ul style={{ padding: 0, margin: 0 }}>
              {params.row.answers.map((answer: any) => (<li style={{ color: answer.isTrue ? "green" : "black", fontWeight: answer.isTrue ? "bold" : "normal" }}><input type="radio" checked={answer.isTrue} disabled /> {answer.answer}</li>))}
            </ul>
          </div>
        );
      },
    },
    {
      field: "examIds",
      headerName: "Exams",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ul style={{ padding: 0, margin: 0 }}>
              {params.row.examIds.map((exam: any) => (<li>{exam.examTitle}</li>))}
            </ul>
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
        <ActionCell id={params.value} handleEdit={handleEdit}
          handleCloseEditDialog={handleCloseEditDialog}
          handleDelete={handleDelete} />
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

  const deleteQuestion = async (id?: any) => {
    if (id)
      await deleteQuestionById(id);
    else
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

  const handleCloseConfirmDeleteDialog = () => {
    setConfirmDialogOpen(false);
    setIsDltBtnDisabled(false)
  };

  const editQuestion = async (id: any) => {
    await updateQuestionById(id, questionEdited);
    setEditDialogOpen(false);
    loadDataTable()
  }

  const handleCreateQuestion = () => {
    setCreateQuestDialogOpen(true);
  }

  const handleCloseCreateQuestDialog = () => {
    setCreateQuestDialogOpen(false);
  };

  const handleChangeQuestType = (e: React.ChangeEvent<HTMLInputElement>) => setQuestionType((e.target as HTMLInputElement).value)

  const [items, setItems] = useState(["🍰 Cake", "🍩 Donut", "🍎 Apple", "🍕 Pizza"]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const onDragStart = (e: any, index: number) => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode as any);
    e.dataTransfer.setDragImage(e.target.parentNode as any, 20, 20);
  };

  const onDragOver = (index: number) => {
    const draggedOverItem = items[index];

    // if the item is dragged over itself, ignore
    if (draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let updatedItems = items.filter(item => item !== draggedItem);

    // add the dragged item after the dragged over item
    updatedItems.splice(index, 0, draggedItem as string);

    setItems(updatedItems);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div>
      {/* DIALOGS */}

      {/* Confirm delete */}
      <Dialog
        fullScreen={fullScreen}
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDeleteDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirm Deleting Question"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can not recover the question{deleteId ? "" : "(s)"} when it is deleted and one has been added to exams also be removed. Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseConfirmDeleteDialog}>
            Cancel
          </Button>
          <Button onClick={() => deleteId ? deleteQuestion(deleteId) : deleteQuestion()} color="error" autoFocus>
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
              {JSON.stringify(questionEdited, null, 2)}
            </pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseEditDialog}>
            Cancel
          </Button>
          <Button onClick={() => editQuestion(editId)} color="error" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create question */}
      {/* <BootstrapDialog
        onClose={handleCloseCreateQuestDialog}
        aria-labelledby="customized-dialog-title"
        open={createQuestDialogOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Question
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseCreateQuestDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContentMemoized dividers>
          <TextField
            fullWidth
            label='Question'
            id='question'
            name='question'
            type='question'
            required
            value={quest}
            onChange={(e: any) => setQuest(e.event?.target)}
          >
          </TextField>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Question Type</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={questionType}
              onChange={handleChangeQuestType}
            >
              <FormControlLabel value="radio" control={<Radio />} label="Picklist with 1 correct answer" />
              <FormControlLabel value="checkbox" control={<Radio />} label="Picklist with multiple correct answers" />
            </RadioGroup>
          </FormControl>
          <ul>
            {items.map((item: any, idx: any) => (
              <li key={item} onDragOver={() => onDragOver(idx)}>
                <div
                  className="drag"
                  draggable
                  onDragStart={e => onDragStart(e, idx)}
                  onDragEnd={onDragEnd}
                >
                  <MenuIcon />
                </div>
                <span className="content">{item}</span>
              </li>
            ))}
          </ul>
        </DialogContentMemoized>
        <DialogActions>
          <Button autoFocus onClick={handleCloseCreateQuestDialog}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleCloseCreateQuestDialog}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog> */}


      {/* <h3>My Questions</h3> */}
      {/* <h4 style={{ marginBottom: "5px" }}>Create Question</h4>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ width: "30%" }}>
          <FormLabel id="question">Question</FormLabel>
          <TextField
            size="small"
            sx={{ mt: 2, mb: 2, width: "100%" }}
            label='Your question'
            id='question'
            name='question'
            type='question'
            required
            value={quest}
            onChange={(e: any) => setQuest(e.event?.target)}
          />
        </Box>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Question Type</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={questionType}
            onChange={handleChangeQuestType}
          >
            <FormControlLabel value="radio" control={<Radio />} label="Picklist with 1 correct answer" />
            <FormControlLabel value="checkbox" control={<Radio />} label="Picklist with multiple correct answers" />
            <FormControlLabel value="short" control={<Radio />} label="A short text answer"></FormControlLabel>
          </RadioGroup>
        </FormControl>

        {
          questionType === "radio" && (
            <Box>

            </Box>
          )
        }

        <ul>
          {items.map((item: any, idx: any) => (
            <li key={item} onDragOver={() => onDragOver(idx)}>
              <div
                className="drag"
                draggable
                onDragStart={e => onDragStart(e, idx)}
                onDragEnd={onDragEnd}
              >
                <MenuIcon />
              </div>
              <span className="content">{item}</span>
            </li>
          ))}
        </ul>
      </Box>

      <h4 style={{ marginBottom: "5px" }}>Questions List</h4> */}
      <Box
        sx={{
          marginBottom: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}>
        <TextField label='Search for question' onChange={handleSearchChange} size="small" sx={{ marginTop: 2, width: "30%" }} />
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
            <Button color='success' onClick={handleCreateQuestion}>
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
