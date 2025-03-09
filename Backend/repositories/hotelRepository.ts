import { IHotel } from "../models/Hotel.ts";
import { Model, Document } from "mongoose";

class HotelRepository {

    private model: Model<Document & IHotel>;

    constructor(model: Model<Document & IHotel>) {
        this.model = model;
    }

    public async getHotels(limit: number = 10, location: string = "", dateStr: string | null = null): Promise<IHotel[]> {
        var query: any = {};
        if (location) {
            query.location = location;
        }
        if (dateStr) {
            const date = new Date(dateStr);
            query.date = date;
        }
    
        return await this.model.find(query).limit(limit);
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
}

export default HotelRepository;