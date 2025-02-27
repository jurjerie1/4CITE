import { Model, Document } from 'mongoose';
import { IUser } from '../models/user.js';
import bcrypt from "bcrypt";

 class UserRepository {
    private model: Model<Document & IUser>;

    constructor(model: Model<Document & IUser>) {
        this.model = model;
    }

    createUser(user: IUser): Promise<IUser> {
        return this.model.create(user);
    }
}

export default UserRepository;