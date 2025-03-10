import { CreateBooking, GetAllBookings, GetAllBookingsByUser } from "../controllers/BookingController";
import { Router } from "express";
import { auth } from "../middlewares/authentification";
import { schemas, validatePost } from "middlewares/validationMiddleware";

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

export default BookingRoutes;