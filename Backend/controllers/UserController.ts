import { Request, Response } from 'express';
import { IUser } from '../models/user.js';
export const Login = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;
}



export const Register = async (req: Request, res: Response) : Promise<void> => {
    const user: IUser = req.body;
}