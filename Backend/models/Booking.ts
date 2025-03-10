import mongoose from "mongoose";
import type { Document, Schema } from "mongoose";
import { NewBooking } from "./IBooking";

export interface IBooking extends NewBooking, Document { }

const BookingSchema: Schema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    StartDate: {
        type: Date,
        required: true
    },
    EndDate: {
        type: Date,
        required: true
    },
    nbPerson: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);

export { Booking };