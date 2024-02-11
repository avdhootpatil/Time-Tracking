import sql from "mssql";
import {
  Client,
  Project,
  Task,
  TaskByUserIdDTO,
  User,
} from "../models/index.js";
import { taskSchema } from "../schema/index.js";
import { tasksByDate } from "../helperFunctions.js";
import camelCaseKeys from "camelcase-keys";

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

export const gettasksbydate = async (req, res) => {
  try {
    let pool = req.db;

    let { taskDate } = req.query;
    let user = req.user;
    let userId = user.id;

    if (!userId || !taskDate)
      return res.status(400).send({ message: "Missing parameters" });

    taskDate = taskDate.split("T")[0];

    let result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("TaskDate", sql.DateTime, taskDate)
      .execute("GetTaskByDate");

    //get result and convert the client, project, user in object and attche it to the response.
    let tasks = result.recordset;

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

    tasks = camelCaseKeys(tasks, { deep: true });

    res.status(200).send(tasks);
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

    let { user } = req;
    let userId = user.id;
    let {
      taskDate,
      taskName,
      clientId,
      projectId,
      estimateValue,
      azureValue,
      userStoryNumber,
      taskNumber,
    } = req.body;

    await pool
      .request()
      .input("TaskName", sql.VarChar, taskName)
      .input("ClientId", sql.Int, clientId)
      .input("ProjectId", sql.Int, projectId)
      .input("EstimateValue", sql.Int, estimateValue)
      .input("AzureValue", sql.Int, azureValue)
      .input("UserStoryNumber", sql.Int, userStoryNumber)
      .input("TaskNumber", sql.Int, taskNumber)
      .input("UserId", sql.Int, userId)
      .input("IsActive", sql.Bit, 1)
      .input("TaskDate", sql.DateTime, taskDate)
      .query(
        `INSERT INTO TASKS
          (
            TaskName,
            ClientId, 
            ProjectId,
            EstimateValue,
            AzureValue,
            UserStoryNumber,
            TaskNumber,
            UserId,
            CreatedBy,
            CreatedDate,
            IsActive
          )
        VALUES
            (
              @TaskName,
              @ClientId,
              @ProjectId,
              @EstimateValue,
              @AzureValue,
              @UserStoryNumber,
              @TaskNumber,
              @UserId,
              @UserId,
              @TaskDate,
              1
            )
        `
      );

    // let taskTable = new sql.Table();

    // taskTable.columns.add("TaskId", sql.Int);
    // taskTable.columns.add("TaskName", sql.VarChar, {
    //   length: 100,
    //   nullable: true,
    // });

    // taskTable.columns.add("ClientId", sql.Int);
    // taskTable.columns.add("ProjectId", sql.Int);
    // taskTable.columns.add("EstimateValue", sql.Int);
    // taskTable.columns.add("AzureValue", sql.Int);
    // taskTable.columns.add("UserStoryNumber", sql.Int);
    // taskTable.columns.add("TaskNumber", sql.Int);
    // taskTable.columns.add("UserId", sql.Int);
    // taskTable.columns.add("IsActive", sql.Bit);
    // taskTable.columns.add("CreatedDate", sql.DateTime);
    // taskTable.columns.add("CreatedBy", sql.Int);
    // taskTable.columns.add("ModifiedBy", sql.Int);
    // taskTable.columns.add("ModifiedDate", sql.DateTime);

    // for (let i = 0; i < tasks.length; i++) {
    //   taskTable.rows.add(
    //     tasks[i].taskId,
    //     tasks[i].taskName,
    //     tasks[i].clientId,
    //     tasks[i].projectId,
    //     tasks[i].estimateValue,
    //     tasks[i].azureValue,
    //     tasks[i].userStoryNumber,
    //     tasks[i].taskNumber,
    //     userId,
    //     1,
    //     taskDate,
    //     userId,
    //     userId,
    //     new Date().toISOString()
    //   );
    // }

    // console.log(taskTable);

    // await pool.request().input("tvp", taskTable).execute("AddTimeEntry");

    res.status(201).send({ messgae: "Task added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
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
      0,
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

export const dailyHoursLogged = async (req, res) => {
  try {
    let pool = req.db;
    let { month, year } = req.query;
    let userId = req.user.id;

    let result = await pool
      .request()
      .input("Month", sql.Int, month)
      .input("Year", sql.Int, year)
      .input("UserId", sql.Int, userId)
      .query(
        `SELECT FORMAT(CreatedDate, 'yyyy-MM-dd') AS date,
        SUM(AzureValue) AS hoursLogged
        FROM Tasks
        WHERE MONTH(CreatedDate) = @Month
        AND YEAR(CreatedDate) = @Year 
        AND CreatedBy = @UserId
        AND IsActive = 1
        GROUP BY FORMAT(CreatedDate, 'yyyy-MM-dd'); `
      );

    res.status(201).send(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
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
