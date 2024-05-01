import axios, { AxiosError } from 'axios';
import {
  apiOrigin,
  JobType,
  JobDetails,
  TrainingDetails,
  IOpp,
  IContact,
  ICompanyRow,
  ITraining,
  IJobRow,
  companyDetails,
  IUser,
} from './constants';
import { toast } from 'react-toastify';
import { validateTags } from './handleData';

interface IJobFilters {
  miningDate?: string;
  sourceUri?: string;
  jobId?: string;
  jobTitle?: string;
  jobLocations?: string;
  jobEmployment?: string;
  jobDescription?: string;
  jobRequirements?: string;
  jobDepartment?: string;
  jobBenefits?: string;
  [key: string]: string | undefined;
}
export const getJobs = async ({
  company,
}: {
  company: string;
  filter: string;
  category: string;
}) => {
  try {
    const url = `${apiOrigin}/${company}`;
    const response = await axios.get(url);
    const data = response.data as { data?: JobType[]; row?: number };
    return data;
  } catch (err) {
    return err;
  }
};

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
