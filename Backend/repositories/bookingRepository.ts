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

    async getAllBookings(limit: number = 10, page: number = 1, date: Date | null, userName: string | null, userEmail: string | null, hotelName: string | null): Promise<IBooking[]> {

        const pipeline: any[] = [];

        pipeline.push(
            { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "userObj" } },
            { $unwind: "$userObj" },
            { $lookup: { from: "hotels", localField: "hotel", foreignField: "_id", as: "hotelObj" } },
            { $unwind: "$hotelObj" }
        );

        const matchConditions: any = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);


            matchConditions.$or = [
                { StartDate: { $gte: startOfDay } }
            ];
        }

        if (userName) {
            matchConditions["userObj.pseudo"] = userName;
        }

        if (userEmail) {
            matchConditions["userObj.email"] = userEmail.trim().toLowerCase();
        }

        if (hotelName) {
            matchConditions["hotelObj.name"] = new RegExp(hotelName.trim(), "i");
        }

        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }

        pipeline.push(
            { $skip: page * limit },
            { $limit: limit }
        );

        pipeline.push({
            $project: {
                _id: 1,
                StartDate: 1,
                EndDate: 1,
                nbPerson: 1,
                createdAt: 1,
                updatedAt: 1,
                user: {
                    _id: "$userObj._id",
                    pseudo: "$userObj.pseudo",
                    email: "$userObj.email"
                },
                hotel: {
                    _id: "$hotelObj._id",
                    name: "$hotelObj.name",
                    location: "$hotelObj.location"
                }
            }
        });

        return await this.model.aggregate(pipeline);
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

    async deleteBooking(id: string): Promise<IBooking | null> {
        return await this.model.findByIdAndDelete(id).populate([
            { path: "user", select: "pseudo email" },
            { path: "hotel", select: "name location" }
        ]);
    }
}

export default BookingRepository;