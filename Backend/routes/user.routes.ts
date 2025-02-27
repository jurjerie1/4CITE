import { Router } from "express";
import { Login, Register, UpdateUser, GetAllUsers } from "../controllers/UserController.js";
import { validatePost, schemas, validatePut } from "../middlewares/validationMiddleware.js";
import { admin, auth } from "../middlewares/authentification.js";
const userRoutes = Router();

userRoutes.post("/register", validatePost(schemas.register), Register);
userRoutes.post("/login", validatePost(schemas.login), Login);
userRoutes.put("/:id?", auth, validatePut(schemas.updateUser), UpdateUser);
userRoutes.get("/", auth, admin, GetAllUsers);
export default userRoutes;