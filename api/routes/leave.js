import express from "express";
import {
  approveLeaves,
  getAllLeaves,
  getLeaveBalance,
  getLeaveById,
  getLeaveTypes,
  requestLeave,
  updateLeave,
  withDraw,
} from "../controllers/leaveController.js";
import { auth } from "../controllers/userController.js";

const leaveRouter = express.Router();

leaveRouter.post("/requestleave", auth, requestLeave);

leaveRouter.put("/updateleaveapplication/:id", auth, updateLeave);

leaveRouter.put("/withdrawleaveapplication/:id", auth, withDraw);

leaveRouter.get("/getallleaves", auth, getAllLeaves);

leaveRouter.get("/getleavetypes", auth, getLeaveTypes);

leaveRouter.get("/getleavebyid/:id", auth, getLeaveById);

leaveRouter.post("/approveleave", auth, approveLeaves);

leaveRouter.get("/getleavebalance", auth, getLeaveBalance);

export default leaveRouter;
