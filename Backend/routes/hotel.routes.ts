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

/**
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: Récupérer la liste des hôtels
 *     tags: [Hôtels]
 *     description: Retourne la liste de tous les hôtels
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Nombre maximum d'hôtels à retourner (10 par défaut)
 *         required: false
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Liste des hôtels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       "400":
 *         description: Paramètre de requête invalide
 *       "401":
 *         description: Non autorisé
 *       "500":
 *         description: Erreur serveur interne
 */
hotelRoutes.get("/", auth, GetAll);

export default hotelRoutes;