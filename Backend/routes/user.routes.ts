import { Router } from "express";
import { Register } from "../controllers/UserController.js";
import { validatePost, schemas } from "../middlewares/validationMiddleware.js";
const userRoutes = Router();

userRoutes.post("/register", validatePost(schemas.register), Register);

export default userRoutes;