import { Router } from "express";
import { Login, Register, UpdateUser, GetAllUsers, GetUserById } from "../controllers/UserController.ts";
import { validatePost, schemas, validatePut } from "../middlewares/validationMiddleware.ts";
import { admin, auth } from "../middlewares/authentification.ts";
const userRoutes = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec un email, un pseudo et un mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 pseudo:
 *                   type: string
 *                   example: "johndoe"
 *                 role:
 *                   type: number
 *                   example: 0
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Requête invalide
 */
userRoutes.post("/register", validatePost(schemas.register), Register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     description: Authentifie un utilisateur avec son email et son mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Utilisateur authentifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Identifiants invalides
 */
userRoutes.post("/login", validatePost(schemas.login), Login);

userRoutes.put("/:id?", auth, validatePut(schemas.updateUser), UpdateUser);

/**
 * @swagger
 * /api/users/getAll:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     description: Retourne la liste des utilisateurs enregistrés.
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 */
userRoutes.get("/getAll", auth, admin, GetAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     description: Retourne les informations d'un utilisateur spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: number
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       404:
 *         description: Utilisateur non trouvé
 */
userRoutes.get("/:id?", auth, GetUserById);

export default userRoutes;