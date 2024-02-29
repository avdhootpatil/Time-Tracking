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
  let className = `inline-flex items-center rounded-md bg-blue-250 px-2 py-1 my-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10`;

  if (hours == 8) {
    className = `inline-flex items-center rounded-md bg-green-250 px-2 py-1 my-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10`;
  }

  if (hours < 8) {
    className = `inline-flex items-center rounded-md bg-yellow-250 px-2 py-1 my-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10`;
  }

  if (hours < 5) {
    className = `inline-flex items-center rounded-md bg-red-250 px-2 py-1 my-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10`;
  }

  return className;
};

/**
 * Function to format hours logged for the current month
 * @param {Array} days
 * @returns
 */
export const hourLoggedForMonth = (days) => {
  let hours = {};
  days.forEach((day) => {
    hours[day.date] = day.hoursLogged;
  });

  return hours;
};

export const updateHoursLogged = (currentMonth, daysOfMonth, hoursLogged) => {
  let days = daysOfMonth[currentMonth];
  days.forEach((day) => {
    if (hoursLogged.hasOwnProperty(day.date)) {
      day.hoursLogged = hoursLogged[day.date];
    }
  });

  return daysOfMonth;
};

export const getProjectTime = (projects, employeeTime) => {
  let employeeProject = {};
  employeeTime.forEach((project) => {
    employeeProject[project.projectName] = project;
  });

  let projectTime = [];
  projects.forEach((project) => {
    let newProject = {};
    newProject["id"] = project.id;
    newProject["name"] = project.name;
    newProject["time"] = employeeProject[project.name]?.timeOnBoard || 0;

    projectTime.push(newProject);
  });

  return projectTime;
};

export const formatBillingSheet = (billingSheet, projects) => {
  let newSheet = [];
  let { workingDays, totalHours, employeesTime } = billingSheet;

  Object.keys(employeesTime).forEach((employee) => {
    let newEmployee = {};
    newEmployee["name"] = employee;
    newEmployee["workingDays"] = workingDays;
    newEmployee["totalHours"] = totalHours;
    newEmployee["projectTime"] = getProjectTime(
      projects,
      employeesTime[employee]
    );

    newSheet.push(newEmployee);
  });

  return newSheet;
};

export const getTotalAzureHours = (projects) => {
  let totalHours = 0;
  projects.forEach((project) => {
    totalHours = totalHours + project.time;
  });
  return totalHours;
};
