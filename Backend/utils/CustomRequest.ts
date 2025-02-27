import {Request} from "express";
import {IDecodedToken} from "../models/IDecodedToken.js";

export interface CustomRequest extends Request {
    userData?: IDecodedToken; // userData est une propriété optionnelle
}