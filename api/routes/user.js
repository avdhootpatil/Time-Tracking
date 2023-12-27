import express from "express";
import {
  auth,
  checkEmail,
  loginUser,
  registerUser,
  validateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", validateUser, checkEmail, registerUser);

userRouter.post("/login", validateUser, checkEmail, loginUser);

userRouter.post("/check-auth", auth);

export default userRouter;
