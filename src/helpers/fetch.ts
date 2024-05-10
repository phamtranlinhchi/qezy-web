import axios, { AxiosError } from 'axios';
import {
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
  const url = `${apiOrigin}/user/users?role=${role}`;
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
  const url = `${apiOrigin}/user/?email=${email}`;
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
