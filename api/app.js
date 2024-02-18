import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDatabase, pool } from "./controllers/dbController.js";
import clientRouter from "./routes/client.js";
import projectRouter from "./routes/project.js";
import reportsRouter from "./routes/reports.js";
import timeSheetRouter from "./routes/timeSheet.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

//connect to database
app.use(connectToDatabase(pool));

//controllers
app.use("/client", clientRouter);
app.use("/project", projectRouter);
app.use("/timesheet", timeSheetRouter);
app.use("/user", userRouter);
app.use("/reports", reportsRouter);

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
