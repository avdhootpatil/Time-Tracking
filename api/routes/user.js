import express from "express";
import {
  auth,
  checkEmail,
  getUsers,
  loginUser,
  registerUser,
  validateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", validateUser, checkEmail, registerUser);

userRouter.post("/login", validateUser, checkEmail, loginUser);

userRouter.post("/check-auth", auth);

userRouter.get("/getusers", getUsers);

export default userRouter;
