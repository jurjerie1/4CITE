import { IHotel } from "../models/Hotel.ts";
import { Model,Document } from "mongoose";

class HotelRepository {

    private model: Model<Document & IHotel>;

    constructor(model: Model<Document & IHotel>) {
        this.model = model;
    }

    public async getHotels(): Promise<IHotel[]> {
        return await this.model.find();
    }
}

export default HotelRepository;