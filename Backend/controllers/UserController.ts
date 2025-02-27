import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.js';
export const Login = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;
}



export const Register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser = req.body;
        
        if (!user.email || !user.password) {
            res.status(400).json({ error: "Email et mot de passe requis" });
            return;
        }

        res.status(201).json({ message: "Utilisateur créé avec succès", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
