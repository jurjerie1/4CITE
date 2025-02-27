import mongoose from "mongoose";
import type { Document, Schema } from "mongoose";
import type { NewUser } from "./IUser";

export interface IUser extends NewUser, Document {}

const UserSchema: Schema = new mongoose.Schema({
    email: String,
    pseudo: String,
    password: String,
    role: Number,

});
const User = mongoose.model<IUser>("User", UserSchema);

export { User };