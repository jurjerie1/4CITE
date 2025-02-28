import { Request, Response, NextFunction } from 'express';
import { IDecodedToken } from '../models/IDecodedToken.ts';
import jwt from 'jsonwebtoken';
import {CustomRequest} from "../utils/CustomRequest.ts";



export const auth = (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            throw new Error('Authorization header missing');
        }

        const token = authorizationHeader.split(' ')[1];
        const decodedToken: IDecodedToken = jwt.verify(token, String(process.env.JWT_KEY)) as IDecodedToken;
        console.log(decodedToken);
        if (!decodedToken || !decodedToken.userId) {
            throw new Error('Invalid token');
        }
        // Attach the decoded user information to the request object
        req.userData = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export const employe = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const userRole = Number(req.userData?.role);

    if (!isNaN(userRole) && userRole > 0) {
        next();
    } else {
        res.status(401).json({ message: 'Only access for authorized people' });
    }
};

export const admin = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const userRole = Number(req.userData?.role);

    if (!isNaN(userRole) && userRole > 1) {
        next();
    } else {
        res.status(401).json({ message: 'Only access for authorized people' });
    }
};