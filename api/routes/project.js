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
import { auth } from "../controllers/userController.js";

const projectRouter = express.Router();

projectRouter.get("/getprojectlist", ProjectList);

projectRouter.post("/addproject", auth, validateProject, addProject);

projectRouter.put("/updateproject/:id", auth, validateProject, updateProject);

projectRouter.post("/deleteproject/:id", auth, deleteProject);

projectRouter.get("/getprojectbyid/:id", auth, getProjectById);

projectRouter.get("/getprojects", getProjects);

export default projectRouter;
