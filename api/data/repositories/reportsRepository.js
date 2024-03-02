import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const getTimsheet = async (startDate, endDate, userId) => {
  try {
    let result = await pool
      .request()
      .input("StartDate", sql.DateTime, startDate)
      .input("EndDate", sql.DateTime, endDate)
      .input("UserId", sql.Int, userId)
      .execute("GetTimeSheet");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBillingSheet = async (startDate, endDate, userId) => {
  try {
    let result = await pool
      .request()
      .input("StartDate", sql.DateTime, startDate)
      .input("EndDate", sql.DateTime, endDate)
      .input("UserId", sql.Int, userId)
      .execute("GetBillingSheet");

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
