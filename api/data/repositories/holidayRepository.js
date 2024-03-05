import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const getHolidays = async (year) => {
  try {
    let result = await pool
      .request()
      .input("Year", sql.Int, year)
      .execute("GetAllYearlyHolidays");
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSingleHoliday = async (id) => {
  try {
    let result = await pool.request().input("ID", sql.Int, id).query(`
    SELECT HolidayId, Description, Date FROM Holidays
    WHERE
        IsActive=1
    AND
        HolidayId=@ID
    `);

    return result.recordset[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveHoliday = async (date, description, userId) => {
  try {
    await pool
      .request()
      .input("Date", sql.DateTime, date)
      .input("Description", sql.VarChar, description)
      .input("CreatedBy", sql.Int, userId)
      .execute("AddHoliday");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateHoliday = async (holidayId, description, userId) => {
  try {
    await pool
      .request()
      .input("HolidayId", sql.Int, holidayId)
      .input("Description", sql.VarChar(200), description)
      .input("UserId", sql.Int, userId)
      .execute("UpdateHolidayDetails");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteHoliday = async (holidayId, userId) => {
  try {
    await pool
      .request()
      .input("HolidayId", sql.Int, holidayId)
      .input("UserId", sql.Int, userId)
      .execute("DeleteHoliday");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
