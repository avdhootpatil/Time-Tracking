import camelcaseKeys from "camelcase-keys";
import {
  addProject,
  deleteProject,
  getProjectById,
  getProjects,
  projectList,
  updateProject,
} from "../data/repositories/projectRepository.js";
import { getTotalCount } from "../helperFunctions.js";
import Client from "../models/client.js";
import { Pagination } from "../models/common.js";
import Project from "../models/project.js";

export const projectListService = async (page, pageSize) => {
  try {
    let projects = await projectList(page, pageSize);
    let totalCount = getTotalCount(projects[0]);

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

    return paginatedResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjectsService = async () => {
  try {
    let projects = await getProjects();

    projects = camelcaseKeys(projects, { deep: true });
    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addProjectService = async (
  projectName,
  projectDescription,
  clientId,
  userId
) => {
  try {
    await addProject(projectName, projectDescription, clientId, userId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProjectService = async (
  projectName,
  projectDescription,
  clientId,
  projectId,
  userId
) => {
  try {
    if (projectId == 0) {
      throw new Error("Invalid project id");
    }

    await updateProject(
      projectName,
      projectDescription,
      clientId,
      projectId,
      userId
    );
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProjectService = async (projectId, userId) => {
  try {
    if (projectId == 0) {
      throw new Error("Invalid project id");
    }
    await deleteProject(projectId, userId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjectByIdService = async (projectId) => {
  try {
    let project = await getProjectById(projectId);

    let { ProjectId, ProjectName, ProjectDescription, ClientName, ClientId } =
      project;

    project = new Project(ProjectId, ProjectName, ProjectDescription);

    let client = new Client(ClientId, ClientName);

    project["client"] = client;

    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
