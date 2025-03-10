import { Request, Response, NextFunction } from 'express';
import { Booking } from 'models/Booking';
import { CustomRequest } from 'utils/CustomRequest';
import BookingRepository  from '../repositories/bookingRepository.ts';

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
        console.log(user);
        const bookings = await bookingRepository.getBookingsByUser(user.userId);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}