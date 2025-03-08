import { Request, Response, NextFunction } from 'express';
import HotelRepository from 'repositories/hotelRepository.ts';
import { Hotel, IHotel } from '../models/Hotel.ts';

const hotelRepository = new HotelRepository(Hotel);

export const GetAll = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(hotelRepository.getHotels());

}