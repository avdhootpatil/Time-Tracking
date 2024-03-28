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
  let color = `blue`;

  if (hours == 8) {
    color = `green`;
  }

  if (hours < 8) {
    color = `yellow`;
  }

  if (hours < 5) {
    color = `red`;
  }

  return color;
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
    } else {
      day.hoursLogged = 0;
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

export const getYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  let counter = 1;
  for (let i = currentYear - 20; i <= currentYear; i++) {
    let year = {
      id: counter,
      year: i,
    };
    years.push(year);
    counter++;
  }
  return years;
};

export const getLeaveTypeColour = (leaveType) => {
  let colour = "";

  switch (leaveType) {
    case "Casual Leave":
      colour = "primary";
      break;

    case "Priviledge Leave":
      colour = "success";
      break;

    case "Sick Leave":
      colour = "warning";
      break;

    case "Unpaid Leave":
      colour = "danger";
      break;

    default:
      colour = "neutral";
      break;
  }

  return colour;
};

const getLeaveDuration = (from, to, leaveRequestFor) => {
  let numberOfDays = 0;
  if (leaveRequestFor == "half-day") {
    numberOfDays = 0.5;
  }

  if (leaveRequestFor == "full-day") {
    //calculate leave duration
  }
  return numberOfDays;
};

export const getLeavePostPayload = (leave) => {
  let payload = {
    leaveTypeId: leave.leaveType?.id || 0,
    from: leave.from,
    to: leave?.leaveRequestFor === "half-day" ? leave.from : leave?.to,
    leaveRequestFor: leave?.leaveRequestFor,
    reason: leave.reason,
    approverId: leave.approver?.id || 0,
  };

  return payload;
};
