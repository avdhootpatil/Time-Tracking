import camelcaseKeys from "camelcase-keys";
import { extractPageQuery, getTotalCount } from "../helperFunctions.js";
import { Pagination } from "../models/common.js";
import { Client, Project } from "../models/index.js";
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

    let totalCount = getTotalCount(projects);

    let paginatedResult = new Pagination(projects, totalCount, page, pageSize);

    //format result
    let newItems = [];
    paginatedResult.items.forEach((project) => {
      let { ProjectId, ProjectName, ProjectDescription, ClientName } = project;
      let newProject = new Project(ProjectId, ProjectName, ProjectDescription);
      newProject["clientName"] = ClientName;
      newItems.push(newProject);
    });

    paginatedResult["items"] = newItems;

    paginatedResult = camelcaseKeys(paginatedResult, { deep: true });

    res.status(200).send(paginatedResult);
  } catch (e) {
    res.status(400).send({ error: e.messgae });
  }
};

export const getProjects = async (req, res) => {
  try {
    let result = await getProjectsService();

    let projects = camelcaseKeys(result.recordset, { deep: true });

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

    if (id == 0) {
      throw new Error("Invalid project id");
    }

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

    if (id == 0) {
      throw new Error("Invalid project id");
    }

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

    let result = await getProjectByIdService(id);

    let { ProjectId, ProjectName, ProjectDescription, ClientName, ClientId } =
      result;

    let project = new Project(ProjectId, ProjectName, ProjectDescription);

    let client = new Client(ClientId, ClientName);

    project["client"] = client;

    res.send(project);
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
