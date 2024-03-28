import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const requestLeave = async (
  leaveDates,
  leaveTypeId,
  from,
  to,
  reason,
  numberOfDays,
  userId,
  approverId,
  leaveRequestFor
) => {
  try {
    //create a typed table
    let leavesTable = new sql.Table();

    //add columns
    leavesTable.columns.add("LeaveTypeId", sql.Int);
    leavesTable.columns.add("From", sql.DateTime);
    leavesTable.columns.add("To", sql.DateTime);
    leavesTable.columns.add("Reason", sql.VarChar, {
      length: 100,
      nullable: true,
    });
    leavesTable.columns.add("CreatedBy", sql.Int);
    leavesTable.columns.add("CreatedDate", sql.DateTime);
    leavesTable.columns.add("approvalStatusId", sql.Int);
    leavesTable.columns.add("IsActive", sql.Bit);
    leavesTable.columns.add("NumberOfDays", sql.Int);
    leavesTable.columns.add("ModifiedBy", sql.Int);
    leavesTable.columns.add("ModifiedDate", sql.DateTime);

    //add data
    for (let i = 0; i < leaveDates.length; i++) {
      leavesTable.rows.add(
        leaveTypeId,
        leaveDates[i],
        leaveDates[i],
        reason,
        userId,
        new Date().toISOString(),
        1,
        1,
        leaveRequestFor == "half-day" ? 0.5 : 1,
        null,
        null
      );
    }

    //pass table to stored procedure as input
    await pool
      .request()
      .input("tvp", leavesTable)
      .input("ApproverId", sql.Int, approverId)
      .input("CreatedBy", sql.Int, userId)
      .execute("RequestLeave");
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

export const getLeavesByDate = async (startDate, endDate) => {
  try {
    let result = await pool
      .request()
      .input("StartDate", sql.DateTime, startDate)
      .input("EndDate", sql.DateTime, endDate)
      .execute("GetLeavesByDate");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLeavesByMonth = async (createdBy, month) => {
  try {
    let result = await pool
      .request()
      .input("CreatedBy", sql.Int, createdBy)
      .input("Month", sql.Int, month)
      .execute("GetLeavesByMonth");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const approveLeaves = () => {};
