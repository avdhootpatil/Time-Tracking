import express from "express";
import {
  checkEmail,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", checkEmail, registerUser);

userRouter.post("/login", checkEmail, loginUser);

export default userRouter;
