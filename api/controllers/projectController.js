import { extractPageQuery } from "../helperFunctions.js";
import { Project } from "../models/index.js";
import { projectSchema } from "../schema/index.js";
import {
  addProjectService,
  deleteProjectService,
  getProjectByIdService,
  getProjectsService,
  projectListService,
  updateProjectService,
} from "../services/projectService.js";

export const ProjectList = async (req, res) => {
  try {
    // get page, pageSize from query object
    let { page, pageSize } = extractPageQuery(req.query);

    let projects = await projectListService(page, pageSize);

    res.status(200).send(projects);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const getProjects = async (req, res) => {
  try {
    let projects = await getProjectsService();

    res.status(200).send(projects);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const addProject = async (req, res) => {
  try {
    let { projectName, projectDescription, clientId } = req.body;
    let { id } = req.user;

    await addProjectService(projectName, projectDescription, clientId, id);

    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    let { id } = req.params;
    let { projectName, projectDescription, clientId } = req.body;
    let userId = req.user.id;

    await updateProjectService(
      projectName,
      projectDescription,
      clientId,
      id,
      userId
    );

    res.status(201).send({ message: "Project updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    let { id } = req.params;
    let userId = req.user.id;

    await deleteProjectService(id, userId);
    res.status(201).send({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    let { id } = req.params;

    let project = await getProjectByIdService(id);

    res.status(200).send(project);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
};

export const validateProject = async (req, res, next) => {
  try {
    let { projectName, projectDescription, clientId } = req.body;

    let project = new Project(0, projectName, projectDescription, clientId);

    await projectSchema.validate(project, { abortEarly: false });

    next();
  } catch (err) {
    // add errors in object with key as prop name and value as prop value

    let projectErrors = {};
    err.inner.forEach((err) => {
      projectErrors[err.path] = err.errors;
    });

    return res.status(400).json(projectErrors);
  }
};
