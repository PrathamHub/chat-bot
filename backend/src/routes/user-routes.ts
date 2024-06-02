import { Router } from "express";
import {
  getAllUser,
  signUp,
  userLogin,
  userLogout,
  verifyUser,
} from "../controllers/user-controller.js";
import { signUpValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRouter = Router();

userRouter.get("/", getAllUser);
userRouter.post("/login", userLogin);
userRouter.post("/signup", validate(signUpValidator), signUp);
userRouter.get("/auth-status", verifyToken, verifyUser);
userRouter.get("/logout", verifyToken, userLogout);
export default userRouter;
