import React, { useEffect, useState } from 'react'
import StripedDataTable from "../StripedDataTable";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as yup from "yup";
import { useFormik } from "formik";
import CloseIcon from '@mui/icons-material/Close';

import { formatDateTime } from "../../helpers/handleData";
import { IExam } from "../../helpers/constants";
import { deleteExamById, getAllQuestions, getExamById, getExamsByCurrentUser, updateExamById } from "../../helpers/fetch";

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
  const [errEdit, setErrEdit] = useState("")
  const [allQuestions, setAllQuestions] = useState([]);
  const [addedQuestion, setAddedQuestion] = useState()
  const [addedQuestionPoint, setAddedQuestionPoint] = useState(0)


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    async function getQuestions() {
      const questions = await getAllQuestions();
      setAllQuestions(questions)
    }
    getQuestions()
  }, [])

  const handleEdit = async (id: any) => {
    setEditDialogOpen(true);
    setEditId(id);
    const currExam = await getExamById(id);
    // delete currExam._id;
    // delete currExam.creator;
    // delete currExam.createdAt;
    // delete currExam.updatedAt;
    // delete currExam.__v;
    // currExam.questions = currExam.questions.map((question: any) => {
    //   const { quest, answers } = question.questionId
    //   const { point } = question
    //   return {
    //     questionId: {
    //       quest,
    //       answers: answers.map((a: any) => {
    //         const { answer, isTrue } = a;
    //         return {
    //           answer,
    //           isTrue
    //         }
    //       })
    //     },
    //     point
    //   }
    // })
    setExamEdited(currExam);
    const { examTitle, totalTimeInMinute, questions } = currExam;
    formikEdit.setValues({ examTitle, totalTimeInMinute, questions })
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
        justifyContent="space-evenly"
        alignItems="center"
        sx={{
          width: '100%',
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
      flex: 4,
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
      flex: 3,
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

  // EDIT
  const validationEditSchema = yup.object({
    examTitle: yup
      .string()
      .required("Exam title is required"),
    totalTimeInMinute: yup
      .string()
      .required("Total time is required"),
  });

  const formikEdit = useFormik({
    initialValues: {
      examTitle: "",
      totalTimeInMinute: "",
      questions: []
    },
    validationSchema: validationEditSchema,
    onSubmit: async (values) => {
      try {
        const newExam = { ...values, questions: values.questions.map((question: any, index) => ({ point: question.point, questionId: question.questionId._id })) }
        const exam: any = await updateExamById(editId, newExam);
        if (exam?.status !== 200) {
          setEditDialogOpen(true);
          setErrEdit(exam?.message)
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
    setAddedQuestion(undefined)
    setAddedQuestionPoint(0)
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
        fullWidth={true}
        maxWidth={"sm"}
        open={editDialogOpen}
        onClose={handleCloseEdit}
        sx={{ textAlign: "center" }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Edit Exam
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
              label='Exam Title (*)'
              id='examTitle'
              name='examTitle'
              type='examTitle'
              value={formikEdit.values.examTitle}
              onChange={formikEdit.handleChange}
              error={formikEdit.touched.examTitle && Boolean(formikEdit.errors.examTitle)}
              helperText={formikEdit.touched.examTitle && formikEdit.errors.examTitle}
            />

            <TextField
              fullWidth
              label='Total time in minute (*)'
              id='totalTimeInMinute'
              name='totalTimeInMinute'
              type='number'
              InputProps={{ inputProps: { min: 1 } }}
              value={formikEdit.values.totalTimeInMinute}
              onChange={formikEdit.handleChange}
              error={formikEdit.touched.totalTimeInMinute && Boolean(formikEdit.errors.totalTimeInMinute)}
              helperText={formikEdit.touched.totalTimeInMinute && formikEdit.errors.totalTimeInMinute}
            />

            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", fontFamily: "sans-serif" }}>
              <h4 style={{ textAlign: "left" }}>Questions</h4>
              <h4>Total Point: {formikEdit.values.questions.reduce((total: any, curr: any) => curr.point + total, 0)}</h4>
            </Box>
            {
              formikEdit.values.questions.length > 0 && formikEdit.values.questions.map((question: any, index: number) => (
                <Box sx={{ width: "100%", marginBottom: "20px", display: "flex", justifyContent: "space-between", fontSize: "18px" }}>
                  <Box sx={{ textAlign: "left" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {index + 1}. {question.questionId.quest}

                    </Box>
                    <ol style={{ listStyleType: "lower-alpha", margin: 0 }}>
                      {question.questionId.answers.map((answer: any, index: number) =>
                        <li key={index} style={{
                          fontWeight: answer.isTrue ? "bold" : "normal",
                          color: answer.isTrue ? "green" : "black",
                        }}>
                          {answer.answer}
                        </li>
                      )}
                    </ol>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      sx={{ marginLeft: "20px", width: "100px" }}
                      label='Point'
                      id={`questions[${index}].point`}
                      name={`questions[${index}].point`}
                      type='number'
                      InputProps={{ inputProps: { min: 0 } }}
                      value={(formikEdit.values.questions[index] as any).point}
                      onChange={formikEdit.handleChange}
                      error={formikEdit.touched.totalTimeInMinute && Boolean(formikEdit.errors.totalTimeInMinute)}
                      helperText={formikEdit.touched.totalTimeInMinute && formikEdit.errors.totalTimeInMinute}
                    />
                    <Tooltip title="Remove question from this exam"><Button color="error" onClick={() => {
                      formikEdit.setValues((values: any) => {
                        const newQuestions = [...values.questions];
                        newQuestions.splice(index, 1)
                        return {
                          ...values,
                          questions: newQuestions
                        }
                      })
                    }}><CloseIcon /></Button></Tooltip>
                  </Box>
                </Box>
              ))
            }

            <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
              <FormControl sx={{ width: "60%" }}>
                <InputLabel id="demo-simple-select-label">Questions</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Questions"
                  value={addedQuestion}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                  onChange={(e) => {
                    const currQuest = allQuestions.find((ques: any) => ques._id === (e.target.value as any))
                    setAddedQuestion(currQuest)
                  }}
                >
                  {allQuestions.map((question: any) => <MenuItem value={question._id}>{question.quest}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                sx={{ marginLeft: "10px", width: "15%" }}
                label='Point'
                id={`addedQuestionPoint`}
                type='number'
                InputProps={{ inputProps: { min: 0 } }}
                value={addedQuestionPoint}
                onChange={(e) => setAddedQuestionPoint(e.target.value as any)}
              />
              <Tooltip title='Add question'>
                <Button color='success' onClick={() => {
                  formikEdit.setValues((values: any) => {
                    const newQuests = [...values.questions, { questionId: addedQuestion, point: addedQuestionPoint }];
                    return {
                      ...values,
                      questions: newQuests
                    }
                  })
                  setAddedQuestion(undefined)
                  setAddedQuestionPoint(0)
                }
                }>
                  <AddIcon sx={{ fontSize: "28px" }} />
                  Question
                </Button>
              </Tooltip>
            </Box>

            {errEdit && <Box sx={{ color: "red", width: "100%", textAlign: "left" }}>
              {errEdit}
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
