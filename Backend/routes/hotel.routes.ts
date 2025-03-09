import { Router } from "express";
import { admin, auth, employe } from "../middlewares/authentification.ts";
import { Create, DeleteFile, DeleteHotel, GetAll, GetHotelById, UpdateHotel, UploadFileForHotel } from "../controllers/HotelController.ts";
import { schemas, validatePost } from "../middlewares/validationMiddleware.ts";
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
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de disponibilité
 *         required: false
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Emplacement de l'hôtel
 *         required: false
 *     security: []
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
hotelRoutes.get("/", GetAll);

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


/**
 * @swagger
 * /api/hotels/{id}/upload:
 *   post:
 *     summary: Ajouter des images à un hôtel
 *     tags: [Hôtels]
 *     description: Ajoute des images à un hôtel existant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'hôtel
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images à ajouter
 *     responses:
 *       "201":
 *         description: Images ajoutées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uri
 *                 description: URL des images ajoutées
 *       "400":
 *         description: Paramètre de requête invalide
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Hôtel non trouvé
 *       "500":
 *         description: Erreur serveur interne
 */
hotelRoutes.post("/:id/upload", auth, admin, upload.array('images'), UploadFileForHotel);

/**
 * @swagger
 * /api/hotels/{id}:
 *   delete:
 *     summary: Supprimer un hôtel
 *     tags: [Hôtels]
 *     description: Supprime un hôtel existant de la base de données
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'hôtel
 *     responses:
 *       "200":
 *         description: Hôtel supprimé avec succès
 *       "400":
 *         description: Paramètre de requête invalide
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Hôtel non trouvé
 *       "500":
 *         description: Erreur serveur interne
 */
hotelRoutes.delete("/:id", auth, admin, DeleteHotel);

/**
 * @swagger
 * /api/hotels/{hotelId}/{fileId}:
 *   delete:
 *     summary: Supprimer un fichier d'un hôtel
 *     tags: [Hôtels]
 *     description: Supprime un fichier d'un hôtel existant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'hôtel
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du fichier
 *     responses:
 *       "200":
 *         description: Fichier supprimé avec succès
 *       "400":
 *         description: Paramètre de requête invalide
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Fichier non trouvé
 *       "500":
 *         description: Erreur serveur interne
 */
hotelRoutes.delete("/:hotelId/:fileId", auth, admin, DeleteFile);


/**
 * @swagger
 * /api/hotels/{id}:
 *   put:
 *     summary: Mettre à jour un hôtel
 *     tags: [Hôtels]
 *     description: Met à jour un hôtel existant dans la base de données
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'hôtel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       "200":
 *         description: Hôtel mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       "400":
 *         description: Paramètre de requête invalide
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Hôtel non trouvé
 *       "500":
 *         description: Erreur serveur interne
 */
hotelRoutes.put("/:id", auth, admin, validatePost(schemas.createHotel), UpdateHotel);


/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Récupérer un hôtel
 *     tags: [Hôtels]
 *     description: Retourne un hôtel en fonction de son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'hôtel
 *     security: []
 *     responses:
 *       "200":
 *         description: Hôtel trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       "400":
 *         description: Paramètre de requête invalide
 *       "404":
 *         description: Hôtel non trouvé
 *       "500":
 *         description: Erreur serveur interne
 */
hotelRoutes.get("/:id",  GetHotelById);
export default hotelRoutes;