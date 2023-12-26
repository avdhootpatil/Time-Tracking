import sql from "mssql";
import { dbConfig } from "../config/dbConfig.js";

export const pool = new sql.ConnectionPool(dbConfig);

export const connectToDatabase = (pool) => {
  return async (req, res, next) => {
    try {
      await pool.connect();
      console.log("Connected to the database");

      req.db = pool;

      next();
    } catch (err) {
      console.log("Error connecting to the database", err);
      res.status(500).json({ error: "Error connecting to the databse" });
    }
  };
};

export const closeDatabaseConnection = async (pool) => {
  try {
    await pool.close();
    console.log("Connection to the database closed");
  } catch (err) {
    console.error("Error closing database connection", err);
    throw err;
  }
};
