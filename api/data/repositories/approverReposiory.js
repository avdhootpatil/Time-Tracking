import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const getApprovers = async (userId) => {
  try {
    let result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .execute("GetApprovers");

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
