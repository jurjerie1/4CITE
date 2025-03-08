import { Request, Response, NextFunction } from 'express';

export const GetAll = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: 'Hello World' });

}