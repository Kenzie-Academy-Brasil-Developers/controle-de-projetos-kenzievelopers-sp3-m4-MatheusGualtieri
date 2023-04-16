import {
  getAllDevelopers,
  getAllProjects,
  getAllProjectsTechnologiesTable,
  getAllTechnologies,
} from "./logic";
import { Request, Response, NextFunction } from "express";
import {
  IDeveloper,
  IDeveloperWithInfo,
  TDeveloperRequest,
  TQueryResultDeveloperWithInfo,
  TDeveloperInfoRequest,
  IProject,
  TTechnologyRequest,
  ITechnology,
  IProjectTechonolgyTable,
  IDeveloperInfoFormat,
} from "./interfaces";
import { QueryConfig } from "pg";
import { client } from "./database";

const checkIfDeveloperEmailExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email: string = req.body.email;
  const allDevelopers: IDeveloper[] = await getAllDevelopers();
  const checkEmail: IDeveloper | undefined = allDevelopers.find(
    (developer) => developer.email === email
  );
  if (checkEmail) {
    return res.status(409).json({ message: "Email already exists." });
  }

  return next();
};

const checkIfDeveloperExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = Number(req.params.id);
  const allDevelopers: IDeveloper[] = await getAllDevelopers();

  const checkId: IDeveloper | undefined = allDevelopers.find(
    (developer) => developer.id === id
  );
  console.log(checkId);
  if (!checkId) {
    return res.status(404).json({ message: "Developer not found." });
  }

  res.locals.developer = {
    id: id,
  };

  return next();
};

const checkIfDeveloperIdExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.body.developerId;
  const allDevelopers: IDeveloper[] = await getAllDevelopers();

  const checkId: IDeveloper | undefined = allDevelopers.find(
    (developer) => developer.id === id
  );

  if (!checkId) {
    return res.status(404).json({ message: "Developer not found." });
  }

  res.locals.developer = {
    id: id,
  };

  return next();
};

const checkIfDeveloperInfoExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
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
    JOIN
      developer_infos "di" ON "di"."developerId" = "d"."id"
    WHERE "d"."id" = $1;`;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [developerId],
  };
  const result: TQueryResultDeveloperWithInfo = await client.query(queryConfig);
  const developer: IDeveloperInfoFormat = result.rows[0];

  if (developer) {
    return res.status(409).json({ message: "Developer infos already exists." });
  }

  return next();
};

const checkIfDeveloperInfoOsIsCorrect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: string = req.body.preferredOS;
  if (data === "Windows" || data === "Linux" || data === "MacOS") {
    res.locals.developerInfo = {
      developerId: Number(req.params.id),
      developerSince: req.body.developerSince,
      preferredOS: req.body.preferredOS,
    };
    return next();
  }

  return res.status(400).json({
    message: "Invalid OS option.",
    options: ["Windows", "Linux", "MacOS"],
  });
};

const checkIfProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId: number = Number(req.params.id);

  const allProjects: IProject[] = await getAllProjects();

  const checkId: IProject | undefined = allProjects.find(
    (project) => project.id === projectId
  );

  if (!checkId) {
    return res.status(404).json({ message: "Project not found." });
  }

  res.locals.projects = {
    id: projectId,
  };

  return next();
};

const checkIfDeveloperInProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = req.body.developerId;
  const allDevelopers: IDeveloper[] = await getAllDevelopers();

  const checkId: IDeveloper | undefined = allDevelopers.find(
    (developer) => developer.id === id
  );

  if (!checkId) {
    return res.status(404).json({ message: "Developer not found." });
  }

  res.locals.developer = {
    id: id,
  };

  return next();
};

const checkIfTechnologyNameExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: TTechnologyRequest = req.body;
  const allTechnologies: ITechnology[] = await getAllTechnologies();
  const nameExist: ITechnology | undefined = allTechnologies.find(
    (technology) => technology.name === data.name
  );

  if (!nameExist) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technologies = {
    id: nameExist.id,
    name: nameExist.name,
  };

  return next();
};

const checkIfTechnologyNameExistDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: string = req.params.name;
  const allTechnologies: ITechnology[] = await getAllTechnologies();
  const nameExist: ITechnology | undefined = allTechnologies.find(
    (technology) => technology.name === data
  );

  if (!nameExist) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technologies = {
    id: nameExist.id,
    name: nameExist.name,
  };

  return next();
};

const checkIfTechnologyNameAlredyOnTheProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const technologyId = Number(res.locals.technologies.id);
  const allProjectsTechnologiesTable = await getAllProjectsTechnologiesTable();

  const technologyExist: IProjectTechonolgyTable | undefined =
    allProjectsTechnologiesTable.find(
      (project) => project.technologyId === technologyId
    );

  if (technologyExist) {
    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};

const checkIfTechnologyNameAlredyOnTheProjectDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const technologyId = Number(res.locals.technologies.id);
  const allProjectsTechnologiesTable = await getAllProjectsTechnologiesTable();

  const technologyExist: IProjectTechonolgyTable | undefined =
    allProjectsTechnologiesTable.find(
      (project) => project.technologyId === technologyId
    );

  if (!technologyExist) {
    return res.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  return next();
};

export {
  checkIfDeveloperInfoExist,
  checkIfDeveloperInfoOsIsCorrect,
  checkIfDeveloperExist,
  checkIfDeveloperEmailExist,
  checkIfProjectExists,
  checkIfDeveloperInProjectExists,
  checkIfTechnologyNameAlredyOnTheProject,
  checkIfTechnologyNameExist,
  checkIfTechnologyNameAlredyOnTheProjectDelete,
  checkIfDeveloperIdExist,
  checkIfTechnologyNameExistDelete,
};
