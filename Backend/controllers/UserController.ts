import { Request, Response } from 'express';

export const Login = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;
    
}