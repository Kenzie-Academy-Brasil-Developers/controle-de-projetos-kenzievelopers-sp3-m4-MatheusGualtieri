import express, { Application, json } from "express";
import "dotenv/config";
import { startDatabase } from "./database";
import {
  getDeveloperById,
  getProjectById,
  createDeveloper,
  createDeveloperInfo,
  createProject,
  createProjectTechonology,
  deleteDeveloper,
  deleteProject,
  deleteTechnologieOnProject,
  updateDeveloper,
  updateProject,
} from "./logic";
import {
  checkIfDeveloperEmailExist,
  checkIfDeveloperExist,
  checkIfDeveloperInProjectExists,
  checkIfDeveloperInfoExist,
  checkIfDeveloperInfoOsIsCorrect,
  checkIfProjectExists,
  checkIfTechnologyNameAlredyOnTheProject,
  checkIfTechnologyNameAlredyOnTheProjectDelete,
  checkIfTechnologyNameExist,
  checkIfDeveloperIdExist,
  checkIfTechnologyNameExistDelete,
} from "./middlewares";

const app: Application = express();

app.use(json());

app.post("/developers", checkIfDeveloperEmailExist, createDeveloper);

app.get("/developers/:id", checkIfDeveloperExist, getDeveloperById);
app.patch(
  "/developers/:id",
  checkIfDeveloperExist,
  checkIfDeveloperEmailExist,
  updateDeveloper
);
app.delete("/developers/:id", checkIfDeveloperExist, deleteDeveloper);

app.post(
  "/developers/:id/infos",
  checkIfDeveloperExist,
  checkIfDeveloperInfoOsIsCorrect,
  checkIfDeveloperInfoExist,
  createDeveloperInfo
);

app.post("/projects", checkIfDeveloperIdExist, createProject);

app.get("/projects/:id", checkIfProjectExists, getProjectById);
app.patch(
  "/projects/:id",
  checkIfProjectExists,
  checkIfDeveloperIdExist,
  updateProject
);
app.delete("/projects/:id", checkIfProjectExists, deleteProject);

app.post(
  "/projects/:id/technologies",
  checkIfProjectExists,
  checkIfTechnologyNameExist,
  checkIfTechnologyNameAlredyOnTheProject,
  createProjectTechonology
);
app.delete(
  "/projects/:id/technologies/:name",
  checkIfProjectExists,
  checkIfTechnologyNameExistDelete,
  checkIfTechnologyNameAlredyOnTheProjectDelete,
  deleteTechnologieOnProject
);

export default app;
