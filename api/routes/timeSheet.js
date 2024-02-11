import express from "express";
import {
  addTimeEntry,
  dailyHoursLogged,
  deleteTimeEntry,
  getTimeSheetDetailsyUserId,
  gettasksbydate,
  updateTimeEntry,
} from "../controllers/timeSheetController.js";
import { auth } from "../controllers/userController.js";

const timeSheetRouter = express.Router();

timeSheetRouter.post(
  "/gettimesheetdetailsbyuserid",
  auth,
  getTimeSheetDetailsyUserId
);

timeSheetRouter.get("/gettasksbydate", auth, gettasksbydate);

timeSheetRouter.post("/deletetask/:id", auth, deleteTimeEntry);

timeSheetRouter.post(
  "/addtimeentry",
  auth,
  //  validateTimeEntry,
  addTimeEntry
);

timeSheetRouter.get("/gethourslogged", auth, dailyHoursLogged);

timeSheetRouter.put(
  "/updatetimeentry/:id",
  auth,
  // validateTimeEntry,
  updateTimeEntry
);

export default timeSheetRouter;
