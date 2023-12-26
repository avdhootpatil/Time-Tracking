import express from "express";
import {
  auth,
  checkEmail,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", checkEmail, registerUser);

userRouter.post("/login", checkEmail, loginUser);

userRouter.post("/check-auth", auth);

export default userRouter;
