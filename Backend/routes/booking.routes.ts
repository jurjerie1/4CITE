import { CreateBooking, DeleteBooking, GetAllBookings, GetAllBookingsByUser, UpdateBooking } from "../controllers/BookingController";
import { Router } from "express";
import { admin, auth } from "../middlewares/authentification";
import { schemas, validatePost, validatePut } from "../middlewares/validationMiddleware";

const BookingRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Réservations
 *   description: Opérations sur les réservations
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
 *     Booking:
 *       type: object
 *       required:
 *         - user_id
 *         - hotel_id
 *         - date_start
 *         - date_end
 *         - nb_person
 *       properties:
 *         user_id:
 *           type: string
 *           description: ID de l'utilisateur
 *         hotel_id:
 *           type: string
 *           description: ID de l'hôtel
 *         date_start:
 *           type: string
 *           description: Date de début de la réservation
 *         date_end:
 *           type: string
 *           description: Date de fin de la réservation
 *         nb_person:
 *           type: number
 *           description: Nombre de personnes
 */

/**
 * @swagger
 * /api/bookings/users:
 *   get:
 *     summary: Récupérer la liste des réservations
 *     tags: [Réservations]
 *     description: Retourne la liste des réservations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La liste des réservations a été récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       404:
 *         description: La liste des réservations n'a pas été trouvée
 *       401:
 *         description: Non autorisé
 */
BookingRoutes.get("/users", auth, GetAllBookingsByUser);

/**
 * @swagger
 * /api/bookings/{hotelId}:
 *   post:
 *     summary: Ajouter une réservation
 *     tags: [Réservations]
 *     description: Ajoute une réservation pour un hôtel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         description: ID de l'hôtel
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 description: Date de début de la réservation
 *               endDate:
 *                 type: string
 *                 description: Date de fin de la réservation
 *               nbPerson:
 *                 type: number
 *                 description: Nombre de personnes
 *     responses:
 *       201:
 *         description: La réservation a été créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: La réservation chevauche une autre réservation
 *       404:
 *         description: La réservation n'a pas été créée
 *       401:
 *         description: Non autorisé
 */
BookingRoutes.post("/:hotelId", auth, validatePost(schemas.createBooking), CreateBooking);
/**
 * @swagger
 * /api/bookings/GetAllBookings:
 *   get:
 *     summary: Récupérer la liste des réservations
 *     tags: 
 *       - Réservations
 *     description: Retourne la liste de toutes les réservations avec possibilité de filtrer par utilisateur, hôtel et date.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Nombre de réservations à récupérer (pagination).
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Numéro de la page de résultats (pagination, commence à 0).
 *         required: false
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Récupère les réservations après cette date (format YYYY-MM-DD).
 *         required: false
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         description: Nom de l'utilisateur pour filtrer les réservations.
 *         required: false
 *       - in: query
 *         name: userEmail
 *         schema:
 *           type: string
 *           format: email
 *         description: Email de l'utilisateur pour filtrer les réservations.
 *         required: false
 *       - in: query
 *         name: hotelName
 *         schema:
 *           type: string
 *         description: Nom de l'hôtel pour filtrer les réservations.
 *         required: false
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La liste des réservations a été récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Requête invalide (paramètre incorrect).
 *       401:
 *         description: Non autorisé, authentification requise.
 *       404:
 *         description: Aucune réservation trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 */

BookingRoutes.get("/GetAllBookings", auth, admin, GetAllBookings);


/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Mettre à jour une réservation
 *     tags: [Réservations]
 *     description: Met à jour une réservation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 description: Date de début de la réservation
 *               endDate:
 *                 type: string
 *                 description: Date de fin de la réservation
 *               nbPerson:
 *                 type: number
 *                 description: Nombre de personnes
 *     responses:
 *       200:
 *         description: La réservation a été mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: La réservation n'a pas été mise à jour
 *       401:
 *         description: Non autorisé
 */
BookingRoutes.put("/:id", auth, validatePut(schemas.createBooking), UpdateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Réservations]
 *     description: Supprime une réservation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: La réservation a été supprimée avec succès
 *       400:
 *         description: La réservation n'a pas été supprimée
 *       401:
 *         description: Non autorisé
 */
BookingRoutes.delete("/:id", auth, DeleteBooking);

export default BookingRoutes;