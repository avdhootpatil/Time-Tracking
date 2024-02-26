import express from "express";
import {
  deleteHoliday,
  getHolidays,
  getSingleHoliday,
  saveHoliday,
  updateHoliday,
  validateHolidayDetails,
} from "../controllers/holidayController.js";
import { auth } from "../controllers/userController.js";

const holidayRouter = express.Router();

holidayRouter.get("/getholidays", auth, getHolidays);

holidayRouter.get("/getsingleholiday/:id", auth, getSingleHoliday);

holidayRouter.post("/addholiday", auth, validateHolidayDetails, saveHoliday);

holidayRouter.put(
  "/updateholiday/:id",
  auth,
  validateHolidayDetails,
  updateHoliday
);

holidayRouter.put("/deleteholiday/:id", auth, deleteHoliday);

export default holidayRouter;
