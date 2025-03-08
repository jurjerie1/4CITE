import { Router } from "express";
import { admin, auth, employe } from "../middlewares/authentification.ts";
import { GetAll } from "controllers/HotelController.ts";

const hotelRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Hôtels
 *   description: Opérations sur les hôtels
 */


hotelRoutes.get("/", auth, GetAll);


export default hotelRoutes;