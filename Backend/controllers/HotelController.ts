import { Request, Response, NextFunction } from 'express';
import HotelRepository from 'repositories/hotelRepository.ts';
import { Hotel, IHotel } from '../models/Hotel.ts';

const hotelRepository = new HotelRepository(Hotel);

export const GetAll = async (req: Request, res: Response): Promise<void> => {
    const { limit } = req.query;
    try {
        
        const limitNum = limit ? parseInt(limit as string, 10) : 10;
        
        if (limitNum && limitNum <= 0) {
            res.status(400).json({ error: "La limite doit être supérieure à 0" });
            return;
        }
        
        const hotels = await hotelRepository.getHotels(limitNum);
        res.status(200).json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "Failed to retrieve hotels" });
    }
}