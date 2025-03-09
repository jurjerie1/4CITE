import mongoose from "mongoose";
import type { Document, Schema } from "mongoose";
import { NewHotel } from "./IHotel";

export interface IHotel extends NewHotel, Document { }

const HotelSchema: Schema = new mongoose.Schema({
    email: String,
    name: String,
    location: String,
    description: String,
});

const Hotel = mongoose.model<IHotel>("Hotel", HotelSchema);

export { Hotel };