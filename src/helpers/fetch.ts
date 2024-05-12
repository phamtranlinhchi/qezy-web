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
