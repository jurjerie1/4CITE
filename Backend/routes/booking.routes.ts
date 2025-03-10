import { GetAllBookings, GetAllBookingsByUser } from "controllers/BookingController";
import { Router } from "express";
import { auth } from "middlewares/authentification";

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






export default BookingRoutes;