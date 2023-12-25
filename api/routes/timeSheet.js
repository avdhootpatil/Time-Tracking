import express from "express";
import {
  addTimeEntry,
  deleteTimeEntry,
  getTimeEntryById,
  getTimeSheetDetailsyUserId,
  updateTimeEntry,
} from "../controllers/timeSheetController.js";

const timeSheetRouter = express.Router();

timeSheetRouter.post(
  "/gettimesheetdetailsbyuserid",
  getTimeSheetDetailsyUserId
);

timeSheetRouter.get("/gettimeentrybyid/:id", getTimeEntryById);

timeSheetRouter.post("/deletetimeentry/:id", deleteTimeEntry);

timeSheetRouter.post("/addtimeentry", addTimeEntry);

timeSheetRouter.put("/updatetimeentry/:id", updateTimeEntry);

export default timeSheetRouter;
