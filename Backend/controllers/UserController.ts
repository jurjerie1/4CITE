import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../models/user.js';
import UserRepository from '../repositories/userRepository.js';
import bcrypt from "bcrypt";

const userRepository = new UserRepository(User);

export const Login = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;
}



export const Register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser = req.body;
        let userFound = await userRepository.findUserByEmail(user.email);
        console.log("userFound");
        console.log(userFound);
        if (userFound !== null) {
            res.status(400).json({ error: "L'email est déjà utilisé" });
            return;
        }
        // Hash the password
        const saltRounds = 10;
        user.password = await bcrypt.hash(String(user.password), saltRounds);

        // ajout du role par défaut (user : 0)
        user.role = 0;
        const newUser: IUser = await userRepository.createUser(user);

        res.status(201).json({ message: "Utilisateur créé avec succès", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
