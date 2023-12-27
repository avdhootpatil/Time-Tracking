import express from "express";
import {
  ProjectList,
  addProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
  validateProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/getprojectlist", ProjectList);

projectRouter.post("/addproject", validateProject, addProject);

projectRouter.put("/updateproject/:id", validateProject, updateProject);

projectRouter.post("/deleteproject/:id", deleteProject);

projectRouter.get("/getprojectbyid/:id", getProjectById);

projectRouter.get("/getprojects", getProjects);

export default projectRouter;
