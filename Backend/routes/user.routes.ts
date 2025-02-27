import { Router } from "express";
import { Login, Register } from "../controllers/UserController.js";
import { validatePost, schemas } from "../middlewares/validationMiddleware.js";
const userRoutes = Router();

userRoutes.post("/register", validatePost(schemas.register), Register);
userRoutes.post("/login", validatePost(schemas.login), Login);

export default userRoutes;