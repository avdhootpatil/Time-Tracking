import { Task } from "./data/models/index.js";

/**
 * Function to get total count of result set
 * @param {object} resultRecordsetItem first object of the the arry of recorset
 * @returns
 */
export const getTotalCount = (resultRecordsetItem) => {
  let totalCount = 0;

  if (resultRecordsetItem) {
    let { TotalCount } = resultRecordsetItem;

    totalCount = TotalCount;
  }
  return totalCount;
};

export const extractPageQuery = (query) => {
  let { page, pageSize } = query;

  // Validate and set default values for page and pageSize

  if (page <= 0) {
    page = 1;
  }

  if (pageSize <= 0) {
    pageSize = process.env.PAGE_SIZE;
  }

  page = parseInt(page || "1");
  pageSize = parseInt(pageSize || process.env.PAGE_SIZE);

  return { page, pageSize };
};

const getTimeEntries = (dates) => {
  let timeEntries = [];

  Object.keys(dates).forEach((date, index) => {
    let tasksByDate = {};
    tasksByDate.id = index + 1;
    tasksByDate.date = date;
    tasksByDate.tasks = dates[date];

    timeEntries.push(tasksByDate);
  });

  return timeEntries;
};

const getTask = (record) => {
  let task = new Task(
    record.TaskId,
    record.TaskName,
    undefined,
    record.ClientName,
    undefined,
    record.ProjectName,
    record.EstimateValue,
    record.AzureValue,
    record.UserStoryNumber,
    record.TaskNumber,
    record.UserId
  );

  return task;
};

export const tasksByDate = (recordSet) => {
  let dates = {};

  if (recordSet.length) {
    recordSet.forEach((record) => {
      let dateString = record.cDate.toISOString();
      let task = getTask(record);
      if (dates.hasOwnProperty(dateString)) {
        dates[dateString].push(task);
      } else {
        dates[dateString] = [task];
      }
    });
  }

  let timeEntries = getTimeEntries(dates);
  return timeEntries;
};

/**
 * Function to get days difference between two dates
 * @param {string} startDate
 * @param {string} endDate
 * @returns
 */
export const getTimeDifference = (startDate, endDate) => {
  if (startDate !== null && endDate !== null) {
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);

    //calculate time difference
    let timeDifference = date2.getTime() - date1.getTime();

    //convert ms to days
    let daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return daysDifference;
  }
  return 0;
};

/**
 * Function to get working days between start date and end date
 * @param {string} startDate
 * @param {string} endDate
 * @returns
 */
export const getWorkingDays = (startDate, endDate) => {
  let workingDays = 0;
  if (startDate !== null && endDate !== null) {
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);

    while (date1 <= date2) {
      let dayOfWeek = date1.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays = workingDays + 1;
      }

      date1.setDate(date1.getDate() + 1);
    }
  }
  return workingDays;
};

export const getBillingSheetByEmployeeName = (timSheet) => {
  let employeesTime = {};
  timSheet.forEach((projectTime) => {
    employeesTime[projectTime.userName] =
      employeesTime[projectTime.userName] || [];
    employeesTime[projectTime.userName].push(projectTime);
  });

  return employeesTime;
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

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-based
  const year = date.getFullYear() % 100; // Get last two digits of the year

  return `${day}/${month}/${year}`;
};
