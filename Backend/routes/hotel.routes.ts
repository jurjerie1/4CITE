import { Router } from "express";
import { admin, auth, employe } from "../middlewares/authentification.ts";
import { Create, GetAll } from "controllers/HotelController.ts";
import { schemas, validatePost } from "middlewares/validationMiddleware.ts";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const hotelRoutes = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: path.join(__dirname, '../public/uploads') });

/**
 * @swagger
 * tags:
 *   name: Hôtels
 *   description: Opérations sur les hôtels
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: Nom de l'hôtel
 *         location:
 *           type: string
 *           description: Emplacement de l'hôtel
 *         description:
 *           type: string
 *           description: Description de l'hôtel
 *         picture_list:
 *           type: array
 *           items:
 *             type: string
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

/**
 * @swagger
 * /api/hotels:
 *   post:
 *     summary: Créer un nouvel hôtel
 *     tags: [Hôtels]
 *     description: Crée un nouvel hôtel dans la base de données
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'hôtel
 *               location:
 *                 type: string
 *                 description: Emplacement de l'hôtel
 *               description:
 *                 type: string
 *                 description: Description de l'hôtel
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images de l'hôtel
 *     responses:
 *       "201":
 *         description: Hôtel créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 */


hotelRoutes.post("/", auth, admin, upload.array('images'), validatePost(schemas.createHotel), Create);

export default hotelRoutes;