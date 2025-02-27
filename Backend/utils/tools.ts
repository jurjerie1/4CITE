import { IUser } from "../models/user.js";
import jwt, { SignOptions } from 'jsonwebtoken';

export function generateToken(user: IUser) {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role, // Assuming you have a 'role' property in your IUser interface
    };

    const options: SignOptions = {
        expiresIn: '6h', // Use StringValue type for expiresIn
    };

    return jwt.sign(payload, String(process.env.JWT_KEY), options);
}