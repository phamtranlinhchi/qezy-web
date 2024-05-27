import axios, { AxiosError } from 'axios';
import {
  IExamFilters,
  apiOrigin,
} from './constants';
import { toast } from 'react-toastify';
import { validateTags } from './handleData';

export const login = async (username: string, password: string) => {
  try {
    const url = `${apiOrigin}/auth/login`;
    const response = await axios.post(url, {
      username,
      password
    })
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data
      };
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response?.status === 401)
      return {
        status: axiosError.response?.status,
        message: (axiosError.response?.data as any).message
      }
    else
      return {
        status: axiosError.response?.status,
        message: "Login failed!"
      }
  }
}

export const register = async (username: string, password: string, fullName: string, role?: string) => {
  try {
    const url = `${apiOrigin}/auth/register`;
    const response = await axios.post(url, {
      username,
      password,
      fullName,
      role // Need to create a new API for creating new user
    })
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data
      };
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response?.status === 400)
      return {
        status: axiosError.response?.status,
        message: (axiosError.response?.data as any).message
      }
    else
      return {
        status: axiosError.response?.status,
        message: "Register failed!"
      }
  }
}

export const getUsersByRole = async (role: string) => {
  const url = `${apiOrigin}/users?role=${role}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Cant not find user with role: ${role}`);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getUserByEmail = async (email: string) => {
  const url = `${apiOrigin}/users/?email=${email}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Can not find user with email: ${email}`);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getUserById = async (id: any) => {
  const url = `${apiOrigin}/users/${id}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Can not find user with id ${id}`);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getCurrentUser = async (
) => {
  try {
    let url = `${apiOrigin}/users/current`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving user info`);
    }
  } catch (err) {
    return err;
  }
};

export const updateUserById = async (id: string, user: any) => {
  try {
    const url = `${apiOrigin}/users/${id}`;
    const response = await axios.put(url, user)
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data
      };
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response?.status === 400)
      return {
        status: axiosError.response?.status,
        message: (axiosError.response?.data as any).message
      }
    else
      return {
        status: axiosError.response?.status,
        message: "Update user failed!"
      }
  }
}

export const getExamsByCurrentUser = async (
  limit: number,
  page: number,
  search?: string,
) => {
  try {
    let url = `${apiOrigin}/exams?limit=${limit}&page=${page}&search=${search}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving exams list`);
    }
  } catch (err) {
    return err;
  }
};

export const getAllExams = async (
) => {
  try {
    let url = `${apiOrigin}/exams/all`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving exams list`);
    }
  } catch (err) {
    return err;
  }
};

export const getExamById = async (
  id: any
) => {
  try {
    let url = `${apiOrigin}/exams/${id}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving exam by id ${id}`);
    }
  } catch (err) {
    return err;
  }
};

export const updateExamById = async (
  id: string,
  exam: any
) => {
  try {
    const url = `${apiOrigin}/exams/${id}`;
    const response = await axios.put(url, exam)
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data
      };
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    return {
      status: axiosError.response?.status,
      message: (axiosError.response?.data as any).message
    }
  }
};

export const deleteExamById = async (
  id: string
) => {
  try {
    let url = `${apiOrigin}/exams/${id}`;
    const response = await axios.delete(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error deleting exam`);
    }
  } catch (err) {
    return err;
  }
};

export const getQuestionsByCurrentUser = async (
  limit: number,
  page: number,
  search?: string,
) => {
  try {
    let url = `${apiOrigin}/questions?limit=${limit}&page=${page}&search=${search}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving questions list`);
    }
  } catch (err) {
    return err;
  }
};

export const getAllQuestions = async (
) => {
  try {
    let url = `${apiOrigin}/questions/all`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving questions list`);
    }
  } catch (err) {
    return err;
  }
};

export const getQuestionById = async (
  id: any
) => {
  try {
    let url = `${apiOrigin}/questions/${id}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving question by id ${id}`);
    }
  } catch (err) {
    return err;
  }
};

export const createQuestion = async (question: any) => {
  try {
    const url = `${apiOrigin}/questions`;
    const response = await axios.post(url, question)
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data
      };
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    return {
      status: axiosError.response?.status,
      message: (axiosError.response?.data as any).message
    }
  }
}

export const updateQuestion = async (id: string, question: any) => {
  try {
    const url = `${apiOrigin}/questions/${id}`;
    const response = await axios.put(url, question)
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data
      };
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    return {
      status: axiosError.response?.status,
      message: (axiosError.response?.data as any).message
    }
  }
}

export const updateQuestionById = async (
  id: string,
  quest: any
) => {
  try {
    let url = `${apiOrigin}/questions/${id}`;
    const response = await axios.put(url, quest);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error updating question`);
    }
  } catch (err) {
    return err;
  }
};

export const deleteQuestionById = async (
  id: string
) => {
  try {
    let url = `${apiOrigin}/questions/${id}`;
    const response = await axios.delete(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error deleting question`);
    }
  } catch (err) {
    return err;
  }
};

export const getUsers = async (
  limit: number,
  page: number,
  search?: string,
) => {
  try {
    let url = `${apiOrigin}/users?limit=${limit}&page=${page}&search=${search}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving users list`);
    }
  } catch (err) {
    return err;
  }
};

export const deleteUserById = async (
  id: string
) => {
  try {
    let url = `${apiOrigin}/users/${id}`;
    const response = await axios.delete(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error deleting user`);
    }
  } catch (err) {
    return err;
  }
};

export const getExamResultByExamId = async (
  id: any
) => {
  try {
    let url = `${apiOrigin}/results?examId=${id}&limit=1000`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(`Error retrieving results by exam id ${id}`);
    }
  } catch (err) {
    return err;
  }
};