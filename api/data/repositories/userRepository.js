import sql from "mssql";
import { getPool } from "../../config/dbConfig.js";

const pool = getPool();

export const checkEmail = async (userEmail) => {
  try {
    let result = await pool.request().input("UserEmail", sql.VarChar, userEmail)
      .query(`
        SELECT *
        FROM USERS
        WHERE UserEmail = @UserEmail;
    `);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerUser = async (userName, userEmail, hashedPassword) => {
  try {
    await pool
      .request()
      .input("userName", sql.VarChar, userName)
      .input("UserEmail", sql.VarChar, userEmail)
      .input("Password", sql.VarChar, hashedPassword).query(`
        INSERT INTO USERS
        (UserName, 
          UserEmail, 
          UserPassword, 
          IsActive)
          VALUES
          (@UserName, 
              @UserEmail,
              @Password,
              1)`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    let result = await pool.query(
      `SELECT UserId as id, UserName as name, UserEmail as email FROM Users ORDER BY UserId ASC`
    );
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
