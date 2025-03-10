import { Request, Response, NextFunction } from 'express';
import { Booking } from '../models/Booking';
import { CustomRequest } from 'utils/CustomRequest';
import BookingRepository from '../repositories/bookingRepository.ts';

const bookingRepository = new BookingRepository(Booking);
export const GetAllBookings = async (req: Request, res: Response) => {
    try {
        res.status(200).json("Get All Bookings");
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
        if(await bookingRepository.hasBookingOverlap(hotelId, startDate, endDate)) {
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