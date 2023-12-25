import cors from "cors";
import express from "express";
import sql from "mssql";
import { connectToDatabase } from "./controllers/dbController.js";
import clientRouter from "./routes/client.js";
import projectRouter from "./routes/project.js";

const app = express();

app.use(express.json());
app.use(cors());

//connect to database
app.use(connectToDatabase);

//controllers
app.use("/client", clientRouter);
app.use("/project", projectRouter);

app.listen(3001, () => {
  console.log("Server is started on port 3001");
});

process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  app.close(() => {
    console.log("Server is closed.");
    sql.close();
    process.exit(0);
  });
});
