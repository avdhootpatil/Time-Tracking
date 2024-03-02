import {
  addProject,
  deleteProject,
  getProjectById,
  getProjects,
  projectList,
  updateProject,
} from "../data/repositories/projectRepository.js";

export const projectListService = async (page, pageSize) => {
  try {
    return await projectList(page, pageSize);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjectsService = async () => {
  try {
    return await getProjects();
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
    return await addProject(projectName, projectDescription, clientId, userId);
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
    return await updateProject(
      projectName,
      projectDescription,
      clientId,
      projectId,
      userId
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProjectService = async (projectId, userId) => {
  try {
    return await deleteProject(projectId, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjectByIdService = async (projectId) => {
  try {
    return await getProjectById(projectId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
