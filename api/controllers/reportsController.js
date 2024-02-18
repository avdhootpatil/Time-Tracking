import camelcaseKeys from "camelcase-keys";
import excelJS from "exceljs";
import fs from "fs";
import sql from "mssql";
import {
  formatBillingSheet,
  getBillingSheetByEmployeeName,
  getWorkingDays,
} from "../helperFunctions.js";
import { BillingSheet } from "../models/index.js";

export const getTimsheet = async (req, res) => {
  try {
    let pool = req.db;

    let { startDate, endDate } = req.query;

    if (startDate === "" || startDate === "null") {
      startDate = null;
    }

    if (endDate === "" || endDate === "null") {
      endDate = null;
    }

    let { user } = req;
    let userId = user.id;

    let result = await pool
      .request()
      .input("StartDate", sql.DateTime, startDate)
      .input("EndDate", sql.DateTime, endDate)
      .input("UserId", sql.Int, userId)
      .execute("GetTimeSheet");

    let timeSheet = result.recordset;

    timeSheet = camelcaseKeys(timeSheet);

    res.status(200).send(timeSheet);
  } catch (e) {
    res.status(500).send({ error: e.messgae });
  }
};

export const exportTimesheet = async (req, res) => {
  try {
    let pool = req.db;

    let { startDate, endDate } = req.query;

    if (startDate === "" || startDate === "null") {
      startDate = null;
    }

    if (endDate === "" || endDate === "null") {
      endDate = null;
    }

    let { user } = req;
    let userId = user.id;

    let result = await pool
      .request()
      .input("StartDate", sql.DateTime, startDate)
      .input("EndDate", sql.DateTime, endDate)
      .input("UserId", sql.Int, userId)
      .execute("GetTimeSheet");

    let timeSheet = result.recordset;

    timeSheet = camelcaseKeys(timeSheet);

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

    //path to download excel
    const filePath = "timesheet.xlsx";

    await workBook.xlsx.writeFile(filePath).then(() => {
      //send the file to the client
      res.download(filePath, "timesheet.xlsx", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error sending file");
        }

        // Remove the temporary file after download
        fs.unlinkSync(filePath);
      });
    });
  } catch (e) {
    res.status(500).send({ error: e.messgae });
  }
};

export const getBillingSheet = async (req, res) => {
  try {
    const pool = req.db;
    const { startDate, endDate } = req.query;

    if (startDate === "" || startDate === "null") {
      startDate = null;
    }

    if (endDate === "" || endDate === "null") {
      endDate = null;
    }

    let { user } = req;
    let userId = user.id;

    let result = await pool
      .request()
      .input("StartDate", sql.DateTime, startDate)
      .input("EndDate", sql.DateTime, endDate)
      .input("UserId", sql.Int, userId)
      .execute("GetBillingSheet");

    let employeesTaskTime = result.recordset;

    employeesTaskTime = camelcaseKeys(employeesTaskTime);

    let workingDays = getWorkingDays(startDate, endDate);
    let totalHours = workingDays * 8;
    let employeesTime = getBillingSheetByEmployeeName(employeesTaskTime);

    let billingSheet = new BillingSheet(workingDays, totalHours, employeesTime);

    res.status(200).send(billingSheet);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

export const exportBillingSheet = async (req, res) => {
  try {
    const pool = req.db;
    const { startDate, endDate } = req.query;

    if (startDate === "" || startDate === "null") {
      startDate = null;
    }

    if (endDate === "" || endDate === "null") {
      endDate = null;
    }

    let { user } = req;
    let userId = user.id;

    let result = await pool
      .request()
      .input("StartDate", sql.DateTime, startDate)
      .input("EndDate", sql.DateTime, endDate)
      .input("UserId", sql.Int, userId)
      .execute("GetBillingSheet");

    let employeesTaskTime = result.recordset;

    employeesTaskTime = camelcaseKeys(employeesTaskTime);

    let workingDays = getWorkingDays(startDate, endDate);
    let totalHours = workingDays * 8;
    let employeesTime = getBillingSheetByEmployeeName(employeesTaskTime);

    let billingSheet = new BillingSheet(workingDays, totalHours, employeesTime);

    let pResult = await pool.request().query(`
    SELECT
      ProjectId as id,
      ProjectName as name ,
      ProjectDescription as description
    FROM
      PROJECTS
    WHERE
      IsActive=1 
    `);

    let projects = pResult.recordset;

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

      newEmployee["hours"] = totalProjectHours;
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

    //path to download excel
    const filePath = "billingSheet.xlsx";

    await workBook.xlsx.writeFile(filePath).then(() => {
      //send the file to the client
      res.download(filePath, "timesheet.xlsx", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error sending file");
        }

        // Remove the temporary file after download
        fs.unlinkSync(filePath);
      });
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};
