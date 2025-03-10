import { Booking } from "../models/Booking.ts";
import { IHotel } from "../models/Hotel.ts";
import { Model, Document } from "mongoose";

class HotelRepository {

    private model: Model<Document & IHotel>;

    constructor(model: Model<Document & IHotel>) {
        this.model = model;
    }

    public async getHotels(limit: number = 10, page: number = 0, location: string = "", startDate: string | null = null, endDate: string | null = null): Promise<IHotel[]> {
        const query: any = {};
    if (location) {
        query.location = location;
    }

    if (!startDate && !endDate) {
        return await this.model.find(query).limit(limit).skip(limit * page);
    }

    let start = startDate ? new Date(startDate) : null;
    let end = endDate ? new Date(endDate) : null;

    if (start && !end) {
        end = new Date(start);
        end.setDate(end.getDate() + 3);
    }
    
    if (!start && end) {
        start = new Date(end);
        start.setDate(start.getDate() - 3);
    }

    const bookingsInRange = await Booking.find({
        $and: [
            { StartDate: { $lt: end } },
            { EndDate: { $gt: start } }
        ]
    }).distinct('hotel');

    if (bookingsInRange.length > 0) {
        query._id = { $nin: bookingsInRange };
    }

    return await this.model.find(query).limit(limit).skip(limit * page);
    }


    public async createHotel(hotel: IHotel): Promise<IHotel> {
        return await this.model.create(hotel);
    }

    public async findHotelByName(name: string): Promise<IHotel | null> {
        return await this.model.findOne({ name: name });
    }

    public async findHotelById(id: string): Promise<IHotel | null> {
        return await this.model.findById(id);
    }

    public async updateHotel(id: string, hotel: IHotel): Promise<IHotel | null> {
        return await this.model.findByIdAndUpdate
            (id, hotel, { new: true });
    }

    public async deleteHotel(id: string): Promise<IHotel | null> {
        return await this.model.findByIdAndDelete(id);
    }

    public async getHotelById(id: string): Promise<IHotel | null> {
        return await this.model.findById(id);
    }
}

export default HotelRepository;