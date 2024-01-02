import sql from "mssql";
import { Task, TaskByUserIdDTO } from "../models/index.js";
import { taskSchema } from "../schema/index.js";
import { tasksByDate } from "../helperFunctions.js";

export const getTimeSheetDetailsyUserId = async (req, res) => {
  try {
    let pool = req.db;

    let { startDate, endDate, userId } = req.body;

    if (!startDate || !endDate)
      return res.status(400).send({ message: "Missing parameters" });

    let result = await pool
      .request()
      .input("startDate", sql.VarChar, startDate)
      .input("endDate", sql.VarChar, endDate)
      .input("userId", sql.Int, userId)
      .execute("GetTasksByUserId");

    let timeEntries = tasksByDate(result.recordset);

    let tasks = new TaskByUserIdDTO(startDate, endDate, timeEntries);

    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getTimeEntryById = async (req, res) => {
  try {
    let pool = req.db;

    let { id } = req.params;

    let result = await pool.request().input("TaskId", sql.Int, id).query(`
      SELECT * FROM TASKS WHERE IsActive=1 AND TaskId=@TaskId
    `);

    res.status(200).send(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.send(500).send({ message: err.message });
  }
};

export const deleteTimeEntry = async (req, res) => {
  try {
    let pool = req.db;
    let { id } = req.params;
    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid task id");
    }

    await pool
      .request()
      .input("TaskId", sql.Int, id)
      .input("UserId", sql.Int, userId)
      .query(
        `UPDATE TASKS SET 
          IsActive=0 
          ModifiedBy=@UserId,
          ModifiedDate=GETDATE()
        WHERE 
          TaskId=@TasKId `
      );

    res.status(201).send({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const addTimeEntry = async (req, res) => {
  try {
    let pool = req.db;

    let {
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      taskDate,
    } = req.body;

    let { id } = req.user;

    await pool
      .request()
      .input("TaskName", sql.VarChar, taskName)
      .input("ClientId", sql.Int, clientId)
      .input("ProjectId", sql.Int, projectId)
      .input("EstimateValue", sql.Decimal(10, 2), estimateValue)
      .input("AzureValue", sql.Decimal(10, 2), azureValue)
      .input("UserStoryNumber", sql.Int, userStoryNumber)
      .input("TaskNumber", sql.Int, taskNumber)
      .input("UserId", sql.Int, id)
      .input("IsActive", sql.Bit, 1)
      .input("TaskDate", sql.Date, taskDate)
      .execute("AddTimeEntry");

    res.status(201).send({ messgae: "Task added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

export const updateTimeEntry = async (req, res) => {
  try {
    let pool = req.db;

    let { id } = req.params;
    let {
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
    } = req.body;

    let userId = req.user.id;

    if (id == 0) {
      throw new Error("Invalid task id");
    }

    await pool
      .request()
      .input("TaskId", sql.Int, id)
      .input("TaskName", sql.VarChar, taskName)
      .input("ClientId", sql.Int, clientId)
      .input("ProjectId", sql.Int, projectId)
      .input("EstimateValue", sql.Decimal(10, 2), estimateValue)
      .input("AzureValue", sql.Decimal(10, 2), azureValue)
      .input("UserStoryNumber", sql.Int, userStoryNumber)
      .input("TaskNumber", sql.Int, taskNumber)
      .input("UserId", sql.Int, userId)
      .input("IsActive", sql.Bit, 1)
      .query(
        `UPDATE TASKS 
        SET 
          TaskName=@TaskName, 
          ClientId=@ClientId,
          ProjectId=@ProjectId,
          EstimateValue=@EstimateValue,
          AzureValue=@AzureValue,
          UserStoryNumber=@UserStoryNumber,
          TaskNumber=@TaskNumber,
          UserId=@UserId,
          ModifiedBy=@UserId,
          ModifiedDate=GETDATE()
        WHERE 
          TaskId=@TaskId`
      );

    res.status(201).send({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export const validateTimeEntry = async (req, res, next) => {
  try {
    let {
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      taskDate,
    } = req.body;

    let { id } = req.user;

    let task = new Task(
      undefined,
      taskName,
      clientId,
      undefined,
      projectId,
      undefined,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
      id,
      taskDate
    );

    await taskSchema.validate(task, { abortEarly: false });

    next();
  } catch (err) {
    // add errors in object with key as prop name and value as prop value
    let taskErrors = {};
    err.inner.forEach((err) => {
      taskErrors[err.path] = err.errors;
    });

    return res.status(400).json(taskErrors);
  }
};
