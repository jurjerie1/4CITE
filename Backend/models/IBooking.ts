import { Hotel } from "./IHotel"
import { User } from "./IUser"

export interface NewBooking {
    hotel : Hotel,
    user: User,
    StartDate: Date,
    EndDate: Date,
    nbPerson: Number,
}

export interface Booking extends NewBooking {
    _id: string
}