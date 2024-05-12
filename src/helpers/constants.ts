export interface IUser {
  id: string;
  username: string;
  role: string;
  fullName: string;
  avatar: string;
}

export interface IExam {
  _id: string;
  examTitle: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface IExamFilters {
  examTitle: string;
  [key: string]: string | undefined;
}

export const dateRegexOneYear1st: RegExp = /^(\d{4})-(\d{2})-(\d{2})$/; // 2023-12-21
export const dateRegexTwoYear2nd: RegExp = /^(\d{4})\/(\d{2})\/(\d{2})$/; // 2023/12/21
export const dateRegexOneDay1st: RegExp = /^(\d{2})\/(\d{1,2})\/(\d{4})$/; // 21-12-2023
export const dateRegexOneDay2nd: RegExp = /^(\d{2})\/(\d{1,2})\/(\d{4})$/; // 21/12/2023

export const accessToken = localStorage.getItem('accessToken') || '';
export const configFetch = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
  },
};
export const apiOrigin: string =
  (process.env.REACT_APP_API_ORIGIN as string) || 'http://localhost:3000/api';
//"http://localhost:3000/api"
