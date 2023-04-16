import { Response, Request } from "express";
import {
  TDeveloperRequest,
  IDeveloper,
  TPartialDeveloper,
  TQueryResultDeveloper,
  IDeveloperWithInfo,
  TQueryResultDeveloperWithInfo,
  TQueryResultDeveloperInfo,
  IDeveloperInfo,
  TProjectRequest,
  TQueryResultProject,
  IProject,
  TQueryResultProjectWithTechnologies,
  IProjectWithTechnologies,
  TPartialProject,
  TTechnologyRequest,
  ITechnology,
  TQueryResultTechnology,
  IProjectTechonolgyTable,
  TQueryResultProjectTechnologyTable,
  TProjectTechnologyTableRequest,
  IDeveloperInfoFormat,
  TDeveloperInfoRequest,
} from "./interfaces";
import format from "pg-format";
import { QueryConfig } from "pg";
import { client } from "./database";

const getAllDevelopers = async (): Promise<IDeveloper[]> => {
  const queryTemplate: string = `SELECT * FROM developers;`;
  const result: TQueryResultDeveloper = await client.query(queryTemplate);
  const developers: IDeveloper[] = result.rows;

  return developers;
};

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const newUser: TDeveloperRequest = {
    name: req.body.name,
    email: req.body.email,
  };
  const queryTemplate: string = format(
    `
    INSERT INTO
    developers
        (%I)
    VALUES
        (%L)
    RETURNING *;
    `,
    Object.keys(newUser),
    Object.values(newUser)
  );

  const result: TQueryResultDeveloper = await client.query(queryTemplate);
  const developerCreated: IDeveloper = result.rows[0];

  return res.status(201).json(developerCreated);
};

const getDeveloperById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerId: number = res.locals.developer.id;

  const queryTemplate: string = `
  SELECT
    "d"."id" "developerId", 
    "d"."name" "developerName", 
    "d"."email" "developerEmail", 
    "di"."developerSince" "developerInfoDeveloperSince", 
    "di"."preferredOS" "developerInfoPreferredOS" 
   FROM 
    developers "d" 
   FULL OUTER JOIN
    developer_infos "di" ON "di"."developerId" = "d"."id"
   WHERE "d"."id" = $1;`;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [developerId],
  };
  const result: TQueryResultDeveloperWithInfo = await client.query(queryConfig);
  const developer: IDeveloperInfoFormat = result.rows[0];
  console.log(developer);
  return res.status(200).json(developer);
};

const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerId: number = res.locals.developer.id;
  const data: TPartialDeveloper = req.body;
  console.log(data);
  const queryTemplate: string = format(
    `
    UPDATE
      developers
      SET(%I) = ROW(%L)
    WHERE
      id = $1
    RETURNING *;
    `,
    Object.keys(data),
    Object.values(data)
  );
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [developerId],
  };

  const result: TQueryResultDeveloper = await client.query(queryConfig);
  const developer: IDeveloper = result.rows[0];

  return res.status(200).json(developer);
};

const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerId: number = res.locals.developer.id;

  const queryTemplate: string = `DELETE FROM developers WHERE id = $1;`;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [developerId],
  };

  await client.query(queryConfig);
  return res.status(204).send();
};

const createDeveloperInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: TDeveloperInfoRequest = res.locals.developerInfo;

  const queryTemplate = format(
    `
    INSERT INTO 
      developer_infos
      (%I)
    VALUES
        (%L)
    RETURNING *;
    `,
    Object.keys(data),
    Object.values(data)
  );

  const result: TQueryResultDeveloperInfo = await client.query(queryTemplate);
  const developerInfo: IDeveloperInfo = result.rows[0];

  return res.status(201).json(developerInfo);
};

const getAllProjects = async (): Promise<IProject[]> => {
  const queryTemplate: string = `SELECT * FROM projects;`;

  const result: TQueryResultProject = await client.query(queryTemplate);
  const projects: IProject[] = result.rows;

  return projects;
};

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: TProjectRequest = req.body;
  const newProject: TProjectRequest = data.endDate
    ? data
    : {
        ...data,
        endDate: null,
      };
  const queryTemplate: string = format(
    `
  INSERT INTO
    projects
    (%I)
  VALUES
    (%L)
  RETURNING *;
  `,
    Object.keys(newProject),
    Object.values(newProject)
  );

  const result: TQueryResultProject = await client.query(queryTemplate);
  const project: IProject = result.rows[0];

  return res.status(201).json(project);
};

const getProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = res.locals.projects.id;

  const queryTemplate = `
  SELECT 
    "p"."name" "projectName",
    "p"."description" "projectDescription",
    "p"."estimatedTime" "projectEstimatedTime",
    "p"."repository" "projectRepository",
    "p"."startDate" "projectStartDate",
    "p"."endDate" "projectEndDate",
    "p"."developerId" "projectDeveloperId",
    "pt"."technologyId",
    "pt"."projectId",
    "t"."name" "technologyName"
  FROM
    projects "p"
  FULL OUTER JOIN
    projects_technologies "pt" ON "p"."id" = "pt"."projectId"
  FULL OUTER JOIN
    technologies "t" ON "t"."id" = "pt"."technologyId"
  WHERE
    "p"."id" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [projectId],
  };

  const result: TQueryResultProjectWithTechnologies = await client.query(
    queryConfig
  );
  const projectWithTechnology: IProjectWithTechnologies[] = result.rows;
  return res.status(200).json(projectWithTechnology);
};

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = res.locals.projects.id;
  const data: TPartialProject = req.body;

  const queryTemplate: string = format(
    `
    UPDATE
      projects
      SET(%I) = ROW(%L)
    WHERE
      id = $1
    RETURNING *;
    `,
    Object.keys(data),
    Object.values(data)
  );
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [projectId],
  };

  const result: TQueryResultProject = await client.query(queryConfig);
  const project: IProject = result.rows[0];

  return res.status(200).json(project);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId: number = res.locals.projects.id;

  const queryTemplate: string = `DELETE FROM projects WHERE id = $1;`;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [projectId],
  };

  await client.query(queryConfig);
  return res.status(204).send();
};

const getAllTechnologies = async (): Promise<ITechnology[]> => {
  const queryTemplate: string = `SELECT * FROM technologies;`;
  const result: TQueryResultTechnology = await client.query(queryTemplate);
  const allTechnologies: ITechnology[] = result.rows;

  return allTechnologies;
};

const getAllProjectsTechnologiesTable = async (): Promise<
  IProjectTechonolgyTable[]
> => {
  const queryTemplate: string = `SELECT * FROM projects_technologies;`;
  const result: TQueryResultProjectTechnologyTable = await client.query(
    queryTemplate
  );
  const allProjectsTechnologiesDB: IProjectTechonolgyTable[] = result.rows;

  return allProjectsTechnologiesDB;
};

const createProjectTechonology = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId: number = res.locals.projects.id;
  const technologyId: number = res.locals.technologies.id;

  const data: TProjectTechnologyTableRequest = {
    addedIn: new Date(),
    projectId: projectId,
    technologyId: technologyId,
  };

  const queryTemplate: string = format(
    `
  INSERT INTO
    projects_technologies
    (%I)
  VALUES
    (%L);
  `,
    Object.keys(data),
    Object.values(data)
  );
  await client.query(queryTemplate);
  const projectWithTechnology = await getProjectFull(projectId);

  return res.status(201).json(projectWithTechnology);
};
const getProjectFull = async (projectId: number) => {
  const queryTemplate2: string = format(`
  SELECT
    "p"."name" "projectName",
    "p"."description" "projectDescription",
    "p"."estimatedTime" "projectEstimatedTime",
    "p"."repository" "projectRepository",
    "p"."startDate" "projectStartDate",
    "p"."endDate" "projectEndDate",
    "p"."developerId" "projectDeveloperId",
    "pt"."technologyId",
    "pt"."projectId",
    "t"."name" "technologyName"
  FROM
    projects "p"
  FULL OUTER JOIN
    projects_technologies "pt" ON "p"."id" = "pt"."projectId"
  FULL OUTER JOIN
    technologies "t" ON "t"."id" = "pt"."technologyId"
  WHERE
    "p".id = $1;
  ;
  `);
  const queryConfig: QueryConfig = {
    text: queryTemplate2,
    values: [projectId],
  };

  const result: TQueryResultProjectWithTechnologies = await client.query(
    queryConfig
  );
  const projectWithTechnology: IProjectWithTechnologies = result.rows[0];
  return projectWithTechnology;
};
const deleteTechnologieOnProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = res.locals.projects.id;
  const technologiesId: number = res.locals.technologies.id;

  const queryTemplate: string = `DELETE FROM projects_technologies WHERE "projectId" = $1 AND "technologyId" = $2;`;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [projectId, technologiesId],
  };

  await client.query(queryConfig);
  return res.status(204).send();
};

export {
  createDeveloper,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
  createDeveloperInfo,
  getAllDevelopers,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createProject,
  getAllTechnologies,
  createProjectTechonology,
  getAllProjectsTechnologiesTable,
  deleteTechnologieOnProject,
};
