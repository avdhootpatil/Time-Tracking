import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const getTimeSheetDetailsyUserId = async (
  startDate,
  endDate,
  userId
) => {
  try {
    let result = await pool
      .request()
      .input("startDate", sql.VarChar, startDate)
      .input("endDate", sql.VarChar, endDate)
      .input("userId", sql.Int, userId)
      .execute("GetTasksByUserId");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const gettasksbydate = async (userId, taskDate) => {
  try {
    let result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("TaskDate", sql.DateTime, taskDate)
      .execute("GetTaskByDate");

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTimeEntry = async (taskId, userId) => {
  try {
    await pool
      .request()
      .input("TaskId", sql.Int, taskId)
      .input("ModifiedBy", sql.Int, userId)
      .query(
        `UPDATE TASKS SET 
        IsActive=0,
        ModifiedBy=@ModifiedBy,
        ModifiedDate=GETDATE()
      WHERE 
        TaskId=@TasKId `
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addTimeEntry = async (
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const dailyHoursLogged = async (month, year, userId) => {
  try {
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

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTimeEntry = async (
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
    await pool
      .request()
      .input("TaskId", sql.Int, taskId)
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};
