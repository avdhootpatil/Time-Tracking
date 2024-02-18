import express from "express";
import {
  exportBillingSheet,
  exportTimesheet,
  getBillingSheet,
  getTimsheet,
} from "../controllers/reportsController.js";
import { auth } from "../controllers/userController.js";

const reportsRouter = express.Router();

reportsRouter.get("/gettimesheet", auth, getTimsheet);

reportsRouter.get("/exporttimesheet", auth, exportTimesheet);

reportsRouter.get("/billingsheet", auth, getBillingSheet);

reportsRouter.get("/exportbillingsheet", auth, exportBillingSheet);

export default reportsRouter;
