import request from "supertest";
import { app, server } from "../index";
import { User } from "../models/user";
import mongoose from "mongoose";
import { connectDB } from "../utils/connectDB";
import { Hotel } from "models/Hotel";

describe("User Account Management", () => {
    beforeAll(async () => {
        await connectDB(); 
    });

    afterAll(async () => {
        await Hotel.deleteMany({});
    });
});

