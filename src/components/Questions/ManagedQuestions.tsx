import React, { useEffect, useState } from 'react'
import StripedDataTable from "../StripedDataTable";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { styled, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as yup from "yup";
import { useFormik } from "formik";

import { formatDateTime } from "../../helpers/handleData";
import { createQuestion, deleteQuestionById, getAllExams, getQuestionById, getQuestionsByCurrentUser, updateQuestion, updateQuestionById } from "../../helpers/fetch";

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
  const [editQuestDialogOpen, setEditQuestDialogOpen] = useState<boolean>(false);

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
  const [editId, setEditId] = useState("");
  const [questionEdited, setQuestionEdited] = useState<any>();
  const [errCreate, setErrCreate] = useState("")
  const [errEdit, setErrEdit] = useState("")
  const [allExams, setAllExams] = useState([])

  const handleCreateAnswer = () => {
    formik.setValues((values) => ({ ...values, answers: [...values.answers, ""] }))
  }

  const handleAddAnswer = () => {
    formikEdit.setValues((values) => ({ ...values, answers: [...values.answers, ""] }))
  }

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

  useEffect(() => {
    async function getExams() {
      const exams = await getAllExams();
      setAllExams(exams)
    }
    getExams()
  }, [])

  const handleEdit = async (id: any) => {
    setEditQuestDialogOpen(true);
    setEditId(id);
    const currQuestion = await getQuestionById(id)
    setQuestionEdited(currQuestion)
    let { quest, examIds, type, answers } = currQuestion;
    let correctAnswer: string = "";
    answers = answers.map((answer: any, index: number) => {
      if (answer.isTrue)
        correctAnswer = `${index}`;
      return answer.answer
    })

    formikEdit.setValues({
      quest,
      examIds,
      type,
      answers,
      correctAnswer
    });
  }

  const handleDelete = async (id: any) => {
    setDeleteId(id);
    handleDeleteQuestion();
  };

  const handleCloseEditDialog = () => {
    setEditQuestDialogOpen(false);
    setEditId("");
    formikEdit.setValues({
      quest: "",
      examIds: [],
      type: "radio",
      answers: [],
      correctAnswer: ""
    })
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
      flex: 4,
      filterable: false,
    },
    {
      field: "answers",
      headerName: "Answers",
      flex: 4,
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
      flex: 3,
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
      flex: 3,
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
      flex: 3,
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
      flex: 2,
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
    setEditQuestDialogOpen(false);
    loadDataTable()
  }

  const handleCreateQuestion = () => {
    setCreateQuestDialogOpen(true);
  }

  // CREATE
  const validationSchema = yup.object({
    quest: yup
      .string()
      .required("Question title is required"),
    correctAnswer: yup
      .string()
      .required("Correct answer is required"),
  });

  const formik = useFormik({
    initialValues: {
      quest: "",
      examIds: [],
      type: "radio",
      answers: ["", ""],
      correctAnswer: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newQuest = { ...values, answers: values.answers.map((answer, index) => ({ answer, isTrue: index === Number(values.correctAnswer) })) }

        const question = await createQuestion({ ...newQuest, correctAnswer: null });
        if (question?.status !== 200) {
          setCreateQuestDialogOpen(true);
          setErrCreate(question?.message)
        } else {
          setCreateQuestDialogOpen(false);
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
    setCreateQuestDialogOpen(false);
    formik.resetForm();
    setErrCreate("")
  };

  // EDIT
  const validationEditSchema = yup.object({
    quest: yup
      .string()
      .required("Question title is required"),
    correctAnswer: yup
      .string()
      .required("Correct answer is required"),
  });

  const formikEdit = useFormik({
    initialValues: {
      quest: "",
      examIds: [],
      type: "radio",
      answers: ["", ""],
      correctAnswer: ""
    },
    validationSchema: validationEditSchema,
    onSubmit: async (values) => {
      try {
        const newQuest = { ...values, answers: values.answers.map((answer, index) => ({ answer, isTrue: index === Number(values.correctAnswer) })) }
        const question = await updateQuestion(editId, { ...newQuest, correctAnswer: null });
        if (question?.status !== 200) {
          setEditQuestDialogOpen(true);
          setErrEdit(question?.message)
        } else {
          setEditQuestDialogOpen(false);
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
    setEditQuestDialogOpen(false);
    formikEdit.resetForm();
    setErrEdit("")
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

      {/* Create question */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={createQuestDialogOpen}
        onClose={handleCloseCreate}
        sx={{ textAlign: "center" }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Create Question
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
              label='Question Title (*)'
              id='quest'
              name='quest'
              type='quest'
              value={formik.values.quest}
              onChange={formik.handleChange}
              error={formik.touched.quest && Boolean(formik.errors.quest)}
              helperText={formik.touched.quest && formik.errors.quest}
            />

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel id="demo-simple-select-label">Exams Included</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.examIds}
                label="Exams Included"
                multiple
                MenuProps={{
                  disableScrollLock: true,
                }}
                onChange={(e) => formik.setFieldValue('examIds', e.target.value as string)}
              >
                {allExams.map((exam: any) => <MenuItem value={exam._id}>{exam.examTitle}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.type}
                label="Type"
                onChange={(e) => formik.setFieldValue('type', e.target.value as string)}
                disabled
              >
                <MenuItem value="radio">Radio</MenuItem>
              </Select>
            </FormControl>

            {
              formik.values.answers.length > 0 && formik.values.answers.map((answer, index) => (
                <Box sx={{ marginBottom: "10px", display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                  <TextField
                    fullWidth
                    label={`Answer #${index + 1} ${index < 2 ? "(*)" : ""}`}
                    id={`answer${index}`}
                    name={`answers[${index}]`}
                    type={`answer${index}`}
                    value={formik.values.answers[index]}
                    onChange={formik.handleChange}
                    error={formik.touched.answers && Boolean(formik.errors.answers)}
                    helperText={formik.touched.answers && formik.errors.answers}
                  />
                  {index > 1 &&
                    <Button sx={{ color: "red" }} onClick={() => {
                      formik.setValues((values) => {
                        const newAnswers = [...values.answers];
                        newAnswers.splice(index, 1);
                        return { ...values, answers: newAnswers }
                      })
                    }}>
                      <CloseIcon />
                    </Button>}
                </Box>
              ))
            }

            <Tooltip title='Create answer'>
              <Button color='success' sx={{ marginBottom: "20px" }} onClick={handleCreateAnswer}>
                <AddIcon sx={{ fontSize: "28px" }} />
                Answer
              </Button>
            </Tooltip>

            <FormControl fullWidth >
              <InputLabel id="demo-simple-select-label">Correct Answer</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.correctAnswer}
                label="Correct Answer"
                MenuProps={{
                  disableScrollLock: true,
                }}
                onChange={(e) => formik.setFieldValue('correctAnswer', e.target.value as string)}
                error={formik.touched.correctAnswer && Boolean(formik.errors.correctAnswer)}
              >
                {formik.values.answers.map((answer: any, index) => <MenuItem value={index}>{answer}</MenuItem>)}
              </Select>
            </FormControl>

            {errCreate && <Box sx={{ color: "red", width: "100%", textAlign: "left" }}>
              {errCreate}
            </Box>}
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button autoFocus type='submit' title={"Create user"} sx={{ width: "40%", margin: "10px 0" }}>
              Create a new question
            </Button>
          </DialogActions>
        </form>

      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={editQuestDialogOpen}
        onClose={handleCloseEdit}
        sx={{ textAlign: "center" }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Edit Question
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
              label='Question Title (*)'
              id='quest'
              name='quest'
              type='quest'
              value={formikEdit.values.quest}
              onChange={formikEdit.handleChange}
              error={formikEdit.touched.quest && Boolean(formikEdit.errors.quest)}
              helperText={formikEdit.touched.quest && formikEdit.errors.quest}
            />

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel id="demo-simple-select-label">Exams Included</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formikEdit.values.examIds}
                label="Exams Included"
                multiple
                MenuProps={{
                  disableScrollLock: true,
                }}
                onChange={(e) => formikEdit.setFieldValue('examIds', e.target.value as string)}
              >
                {allExams.map((exam: any) => <MenuItem value={exam._id}>{exam.examTitle}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formikEdit.values.type}
                label="Type"
                onChange={(e) => formikEdit.setFieldValue('type', e.target.value as string)}
                disabled
              >
                <MenuItem value="radio">Radio</MenuItem>
              </Select>
            </FormControl>

            {
              formikEdit.values.answers.length > 0 && formikEdit.values.answers.map((answer, index) => (
                <Box sx={{ marginBottom: "10px", display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                  <TextField
                    fullWidth
                    label={`Answer #${index + 1} ${index < 2 ? "(*)" : ""}`}
                    id={`answer${index}`}
                    name={`answers[${index}]`}
                    type={`answer${index}`}
                    value={formikEdit.values.answers[index]}
                    onChange={formikEdit.handleChange}
                    error={formikEdit.touched.answers && Boolean(formikEdit.errors.answers)}
                    helperText={formikEdit.touched.answers && formikEdit.errors.answers}
                  />
                  {index > 1 &&
                    <Button sx={{ color: "red" }} onClick={() => {
                      formikEdit.setValues((values) => {
                        const newAnswers = [...values.answers];
                        newAnswers.splice(index, 1);
                        console.log(newAnswers);

                        return { ...values, answers: newAnswers }
                      })
                    }}>
                      <CloseIcon />
                    </Button>}
                </Box>
              ))
            }

            <Tooltip title='Create answer'>
              <Button color='success' sx={{ marginBottom: "20px" }} onClick={handleAddAnswer}>
                <AddIcon sx={{ fontSize: "28px" }} />
                Answer
              </Button>
            </Tooltip>

            <FormControl fullWidth >
              <InputLabel id="demo-simple-select-label">Correct Answer</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formikEdit.values.correctAnswer}
                label="Correct Answer"
                MenuProps={{
                  disableScrollLock: true,
                }}
                onChange={(e) => formikEdit.setFieldValue('correctAnswer', e.target.value as string)}
                error={formikEdit.touched.correctAnswer && Boolean(formikEdit.errors.correctAnswer)}
              >
                {formikEdit.values.answers.map((answer: any, index) => <MenuItem value={index}>{answer}</MenuItem>)}
              </Select>
            </FormControl>

            {errCreate && <Box sx={{ color: "red", width: "100%", textAlign: "left" }}>
              {errCreate}
            </Box>}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button autoFocus type='submit' color="success" title={"Save question"}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>


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
