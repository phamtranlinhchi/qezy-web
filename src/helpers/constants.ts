export interface IFilter {
  column: string;
  field: string;
  operator: string;
  values: string;
}
export interface IEvaluations {
  ef: {
    createdAt: Date;
    efName: string;
    keyWords: Array<string>;
    updatedAt: Date;
    _id: string;
  };
  evaluate: string;
}
export interface ILocation {
  city?: string;
  state?: string;
  country?: string;
}
export interface IOppData {
  contacts: Array<IContact>;
  createdAt: Date;
  evaluations: Array<IEvaluations>;
  jobs: Array<IJobs>;
  oppName: string;
  updatedAt: Date;
  _id: string;
}
export interface IFilterData {
  values: string;
  column: string;
  field: string;
}
export interface IPresetDefault {
  createdAt: Date;
  filterData: Array<IFilterData>;
  isHidden: boolean;
  presetName: string;
  updatedAt: Date;
  _id: string;
}
export interface IJobs {
  _id: string;
  companyName: string;
  sourceUri: string;
  miningDate: Date;
  remote?: boolean | null;
  jobLocations: string[] | ILocation[];
  jobId?: string | null;
  jobTitle?: string;
  jobEmployment: string;
  jobDescription?: string | null;
  jobRequirements?: string | null;
  jobDepartment?: string | null;
  jobBenefits?: string | null;
  updatedAt: Date;
  createdAt: Date;
}
export interface MessageType {
  dequeueCount: number;
  expiresOn: string;
  insertedOn: string;
  messageId: string;
  messageText: string;
}

export interface JobType {
  sourceUri?: string;
  miningDate?: Date;
  minExperienceInYears?: number;
  remote?: boolean;
  remoteRatioInPercent?: number;
  jobLocations?: Array<{
    city?: string;
    state?: string;
    country?: string;
  }>;
  jobId?: string;
  jobTitle?: string;
  jobEmployment?: string;
  jobDescription?: string;
  jobRequirements?: string;
  jobDepartment?: string | Array<string>;
  jobBenefits?: string;
}

export interface UserInfor {
  email: string;
  password: string;
  username?: string;
}
export interface FileLocation {
  containerName: string;
  fileLocation: string;
}

export interface IBotLocation {
  city?: string;
  state?: string;
  country?: string;
}

export interface ICompanyRow {
  id: string;
  sourceUri: string;
  miningDate: Date;
  companyName: string;
  companyWeb: string;
  contactPhone: string;
  staffCountGlobal: number;
  revenueInEuro: number;
  foundedInYear: number;
  headquarter: IBotLocation;
  branches: Array<IBotLocation>;
}

export interface IJobRow {
  id: number;
  sourceUri: string;
  /**
   * ISO-8601, UTC,
   * 2024-01-12T08:29:04.131Z
   */
  miningDate: Date;

  minExperienceInYears: number;
  remote: boolean;
  remoteRatioInPercent?: number;

  jobLocations: Array<IBotLocation>;

  jobId?: string;
  // most important skills? (e.g. Azure Enginer), functions? (e.g. sales)
  jobTitle: string;

  /**
   * ETL
   * e.g. Full-Time, Part-Time, Contractor, Internship
   */
  jobEmployment: string;
  jobDescription: string;
  jobRequirements: string;
  /**
   * ETL
   * - derivated from job title
   * - meta data in job description
   * - keywords in description
   *
   * synonym: category
   * e.g. Sale,
   */
  jobDepartment: 'Sale' | 'Development' | 'Design' | 'Operations' | 'Others';

  jobBenefits: string;
}

export interface IJobData {
  newJob: {
    _id?: string;
    companyName?: string;
    jobListLinkStart?: string;
    jobListLinkNearEnd?: string;
    jobListLinkSelector?: string;
    jobButtonNextSelector?: string;
    jobButtonNextSelectorDisabled?: string;
    jobClickCookie?: string;
    jobDetail?: {
      jobTitle?: string;
      jobId?: string;
      jobDescription?: string;
      jobEmployment?: string;
      jobRequirements?: string;
      jobBenefits?: string;
      jobDepartment?: string;
      minExperienceInYears?: string;
      remote?: string;
      jobLocations?: IBotLocation[];
      remoteRatioInPercent?: string;
      textContentJobTitle?: string;
      textContentDescription?: string;
      textContentId?: string;
      textContentEmployment?: string;
      textContentRequirements?: string;
      textContentBenefits?: string;
      textContentDepartment?: string;
      textContentLocationcity?: string;
      textContentLocationcountry?: string;
      textContentMinExperienceInYears?: string;
      textContentRemote?: string;
      textContentRemoteRatioInPercent?: string;
      textContentLocationstate?: string;
    };
    jobList?: Array<string>;
    jobLinkDetail?: string;
  };
}
export interface IScreenProps {
  result: { newJob: IJobData['newJob'] };
  showAdditionalFields: true | false;
}
export interface JobDetails {
  _id?: string;
  companyName?: string;
  jobListLinkStart?: string;
  jobListLinkNearEnd?: string;
  jobListLinkSelector?: string;
  jobButtonNextSelector?: string;
  jobButtonNextSelectorDisabled?: string;
  jobLinkDetail?: string;
  jobClickCookie?: string;
  jobDetail?: {
    jobTitle?: string;
    jobDescription?: string;
    jobId?: string;
    jobEmployment?: string;
    jobDepartment?: string;
    jobRequirements?: string;
    jobBenefits?: string;
    jobLocations?: Array<{
      city?: string;
      state?: string;
      country?: string;
    }>;
    minExperienceInYears?: string;
    remote?: string;
    remoteRatioInPercent?: string;
  };
}
export interface IPresetFilter {
  label: string;
  keyword: string;
}

export interface TrainingData {
  newTraining: {
    _id?: string;
    companyName?: string;
    trainingListLinkStart?: string;
    trainingListLinkNearEnd?: string;
    trainingListLinkSelector?: string;
    trainingButtonNextSelector?: string;
    trainingButtonNextSelectorDisabled?: string;
    trainingClickCookie?: string;
    trainingDetail?: {
      trainingTitle?: string;
      trainingCode?: string;
      trainingCodeVendor?: string;
      trainingDurationInDays?: string;
      trainingNettoInEuro?: string;
      trainingLocation?: string;
      trainingStart?: string;
      trainingEnd?: string;
      trainingContent?: string;
      trainingOverview?: string;
      trainingRequirements?: string;
      trainingTargetGroup?: string;
      trainingLearningGoal?: string;
      trainingGuaranteed?: string;
      trainingLanguage?: string;
      textContentTrainingTitle?: string;
      textContentTrainingCode?: string;
      textContentTrainingCodeVendor?: string;
      textContentTrainingDurationInDays?: string;
      textContentTrainingNettoInEuro?: string;
      textContentTrainingLocation?: string;
      textContentTrainingStart?: string;
      textContentTrainingEnd?: string;
      textContentTrainingOverview?: string;
      textContentTrainingRequirements?: string;
      textContentTrainingTargetGroup?: string;
      textContentTrainingContent?: string;
      textContentTrainingLearningGoal?: string;
      textContentTrainingGuaranteed?: string;
      textContentTrainingLanguage?: string;
    };
    trainingList?: Array<string>;
    trainingLinkDetail?: string;
  };
}
export interface IscreenProps {
  result: { newTraining: TrainingData['newTraining'] };
  showAdditionalFields: true | false;
}
export interface ITraining {
  trainingTitle?: string;
  trainingCode?: string;
  trainingCodeVendor?: string;
  trainingDurationInDays?: string;
  trainingNettoInEuro?: string;
  trainingLocation?: string;
  trainingStart?: string;
  trainingEnd?: string;
  trainingContent?: string;
  trainingOverview?: string;
  trainingRequirements?: string;
  trainingTargetGroup?: string;
  trainingLearningGoal?: string;
  trainingGuaranteed?: string;
  trainingLanguage?: string;
}
export interface TrainingDetails {
  companyName?: string;
  trainingClickCookie?: string;
  trainingListLinkStart?: string;
  trainingListLinkNearEnd?: string;
  trainingListLinkSelector?: string;
  trainingButtonNextSelector?: string;
  trainingButtonNextSelectorDisabled?: string;
  trainingLinkDetail?: string;
  trainingDetail?: ITraining;
}

export interface IOpp {
  oppName?: string;
  jobs?: object[];
  contactId?: string;
}
export interface INote {
  description?: string;
}
export interface IContact {
  companyName?: string;
  positionInCompany?: string;
  email?: string;
  state: string;
  phone?: string;
  notes: INote;
  contactDates?: Date;
  tags?: string;
  _id?: string;
  author?: IUser;
}
export interface IState {
  stateName: string;
  color: string;
}

export interface CompanyLocation {
  city?: string;
  state?: string;
  country?: string;
}
export interface CompanyData {
  newCompany: {
    _id?: string;
    companySourceOrg?: string;
    companyListLinkStart?: string;
    companyListLinkNearEnd?: string;
    companyListLinkSelector?: string;
    companyButtonNextSelector?: string;
    companyButtonNextSelectorDisabled?: string;
    companyClickCookie?: string;
    companyList?: Array<string>;
    companyLinkDetail?: string;
    companyDetail?: {
      companyName?: string;
      companyWeb?: string;
      contactPhone?: string;
      staffCountInDE?: string;
      staffCountGlobal?: string;
      revenueInEuro?: string;
      foundedInYear?: string;
      headquarter?: CompanyLocation;
      branches?: CompanyLocation[];
      textContentCompanyName?: string;
      textContentCompanyWeb?: string;
      textContentContactPhone?: string;
      textContentStaffCountInDE?: string;
      textContentStaffCountGlobal?: string;
      textContentRevenueInEuro?: string;
      textContentFoundedInYear?: string;
      textContentHeadquarterCity?: string;
      textContentHeadquarterState?: string;
      textContentHeadquarterCountry?: string;
      textContentBranchesCity?: string;
      textContentBranchesState?: string;
      textContentBranchesCountry?: string;
    };
  };
}

export interface companyDetails {
  companySourceOrg?: string;
  companyListLinkStart?: string;
  companyListLinkNearEnd?: string;
  companyListLinkSelector?: string;
  companyButtonNextSelector?: string;
  companyButtonNextSelectorDisabled?: string;
  companyLinkDetail?: string;
  companyClickCookie?: string;
  companyDetail?: {
    companyName?: string;
    contactPhone?: string;
    companyWeb?: string;
    staffCountInDE?: string;
    foundedInYear?: string;
    staffCountGlobal?: string;
    revenueInEuro?: string;
    headquarter?: {
      city?: string;
      state?: string;
      country?: string;
    };
    branches?:
      | [
          {
            city?: string;
            state?: string;
            country?: string;
          }
        ]
      | [];
  };
}
export interface IPaginateJob {
  docs?: Array<IJobs>;
  totalDocs?: number;
  offset?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: boolean | null;
  nextPage?: boolean | null;
}

export interface IPaginateContact {
  docs?: Array<IContact>;
  totalDocs?: number;
  offset?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: boolean | null;
  nextPage?: boolean | null;
}
interface IBody {
  contentType?: string;
  content?: string;
}
interface IEmail {
  name?: string;
  address?: string;
}
interface IEmailAddress {
  emailAddress: IEmail;
}
interface ILocationMail {
  displayName: string;
  locationType: string;
  uniqueIdType: string;
}
export interface IMail {
  id?: string;
  _id: string;
  createdDateTime?: Date;
  lastModifiedDateTime?: Date;
  changeKey?: string;
  receivedDateTime: Date;
  sentDateTime?: Date;
  hasAttachments?: boolean;
  internetMessageId?: string;
  subject?: string | null;
  bodyPreview: string;
  importance?: string;
  parentFolderId?: string;
  conversationId?: string;
  conversationIndex?: string;
  isDeliveryReceiptRequested?: boolean;
  isReadReceiptRequested?: boolean;
  isRead?: boolean;
  isDraft?: boolean;
  allowNewTimeProposals?: string | null;
  meetingRequestType?: string;
  body?: IBody;
  sender?: IEmailAddress;
  from: IEmailAddress;
  toRecipients?: Array<IEmailAddress>;
  ccRecipients?: Array<IEmailAddress>;
  replyTo?: Array<IEmailAddress>;
  inferenceClassification?: string;
  responseRequested?: string;
  type?: string;
  meetingMessageType?: string;
  location?: ILocationMail;
  flag: { flagStatus: string | boolean | number };
}
export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}
export const jobContainerName: string = 'job';
export const jobLogsContainerName: string = 'job-logs';
export const trainingContainerName: string = 'training';
export const trainingLogsContainerName: string = 'training-logs';
export const companyContainerName: string = 'company';
export const companyLogsContainerName: string = 'company-logs';
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
//"https://zmiapi.azurewebsites.net/api"
//"http://localhost:3000/api"
