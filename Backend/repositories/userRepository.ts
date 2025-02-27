import { Model, Document } from 'mongoose';
import { IUser } from '../models/user.js';
import bcrypt from "bcrypt";

 class UserRepository {
    private model: Model<Document & IUser>;

    constructor(model: Model<Document & IUser>) {
        this.model = model;
    }

    async findUserByEmailAndPassword(email: string, password: string): Promise<IUser | null> {
        const user = await this.model.findOne({ email });

        if (user && (await bcrypt.compare(password, String(user.password)))) {
            return user;
        }

        return null;
    }
    
    createUser(user: IUser): Promise<IUser> {
        return this.model.create(user);
    }

    async findUserByEmail(email: String): Promise<IUser | null> {
        return this.model.findOne({email});
    }

    async updateUser(id: string, user: IUser): Promise<IUser | null> {
        return await this.model.findByIdAndUpdate(id, user).lean().exec();
    }

    async getUserById(id: string): Promise<IUser | null> {
        return await this.model.findById(id, "-password").exec();
    }
}

export default UserRepository;