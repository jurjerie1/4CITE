import request from "supertest";
import { app, server } from "../index";
import { User } from "../models/user";
import mongoose from "mongoose";
import { connectDB } from "../utils/connectDB";
import { Hotel } from "../models/Hotel";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Test API", () => {
    beforeAll(async () => {
        await connectDB();
    });


    let userToken = "";
    let employeeToken = "";
    let adminToken = "";
    let userId = "";
    let employeeId = "";
    let adminId = "";
    describe("User's Tests", () => {
        describe("User Registration", () => {
            it("should register regular user", async () => {
                const res = await request(app)
                    .post("/api/users/register")
                    .send({
                        email: "user@example.com",
                        password: "secret",
                        pseudo: "regularuser",
                        role: 0
                    });
                expect(res.statusCode).toEqual(201);
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("user");
                expect(res.body).toHaveProperty("token");
                userToken = res.body.token;
                userId = res.body.user._id;
            });

            it("should register employee user", async () => {
                const res = await request(app)
                    .post("/api/users/register")
                    .send({
                        email: "employee@example.com",
                        password: "secret",
                        pseudo: "employee",
                        role: 1
                    });
                expect(res.statusCode).toEqual(201);
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("user");
                expect(res.body).toHaveProperty("token");
                employeeToken = res.body.token;
                employeeId = res.body.user._id;
            });

            it("should register admin user", async () => {
                const res = await request(app)
                    .post("/api/users/register")
                    .send({
                        email: "admin@example.com",
                        password: "secret",
                        pseudo: "admin",
                        role: 2
                    });
                expect(res.statusCode).toEqual(201);
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("user");
                expect(res.body).toHaveProperty("token");
                adminToken = res.body.token;
                adminId = res.body.user._id;
            });
        });

        describe("User Authentication Tests", () => {
            it("should login as regular user", async () => {
                const res = await request(app)
                    .post("/api/users/login")
                    .send({
                        email: "user@example.com",
                        password: "secret",
                    });
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("token");
                expect(res.body.user).toHaveProperty("role", 0);
                userToken = res.body.token;
            });

            it("should login as employee", async () => {
                const res = await request(app)
                    .post("/api/users/login")
                    .send({
                        email: "employee@example.com",
                        password: "secret",
                    });
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("token");
                expect(res.body.user).toHaveProperty("role", 1);
                employeeToken = res.body.token;
            });

            it("should login as admin", async () => {
                const res = await request(app)
                    .post("/api/users/login")
                    .send({
                        email: "admin@example.com",
                        password: "secret",
                    });
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("token");
                expect(res.body.user).toHaveProperty("role", 2);
                adminToken = res.body.token;
            });
        });

        describe("Permission-based Access Tests", () => {
            it("should allow employee to access user list", async () => {
                const res = await request(app)
                    .get("/api/users/getAll")
                    .set("Authorization", `Bearer ${employeeToken}`);
                expect(res.statusCode).toEqual(200);
                expect(Array.isArray(res.body)).toBe(true);
            });

            it("should allow admin to access user list", async () => {
                const res = await request(app)
                    .get("/api/users/getAll")
                    .set("Authorization", `Bearer ${adminToken}`);
                expect(res.statusCode).toEqual(200);
                expect(Array.isArray(res.body)).toBe(true);
            });

            it("should not allow regular user to access user list", async () => {
                const res = await request(app)
                    .get("/api/users/getAll")
                    .set("Authorization", `Bearer ${userToken}`);
                expect(res.statusCode).not.toEqual(200);
            });
        });

        describe("User Profile Access Tests", () => {
            it("should allow user to access their own profile", async () => {
                const res = await request(app)
                    .get("/api/users")
                    .set("Authorization", `Bearer ${userToken}`);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("_id", userId);
            });

            it("should allow employee to access other user profiles", async () => {
                const res = await request(app)
                    .get(`/api/users/${userId}`)
                    .set("Authorization", `Bearer ${employeeToken}`);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("_id", userId);
            });

            it("should allow admin to access other user profiles", async () => {
                const res = await request(app)
                    .get(`/api/users/${userId}`)
                    .set("Authorization", `Bearer ${adminToken}`);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("_id", userId);
            });

            it("should not allow regular user to access other user profiles", async () => {
                const res = await request(app)
                    .get(`/api/users/${employeeId}`)
                    .set("Authorization", `Bearer ${userToken}`);
                expect(res.statusCode).not.toEqual(200);
            });
        });

        describe("User Modification Tests", () => {
            it("should allow user to update their own profile", async () => {
                const res = await request(app)
                    .put("/api/users")
                    .set("Authorization", `Bearer ${userToken}`)
                    .send({
                        pseudo: "updatedUser"
                    });
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("message", "Utilisateur modifié avec succès");
            });

            it("should allow employee to update their own profile", async () => {
                const res = await request(app)
                    .put("/api/users")
                    .set("Authorization", `Bearer ${employeeToken}`)
                    .send({
                        pseudo: "updatedEmployee"
                    });
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("message", "Utilisateur modifié avec succès");
            });

            it("should allow admin to update their own profile", async () => {
                const res = await request(app)
                    .put("/api/users")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                        pseudo: "updatedAdmin"
                    });
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("message", "Utilisateur modifié avec succès");
            });

            it("should allow admin to update other user profiles", async () => {
                const res = await request(app)
                    .put(`/api/users/${userId}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                        pseudo: "adminModifiedUser"
                    });
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty("message", "Utilisateur modifié avec succès");
            });

            it("should not allow employee to update other user roles", async () => {
                const res = await request(app)
                    .put(`/api/users/${userId}`)
                    .set("Authorization", `Bearer ${employeeToken}`)
                    .send({
                        role: 2
                    });
                const userCheck = await request(app)
                    .get(`/api/users?id=${userId}`)
                    .set("Authorization", `Bearer ${employeeToken}`);
                expect(userCheck.body.role).not.toEqual(2);
            });

            it("should not allow regular user to update other profiles", async () => {
                const res = await request(app)
                    .put(`/api/users/${employeeId}`)
                    .set("Authorization", `Bearer ${userToken}`)
                    .send({
                        pseudo: "attemptToModify"
                    });
                expect(res.statusCode).toEqual(403);
            });
        });



        describe("User Deletion Tests", () => {
            it("should allow user to delete their own account", async () => {
                const tempUser = await request(app)
                    .post("/api/users/register")
                    .send({
                        email: "tempuser@example.com",
                        password: "secret",
                        pseudo: "tempuser",
                        role: 0
                    });
                const tempToken = tempUser.body.token;

                const deleteRes = await request(app)
                    .delete("/api/users")
                    .set("Authorization", `Bearer ${tempToken}`);
                expect(deleteRes.statusCode).toEqual(200);

                const loginAttempt = await request(app)
                    .post("/api/users/login")
                    .send({
                        email: "tempuser@example.com",
                        password: "secret"
                    });
                expect(loginAttempt.statusCode).toEqual(401);
            });

            it("should not allow user to delete other accounts", async () => {
                const tempUser = await request(app)
                    .post("/api/users/register")
                    .send({
                        email: "tempuser2@example.com",
                        password: "secret",
                        pseudo: "tempuser2",
                        role: 0
                    });
                const tempId = tempUser.body.user._id;

                const userCheck = await request(app)
                    .get(`/api/users?id=${tempId}`)
                    .set("Authorization", `Bearer ${adminToken}`);
                expect(userCheck.statusCode).toEqual(200);
            });
        });
    });

    describe("Hotel's Tests", () => {
        var hotelId = "";
        var imageId = "";
        describe("Hotel Creation", () => {

            it("should create a new hotel with multiple images and admin role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .field("name", "Hotel admin multiple images")
                    .field("description", "Hotel description")
                    .field("location", "Paris")
                    .attach("images", path.join(__dirname, "./room1.png"))
                    .attach("images", path.join(__dirname, "./room2.png"))

                expect(res.status).toBe(201);
                expect(res.body[0].name).toBe("Hotel admin multiple images");
                hotelId = res.body[0]._id.toString();
                imageId = res.body[0].picture_list[0]
            });

            it("should create a new hotel with one image and admin role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .field("name", "Hotel admin with one image")
                    .field("description", "Hotel description")
                    .field("location", "Paris")
                    .attach("images", path.join(__dirname, "./room1.png"))

                expect(res.status).toBe(201);
                expect(res.body[0].name).toBe("Hotel admin with one image");
            });

            it("should create a new hotel without image and admin role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .field("name", "Hotel admin without image")
                    .field("description", "Hotel description")
                    .field("location", "Paris")

                expect(res.status).toBe(201);
                expect(res.body[0].name).toBe("Hotel admin without image");
            });



            it("should not create a new hotel with user role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${userToken}`)
                    .send({
                        name: "Hotel user",
                        description: "Hotel description",
                        location: "Paris",
                    });
                expect(res.status).toBe(401);
            });

            it("should not create a new hotel with employee role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${employeeToken}`)
                    .send({
                        name: "Hotel employee",
                        description: "Hotel description",
                        location: "Paris",
                    });
                expect(res.status).toBe(401);
            });

            it("should create a other new hotel without image and admin role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .field("name", "Other Hotel admin")
                    .field("description", "Hotel description")
                    .field("location", "Paris");
                expect(res.status).toBe(201);
                expect(res.body[0].name).toBe("Other Hotel admin");
            });

            it("should create a other  hotel with duplicate name and admin role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .field("name", "Other Hotel admin")
                    .field("description", "Hotel description")
                    .field("location", "Paris");

                expect(res.status).toBe(400);
            });

            it("should create a re other new hotel without image and admin role", async () => {
                const res = await request(app)
                    .post("/api/hotels")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .field("name", "Other 2 Hotel admin")
                    .field("description", "Other 2 Hotel admin")
                    .field("location", "Tours")

                expect(res.status).toBe(201);
                expect(res.body[0].name).toBe("Other 2 Hotel admin");
            });
        });

        describe("Get Hotels", () => {

            it("should get all hotels without authentication", async () => {
                const res = await request(app)
                    .get("/api/hotels")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeLessThanOrEqual(10);
            });
            it("should get all hotels with limit", async () => {
                const res = await request(app)
                    .get("/api/hotels?limit=2")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(2);
            });
            it("should get all hotels with location as Tours", async () => {
                const res = await request(app)
                    .get("/api/hotels?location=Tours")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(1);
            });

            //! A finir 
            it("should get all hotels with date", async () => {
                const res = await request(app)
                    .get("/api/hotels?date=2022-01-01")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(0);
            });

            it("should get all hotels with limit and location", async () => {
                const res = await request(app)
                    .get("/api/hotels?limit=2&location=Paris")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(2);
            });

            it("should get all hotels with limit and date", async () => {
                const res = await request(app)
                    .get("/api/hotels?limit=2&date=2022-01-01")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(0);
            });

            it("should get all hotels with location and date", async () => {
                const res = await request(app)
                    .get("/api/hotels?location=Paris&date=2022-01-01")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(0);
            });

            it("should get all hotels with limit, location and date", async () => {
                const res = await request(app)
                    .get("/api/hotels?limit=2&location=Paris&date=2022-01-01")
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(0);
            });
        });

        describe("Update Hotel", () => {
            it("should update hotel with admin role", async () => {
                const res = await request(app)
                    .put(`/api/hotels/${hotelId}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                        name: "Updated Hotel",
                        description: "Updated description",
                        location: "Tours"
                    });
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message", "Hôtel modifié avec succès");
            });

            it("should not update hotel with user role", async () => {
                const res = await request(app)
                    .put(`/api/hotels/${adminId}`)
                    .set("Authorization", `Bearer ${userToken}`)
                    .send({
                        name: "Updated Hotel",
                        description: "Updated description",
                        location: "Tours"
                    });
                expect(res.status).toBe(401);
            });

            it("should not update hotel with employee role", async () => {
                const res = await request(app)
                    .put(`/api/hotels/${adminId}`)
                    .set("Authorization", `Bearer ${employeeToken}`)
                    .send({
                        name: "Updated Hotel",
                        description: "Updated description",
                        location: "Tours"
                    });
                expect(res.status).toBe(401);
            });

            it("should not update hotel with invalid hotel id", async () => {
                const res = await request(app)
                    .put(`/api/hotels/000000000000000000000000`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                        name: "Updated Hotel",
                        description: "Updated description",
                        location: "Tours"

                    });
                expect(res.status).toBe(404);
                console.log(res.body);
            });

            it("should not update hotel with duplicate name", async () => {
                const res = await request(app)
                    .put(`/api/hotels/${hotelId}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                        name: "Other Hotel admin"
                    });
                expect(res.status).toBe(400);
            });

            it("should add a file to the hotel with admin role", async () => {
                const res = await request(app)
                    .post(`/api/hotels/${hotelId}/upload`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .attach("images", path.join(__dirname, "./room1.png"));


                expect(res.status).toBe(201);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(1);
            });
        });

        describe("Delete Hotel", () => {

            it("should delete file with admin role", async () => {
                console.log(imageId);
                const localImageId = imageId.split("/")[3];
                console.log(localImageId);
                const res = await request(app)
                    .delete(`/api/hotels/${hotelId}/${localImageId}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message", "Fichier supprimé avec succès");
            });

            it("should delete hotel with admin role", async () => {
                const res = await request(app)
                    .delete(`/api/hotels/${hotelId}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message", "Hôtel supprimé avec succès");
            });

            it("should not delete hotel with user role", async () => {
                const res = await request(app)
                    .delete(`/api/hotels/${adminId}`)
                    .set("Authorization", `Bearer ${userToken}`)
                expect(res.status).toBe(401);
            });

            it("should not delete hotel with employee role", async () => {
                const res = await request(app)
                    .delete(`/api/hotels/${adminId}`)
                    .set("Authorization", `Bearer ${employeeToken}`)
                expect(res.status).toBe(401);
            });

            it("should not delete hotel with invalid hotel id", async () => {
                const res = await request(app)
                    .delete(`/api/hotels/000000000000000000000000`)
                    .set("Authorization", `Bearer ${adminToken}`)
                expect(res.status).toBe(404);
            });

        });

    });



    afterAll(async () => {


        await User.deleteMany({});
        await Hotel.deleteMany({});
        await mongoose.connection.close();
        server.close();
    });


});

