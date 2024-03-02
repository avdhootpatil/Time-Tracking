import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import clientRouter from "./routes/client.js";
import holidayRouter from "./routes/holiday.js";
import projectRouter from "./routes/project.js";
import reportsRouter from "./routes/reports.js";
import timeSheetRouter from "./routes/timeSheet.js";
import userRouter from "./routes/user.js";
import { connectToDatabase, pool } from "./config/dbConfig.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

//connect to database
app.use(connectToDatabase(pool));

//routes
app.use("/client", clientRouter);
app.use("/project", projectRouter);
app.use("/timesheet", timeSheetRouter);
app.use("/user", userRouter);
app.use("/reports", reportsRouter);
app.use("/holidays", holidayRouter);

let port = process.env.API_PORT || 3001;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is started on port ${port}`);
});

process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  app.close(() => {
    console.log("Server is closed.");
    closeDatabaseConnection(pool);
    process.exit(0);
  });
});
