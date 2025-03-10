import { IBooking } from "models/Booking";
import { Model, Document } from "mongoose";

class BookingRepository {

    private model: Model<Document & IBooking>;

    constructor(model: Model<Document & IBooking>) {
        this.model = model;
    }

    async getBookingsByUser(userId: string): Promise<IBooking[]> {
        return await this.model.find({ user: userId });
    }
}


export default BookingRepository;