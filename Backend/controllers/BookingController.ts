import { Request, Response, NextFunction } from 'express';
import { Booking } from '../models/Booking';
import { CustomRequest } from 'utils/CustomRequest';
import BookingRepository from '../repositories/bookingRepository.ts';

const bookingRepository = new BookingRepository(Booking);

export const GetAllBookings = async (req: Request, res: Response) => {
    try {
        const { limit, page, date, userName, userEmail, hotelName } = req.query;

        const parsedLimit = Math.max(1, Number(limit) || 10); // Min 1, valeur par défaut = 10
        const parsedPage = Math.max(0, Number(page) || 0); // Min 0, valeur par défaut = 0 (première page)
        const parsedDate = date ? new Date(date.toString()) : null;

        // Vérifications des valeurs invalides
        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            res.status(400).json({ error: "Le paramètre 'limit' doit être un nombre positif." });
            return;
        }

        if (isNaN(parsedPage) || parsedPage < 0) {
            res.status(400).json({ error: "Le paramètre 'page' doit être un nombre positif ou nul." });
            return;
        }

        if (parsedDate && isNaN(parsedDate.getTime())) {
            res.status(400).json({ error: "Le paramètre 'date' doit être une date valide." });
            return;
        }

        // Récupération des réservations avec les filtres appliqués
        const bookings = await bookingRepository.getAllBookings(
            parsedLimit,
            parsedPage,
            parsedDate,
            userName ? userName.toString().trim() : null,
            userEmail ? userEmail.toString().trim().toLowerCase() : null,
            hotelName ? hotelName.toString().trim() : null
        );

        res.status(200).json(bookings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const GetAllBookingsByUser = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.userData;
        const bookings = await bookingRepository.getBookingsByUser(user.userId);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const CreateBooking = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.userData;
        const hotelId = req.params.hotelId;
        const { startDate, endDate, nbPerson } = req.body;
        if (await bookingRepository.hasBookingOverlap(hotelId, startDate, endDate)) {
            res.status(400).json({ message: "La réservation chevauche une autre réservation" });
            return;
        }
        const newBooking = new Booking({
            hotel: hotelId,
            user: user.userId,
            StartDate: startDate,
            EndDate: endDate,
            nbPerson: nbPerson
        });

        const booking = await bookingRepository.createBooking(newBooking);
        res.status(201).json(booking);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const UpdateBooking = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.userData;
        const id = req.params.id;
        const { startDate, endDate, nbPerson } = req.body;
        const booking = await bookingRepository.getBookingById(id);
        if (!booking) {
            res.status(404).json({ message: "La réservation n'a pas été trouvée" });
            return;
        }

        if (booking.user.toString() !== user.userId && user.role != "2") {
            res.status(401).json({ message: "Vous n'êtes pas autorisé à modifier cette réservation" });
            return;
        }

        booking.StartDate = startDate || booking.StartDate;
        booking.EndDate = endDate || booking.EndDate;
        booking.nbPerson = nbPerson || booking.nbPerson;

        const updatedBooking = await bookingRepository.updateBooking(id, booking);

        res.status(200).json({ message: "La réservation a été mise à jour avec succès", booking: updatedBooking });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
