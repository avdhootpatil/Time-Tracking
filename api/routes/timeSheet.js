import express from "express";
import {
  addTimeEntry,
  deleteTimeEntry,
  getTimeEntryById,
  getTimeSheetDetailsyUserId,
  updateTimeEntry,
  validateTimeEntry,
} from "../controllers/timeSheetController.js";

const timeSheetRouter = express.Router();

timeSheetRouter.post(
  "/gettimesheetdetailsbyuserid",
  getTimeSheetDetailsyUserId
);

timeSheetRouter.get("/gettimeentrybyid/:id", getTimeEntryById);

timeSheetRouter.post("/deletetimeentry/:id", deleteTimeEntry);

timeSheetRouter.post("/addtimeentry", validateTimeEntry, addTimeEntry);

timeSheetRouter.put("/updatetimeentry/:id", validateTimeEntry, updateTimeEntry);

export default timeSheetRouter;
