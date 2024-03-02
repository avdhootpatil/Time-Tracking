import {
  addTimeEntry,
  dailyHoursLogged,
  deleteTimeEntry,
  getTimeSheetDetailsyUserId,
  gettasksbydate,
  updateTimeEntry,
} from "../data/repositories/timeSheetRepository.js";

export const getTimeSheetDetailsyUserIdService = async (
  startDate,
  endDate,
  userId
) => {
  try {
    return await getTimeSheetDetailsyUserId(startDate, endDate, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const gettasksbydateService = async (userId, taskDate) => {
  try {
    return await gettasksbydate(userId, taskDate);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTimeEntryService = async (taskId, userId) => {
  try {
    return await deleteTimeEntry(taskId, userId);
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
    return await addTimeEntry(
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const dailyHoursLoggedService = async (month, year, userId) => {
  try {
    return await dailyHoursLogged(month, year, userId);
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
    return updateTimeEntry(
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};
