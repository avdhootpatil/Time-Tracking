import express from "express";
import { getApprovers } from "../controllers/approverController.js";
import { auth } from "../controllers/userController.js";

const approverRouter = express.Router();

approverRouter.get("/getapprovers", auth, getApprovers);

export default approverRouter;
