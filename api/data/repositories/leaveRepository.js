import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const requestLeave = async (
  leaveTypeId,
  from,
  to,
  reason,
  numberOfDays,
  userId
) => {
  try {
    let response = await pool
      .request()
      .input("LeaveTypeId", sql.Int, leaveTypeId)
      .input("From", sql.DateTime, from)
      .input("To", sql.DateTime, to)
      .input("Reason", sql.VarChar, reason)
      .input("NumberOfDays", sql.Float, numberOfDays)
      .input("CreatedBy", sql.Int, userId)
      .output("InsertedLeaveId", sql.Int)
      .execute("RequestLeave");

    let leaveId = response.output.InsertedLeaveId;
    return leaveId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addUserLeaves = async (userId, leaveId, approverId) => {
  try {
    await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("LeaveId", sql.Int, leaveId)
      .input("ApproverId", sql.Int, approverId)
      .execute("AddUserLeave");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserLeaves = async (leaveId, approverId) => {
  try {
    await pool
      .request()
      .input("LeaveId", sql.Int, leaveId)
      .input("ApproverId", sql.Int, approverId)
      .execute("UpdateUserLeave");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateLeave = async (
  leaveId,
  leaveTypeId,
  from,
  to,
  reason,
  numberOfDays,
  userId,
  approverId
) => {
  try {
    await pool
      .request()
      .input("LeaveId", sql.Int, leaveId)
      .input("LeaveTypeId", sql.Int, leaveTypeId)
      .input("From", sql.DateTime, from)
      .input("To", sql.DateTime, to)
      .input("Reason", sql.VarChar, reason)
      .input("NumberOfDays", sql.Float, numberOfDays)
      .input("ModifiedBy", sql.Int, userId)
      .input("approverId", sql.Int, approverId)
      .execute("UpdateLeave");

    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const withDraw = async (leaveId) => {
  try {
    await pool
      .request()
      .input("LeaveId", sql.Int, leaveId)
      .execute("WithdrawLeave");
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllLeaves = async (userId) => {
  try {
    let result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .execute("GetAllLeaves");

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLeaveById = async (leaveId) => {
  try {
    let result = await pool
      .request()
      .input("LeaveId", sql.Int, leaveId)
      .execute("GetLeaveById");

    return result.recordset[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLeaveTypes = async () => {
  try {
    let result = await pool.request().execute("GetAllLeaveTypes");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLeaveBalance = async (userId) => {
  try {
    let result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .execute("GetLeaveBalance");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const approveLeaves = () => {};
