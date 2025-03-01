import { Router } from "express";
import { Login, Register, UpdateUser, GetAllUsers, GetUserById, DeleteUser } from "../controllers/UserController.ts";
import { validatePost, schemas, validatePut } from "../middlewares/validationMiddleware.ts";
import { admin, auth } from "../middlewares/authentification.ts";
const userRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: API pour la gestion des utilisateurs
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
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - pseudo
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Email unique de l'utilisateur
 *         pseudo:
 *           type: string
 *           description: Pseudonyme de l'utilisateur
 *         password:
 *           type: string
 *           description: Mot de passe de l'utilisateur (haché en base de données)
 *         role:
 *           type: number
 *           description: Rôle de l'utilisateur (0=utilisateur, 1=employé, 2=administrateur)
 *           default: 0
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     description: Crée un nouvel utilisateur avec un email, un pseudo et un mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT pour l'authentification
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Données invalides ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "L'email est déjà utilisé"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur serveur"
 */
userRoutes.post("/register", validatePost(schemas.register), Register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     tags: [Utilisateurs]
 *     description: Authentifie un utilisateur avec son email et son mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur authentifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur connecté avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT pour l'authentification
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Email ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email ou mot de passe incorrect"
 *       500:
 *         description: Erreur serveur
 */
userRoutes.post("/login", validatePost(schemas.login), Login);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Utilisateurs]
 *     description: Met à jour les informations d'un utilisateur existant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à mettre à jour (optionnel, utilise l'ID de l'utilisateur authentifié par défaut)
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               pseudo:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: number
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur modifié avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
userRoutes.put("/:id?", auth, validatePut(schemas.updateUser), UpdateUser);

/**
 * @swagger
 * /api/users/getAll:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     description: Retourne la liste de tous les utilisateurs (réservé aux administrateurs)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (non admin)
 *       500:
 *         description: Erreur serveur
 */
userRoutes.get("/getAll", auth, admin, GetAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     description: Retourne les informations d'un utilisateur spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à récupérer (optionnel, utilise l'ID de l'utilisateur authentifié par défaut)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
userRoutes.get("/:id?", auth, GetUserById);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     description: Supprime l'utilisateur actuellement authentifié
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
userRoutes.delete("/", auth, DeleteUser);

export default userRoutes;