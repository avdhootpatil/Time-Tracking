import sql from "mssql";
import { dbConfig } from "../config/dbConfig.js";

export const connectToDatabase = async (req, res, next) => {
  try {
    //connect to the database
    var pool = await sql.connect(dbConfig);
    console.log("Database connected");

    //attach connection pool to the request
    req.db = pool;

    next();
  } catch (err) {
    // Handle database connection error
    console.error("Error connecting to the database", err);
    res.status(500).json({ error: "Error connecting to the databse" });
  }
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
