import { v4 as uuid } from "uuid";

/**
 * Function to get user from local storage
 * @returns
 */
export const getUserFromLocalStorage = () => {
  let user = localStorage.getItem("user");

  if (user) {
    let retrievedUser = JSON.parse(user);

    return retrievedUser;
  }
};
/**
 * Fcuntion to remove user from local storage
 */
export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};

/**
 * Function to get task object
 * @returns
 */
export const getTaskObject = () => {
  return {
    taskId: uuid(),
    taskName: null,
    estimateValue: null,
    azureValue: null,
    userStoryNumber: null,
    taskNumber: null,
    client: null,
    project: null,
  };
};

/**
 * Function to check if id id UUIS
 * @param {string} str
 * @returns
 */
export const isUUID = (str) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
};

/**
 * Function to get post payload for saving tasks
 * @param {string} date
 * @param {object} task
 * @returns
 */
export const getTaskPostPayload = (date, task) => {
  let taskId = isUUID(task.taskId) ? 0 : task.taskId;
  return {
    taskDate: date,
    taskId,
    taskName: task.taskName,
    clientId: task?.client?.id,
    projectId: task?.project?.id,
    estimateValue: task.estimateValue,
    azureValue: task.azureValue,
    userStoryNumber: task.userStoryNumber,
    taskNumber: task.taskNumber,
  };
};

/**
 * Function to get chip type based on hours
 * @param {number} hours
 * @returns
 */
export const hoursChipType = (hours) => {
  let type = "primary";

  if (hours == 8) {
    type = "success";
  }

  if (hours < 8) {
    type = "warning";
  }

  if (hours < 5) {
    type = "error";
  }

  return type;
};
