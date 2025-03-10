import { IBooking } from "models/Booking";
import { Model, Document } from "mongoose";

class BookingRepository {

    private model: Model<Document & IBooking>;

    constructor(model: Model<Document & IBooking>) {
        this.model = model;
    }

    async getBookingsByUser(userId: string): Promise<IBooking[]> {
        return await this.model.find({ user: userId }).populate([
            { path: "user", select: "pseudo email" },
            { path: "hotel", select: "name location" }
        ]);
    }

    async hasBookingOverlap(hotelId: string, startDate: Date, endDate: Date): Promise<boolean> {
        const overlappingBooking = await this.model.findOne({
            hotel: hotelId,
            $and: [
                { StartDate: { $lte: endDate } },
                { EndDate: { $gte: startDate } }
            ]
        });

        return overlappingBooking !== null;
    }

    async createBooking(booking: Omit<IBooking, "_id" | "createdAt" | "updatedAt">): Promise<IBooking> {
        const newBooking = await this.model.create(booking);
        return await newBooking.populate([
            { path: "user", select: "pseudo email" },
            { path: "hotel", select: "name location" }
        ]);
    }

    async getAllBookings(): Promise<IBooking[]> {
        return await this.model.find().populate([
            { path: "user", select: "pseudo email" },
            { path: "hotel", select: "name location" }
        ]);
    }

    async getBookingById(id: string): Promise<IBooking | null> {
        return await this.model.findById(id).populate([
            { path: "user", select: "pseudo email" },
            { path: "hotel", select: "name location" }
        ]);
    }

    async updateBooking(id: string, booking: Partial<IBooking>): Promise<IBooking | null> {
        return await this.model.findByIdAndUpdate
        (id, booking, { new: true }).populate([
            { path: "user", select: "pseudo email" },
            { path: "hotel", select: "name location" }
        ]);
    }

}

export default BookingRepository;