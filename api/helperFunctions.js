import { Task } from "./models/index.js";

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
