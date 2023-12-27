import express from "express";
import {
  addTimeEntry,
  deleteTimeEntry,
  getTimeEntryById,
  getTimeSheetDetailsyUserId,
  updateTimeEntry,
  validateTimeEntry,
} from "../controllers/timeSheetController.js";
import { auth } from "../controllers/userController.js";

const timeSheetRouter = express.Router();

timeSheetRouter.post(
  "/gettimesheetdetailsbyuserid",
  getTimeSheetDetailsyUserId
);

timeSheetRouter.get("/gettimeentrybyid/:id", auth, getTimeEntryById);

timeSheetRouter.post("/deletetimeentry/:id", auth, deleteTimeEntry);

timeSheetRouter.post("/addtimeentry", auth, validateTimeEntry, addTimeEntry);

timeSheetRouter.put(
  "/updatetimeentry/:id",
  auth,
  validateTimeEntry,
  updateTimeEntry
);

export default timeSheetRouter;
