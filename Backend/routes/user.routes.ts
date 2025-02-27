import { Router } from "express";
import { Register } from "../controllers/UserController.js";
const userRoutes = Router();

userRoutes.post("/register", Register);

export default userRoutes;