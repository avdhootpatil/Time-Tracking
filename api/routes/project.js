import express from "express";
import {
  ProjectList,
  addProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/getprojectlist", ProjectList);

projectRouter.post("/addproject", addProject);

projectRouter.put("/updateproject/:id", updateProject);

projectRouter.post("/deleteproject/:id", deleteProject);

projectRouter.get("/getprojectbyid/:id", getProjectById);

projectRouter.get("/getprojects", getProjects);

export default projectRouter;
