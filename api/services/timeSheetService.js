import camelcaseKeys from "camelcase-keys";
import {
  addTimeEntry,
  dailyHoursLogged,
  deleteTimeEntry,
  getTimeSheetDetailsyUserId,
  gettasksbydate,
  updateTimeEntry,
} from "../data/repositories/timeSheetRepository.js";
import Client from "../models/client.js";
import Project from "../models/project.js";
import TaskByUserIdDTO from "../models/taskByUserIdDTO.js";
import User from "../models/user.js";

export const getTimeSheetDetailsyUserIdService = async (
  startDate,
  endDate,
  userId
) => {
  try {
    let tasks = await getTimeSheetDetailsyUserId(startDate, endDate, userId);

    tasks = tasksByDate(timeSheetDetails);

    tasks = new TaskByUserIdDTO(startDate, endDate, timeEntries);
    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const gettasksbydateService = async (userId, taskDate) => {
  try {
    taskDate = taskDate.split("T")[0];
    let tasks = await gettasksbydate(userId, taskDate);
    tasks.forEach((task) => {
      //client
      let client = new Client(task.ClientId, task.ClientName);
      task["client"] = client;
      delete task.ClientId;
      delete task.ClientName;

      //project
      let project = new Project(task.ProjectId, task.ProjectName);
      task["project"] = project;
      delete task.ProjectId;
      delete task.ProjectName;

      //user
      let user = new User(task.UserId, task.UserName);
      task["user"] = user;
      delete task.UserId;
      delete task.UserName;
    });

    tasks = camelcaseKeys(tasks, { deep: true });
    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTimeEntryService = async (taskId, userId) => {
  try {
    if (taskId == 0) {
      throw new Error("Invalid task id");
    }

    await deleteTimeEntry(taskId, userId);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addTimeEntryService = async (
  taskName,
  clientId,
  projectId,
  estimateValue,
  azureValue,
  userStoryNumber,
  taskNumber,
  userId,
  taskDate
) => {
  try {
    await addTimeEntry(
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      userId,
      taskDate
    );

    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const dailyHoursLoggedService = async (month, year, userId) => {
  try {
    let hours = await dailyHoursLogged(month, year, userId);
    return hours;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTimeEntryService = async (
  taskId,
  taskName,
  clientId,
  projectId,
  estimateValue,
  azureValue,
  userStoryNumber,
  taskNumber,
  userId
) => {
  try {
    if (taskId == 0) {
      throw new Error("Invalid task id");
    }

    await updateTimeEntry(
      taskId,
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      userId
    );
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
