import camelcaseKeys from "camelcase-keys";
import excelJS from "exceljs";
import {
  getBillingSheet,
  getTimsheet,
} from "../data/repositories/reportsRepository.js";
import {
  formatBillingSheet,
  getBillingSheetByEmployeeName,
  getWorkingDays,
} from "../helperFunctions.js";
import BillingSheet from "../data/models/billingSheetDTO.js";
import { getProjectsService } from "./projectService.js";

export const getTimsheetService = async (startDate, endDate, userId) => {
  try {
    if (startDate === "" || startDate === "null") {
      startDate = null;
    }

    if (endDate === "" || endDate === "null") {
      endDate = null;
    }

    let timeSheet = await getTimsheet(startDate, endDate, userId);

    timeSheet = camelcaseKeys(timeSheet);
    return timeSheet;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const exportTimeSheetService = async (startDate, endDate, userId) => {
  if (startDate === "" || startDate === "null") {
    startDate = null;
  }

  if (endDate === "" || endDate === "null") {
    endDate = null;
  }

  let timeSheet = await getTimsheetService(startDate, endDate, userId);

  //create new workbook
  const workBook = new excelJS.Workbook();

  //create new worksheet
  const workSheet = workBook.addWorksheet("Timesheet");

  //columns to add data
  workSheet.columns = [
    { header: "TasK ID", key: "taskId", width: 10 },
    { header: "Date", key: "date", width: 10 },
    { header: "Client", key: "clientName", width: 10 },
    { header: "Project", key: "projectName", width: 10 },
    { header: "User Story Number", key: "userStoryNumber", width: 10 },
    { header: "Task Number", key: "taskNumber", width: 10 },
    { header: "Task Name", key: "taskName", width: 10 },
    { header: "Estimate", key: "estimateValue", width: 10 },
    { header: "Azure Value", key: "azureValue", width: 10 },
  ];

  //add data
  timeSheet.forEach((task) => {
    workSheet.addRow(task);
  });

  //make first column bold
  workSheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  return workBook;
};

export const getBillingSheetService = async (startDate, endDate, userId) => {
  try {
    if (startDate === "" || startDate === "null") {
      startDate = null;
    }

    if (endDate === "" || endDate === "null") {
      endDate = null;
    }

    let employeesTaskTime = await getBillingSheet(startDate, endDate, userId);

    employeesTaskTime = camelcaseKeys(employeesTaskTime);

    let workingDays = getWorkingDays(startDate, endDate);
    let totalHours = workingDays * 8;
    let employeesTime = getBillingSheetByEmployeeName(employeesTaskTime);

    let billingSheet = new BillingSheet(workingDays, totalHours, employeesTime);

    return billingSheet;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const exportBillingSheetService = async (startDate, endDate, userId) => {
  if (startDate === "" || startDate === "null") {
    startDate = null;
  }

  if (endDate === "" || endDate === "null") {
    endDate = null;
  }

  let billingSheet = await getBillingSheetService(startDate, endDate, userId);

  let projects = await getProjectsService();

  projects = camelcaseKeys(projects, { deep: true });

  billingSheet = formatBillingSheet(billingSheet, projects);

  //create new workbook
  const workBook = new excelJS.Workbook();

  //create new worksheet
  const workSheet = workBook.addWorksheet("BillingSheet");
  let projectColumns = [];

  projects.forEach((project) => {
    let column = {};
    column["header"] = project.name;
    column["key"] = project.name;
    column["width"] = 10;

    projectColumns.push(column);
  });

  workSheet.columns = [
    { header: "Name", key: "name", width: 10 },
    { header: "Work Days In Month", key: "workingDays", width: 10 },
    { header: "Available Hours", key: "totalHours", width: 10 },
    ...projectColumns,
    { header: "Total Azure Hours", key: "hours", width: 10 },
    { header: "Idle Time", key: "idleTime", width: 10 },
    { header: "Utilizations", key: "utilization", width: 10 },
  ];

  // format billingSheet
  let newBillingSheet = [];
  billingSheet.forEach((employee) => {
    let newEmployee = {};
    newEmployee["name"] = employee.name;
    newEmployee["workingDays"] = employee.workingDays;
    newEmployee["totalHours"] = employee.totalHours;

    let totalProjectHours = 0;

    employee.projectTime.forEach((project) => {
      newEmployee[project.name] = project.time;
      totalProjectHours = totalProjectHours + project.time;
    });

    let idleTime =
      employee.totalHours - totalProjectHours > 0
        ? employee.totalHours - totalProjectHours
        : 0;

    newEmployee["hours"] = totalProjectHours;
    newEmployee["idleTime"] = idleTime;
    newEmployee["utilization"] =
      (totalProjectHours / employee.totalHours) * 100;
    newBillingSheet.push(newEmployee);
  });

  //add data
  newBillingSheet.forEach((employee) => {
    workSheet.addRow(employee);
  });

  //make first column bold
  workSheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  return workBook;
};
