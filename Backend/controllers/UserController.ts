
import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../models/user.ts';
import UserRepository from '../repositories/userRepository.ts';
import { generateToken } from '../utils/tools.ts';
import bcrypt from "bcrypt";
import { CustomRequest } from '../utils/CustomRequest.ts';

const userRepository = new UserRepository(User);

export const Login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await userRepository.findUserByEmailAndPassword(email, password);
        if (!user) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }

        const token: string = generateToken(user);
        user.password = "";
        res.status(200).json({ message: "Utilisateur connecté avec succès", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const Register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser = req.body;
        let userFound = await userRepository.findUserByEmail(user.email);
        if (userFound !== null) {
            res.status(400).json({ error: "L'email est déjà utilisé" });
            return;
        }
        // Hash the password
        const saltRounds = 10;
        user.password = await bcrypt.hash(String(user.password), saltRounds);

        // ajout du role par défaut (user : 0)
        // commenté pour le dev
        // user.role = 0;
        const newUser: IUser = await userRepository.createUser(user);

        const token: string = generateToken(newUser);

        newUser.password = "";
        res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const UpdateUser = async (req: CustomRequest, res: Response): Promise<void> => {
    const user: IUser = req.body;
    let id: string;
    if (req.userData && req.userData.role > "1" && req.params.id != undefined) {
        id = req.params.id as string;
    } else if (req.params.id === undefined || req.params.id === req.userData.userId) {
        id = req.userData.userId;
    } else {
        res.status(403).json({ error: 'Vous ne pouvez pas modifier cet utilisateur' });
        return;
    }
    const userToUpdate = await userRepository.getUserById(id);
    if (!userToUpdate) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }

    if (req.userData?.role === "0" && id !== req.userData.userId) {
        res.status(403).json({ error: 'Accès refusé' });
        return;
    }

    if (user.email) {
        const emailExists = await userRepository.findUserByEmail(user.email);
        if (emailExists && emailExists._id.toString() !== id) {
            res.status(400).json({ error: 'Email déjà utilisé' });
            return;
        }
    }

    if (user.password) {
        user.password = await bcrypt.hash(String(user.password), 10);
    }
    try {
        const updatedUser = await userRepository.updateUser(id, user);
        if (!updatedUser) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        updatedUser.password = "";
        res.status(200).json({ message: 'Utilisateur modifié avec succès', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const GetAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userRepository.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
    }
};

export const GetUserById = async (req: CustomRequest, res: Response): Promise<void> => {
    let id = req?.params?.id as string;

    if (req.userData && req.userData.role > "0" && req?.params?.id !== undefined) {
        id = req?.params?.id as string;
    } else if (id === undefined && req.userData) {
        id = req.userData.userId;
    } else {
        res.status(403).json({ error: 'Accès refusé' });
        return;
    }
    try {
        const user = await userRepository.getUserById(id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur serveur' });
    }
};

export const DeleteUser = async (req: CustomRequest, res: Response): Promise<void> => {
    let id = req.userData?.userId as string;
    const user = await userRepository.getUserById(id);
    if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    try {
        const user = await userRepository.deleteUser(id);
        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Erreur serveur" });
    }
};
