import { QueryResult } from "pg";

interface IDeveloper {
  id: number;
  name: string;
  email: string;
}
interface IDeveloperWithInfo extends IDeveloper {
  developerSince: Date | null;
  preferredOs: string | null;
}

interface IDeveloperInfoFormat {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}

interface IDeveloperInfo {
  id: number;
  developerSince: Date | null;
  preferredOS: string | null;
  developerId: number;
}

type TDeveloperRequest = Omit<IDeveloper, "id">;
type TQueryResultDeveloper = QueryResult<IDeveloper>;
type TPartialDeveloper = Partial<IDeveloper>;
type TQueryResultDeveloperWithInfo = QueryResult<IDeveloperInfoFormat>;

type TQueryResultDeveloperInfo = QueryResult<IDeveloperInfo>;
type TDeveloperInfoRequest = Omit<IDeveloperInfo, "id" | "developerId">;
type TPartialDeveloperInfo = Partial<IDeveloperInfo>;

interface IProject {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
}

interface IProjectWithTechnologies {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date | null;
  projectDeveloperId: number;
  technologyId: number;
  technologyName: string;
}

interface ITechnology {
  id: number;
  name: string;
}

interface IProjectTechonolgyTable {
  id: number;
  addedIn: Date;
  projectId: number;
  technologyId: number;
}

type TProjectRequest = Omit<IProject, "id">;
type TPartialProject = Partial<IProject>;
type TQueryResultProject = QueryResult<IProject>;

type TQueryResultProjectWithTechnologies =
  QueryResult<IProjectWithTechnologies>;

type TTechnologyRequest = Omit<ITechnology, "id">;
type TQueryResultTechnology = QueryResult<ITechnology>;

type TProjectTechnologyTableRequest = Omit<IProjectTechonolgyTable, "id">;
type TQueryResultProjectTechnologyTable = QueryResult<IProjectTechonolgyTable>;

export {
  IDeveloper,
  TDeveloperRequest,
  TPartialDeveloper,
  TQueryResultDeveloper,
  TQueryResultDeveloperWithInfo,
  IDeveloperWithInfo,
  TDeveloperInfoRequest,
  TPartialDeveloperInfo,
  TQueryResultDeveloperInfo,
  IDeveloperInfo,
  IProject,
  TProjectRequest,
  TPartialProject,
  TQueryResultProject,
  IProjectWithTechnologies,
  TQueryResultProjectWithTechnologies,
  TTechnologyRequest,
  ITechnology,
  TQueryResultTechnology,
  IProjectTechonolgyTable,
  TQueryResultProjectTechnologyTable,
  TProjectTechnologyTableRequest,
  IDeveloperInfoFormat,
};
