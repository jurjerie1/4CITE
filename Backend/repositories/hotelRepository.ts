import { IHotel } from "../models/Hotel.ts";
import { Model, Document } from "mongoose";

class HotelRepository {

    private model: Model<Document & IHotel>;

    constructor(model: Model<Document & IHotel>) {
        this.model = model;
    }

    public async getHotels(limit: number = 10): Promise<IHotel[]> {
        return await this.model.find().limit(limit);
    }

    public async createHotel(hotel: IHotel): Promise<IHotel> {
        return await this.model.create(hotel);
    }

    public async findHotelByName(name: string): Promise<IHotel | null> {
        return await this.model.findOne({ name: name });
    }
}

export default HotelRepository;