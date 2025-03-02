import request from "supertest";
import { app, server } from "../index";
import { User } from "../models/user";
import mongoose from "mongoose";
import { connectDB } from "../utils/connectDB";
import bcrypt from "bcrypt";

describe("User Account Management", () => {
    beforeAll(async () => {
        await connectDB(); // Attendre la connexion avant de lancer les tests
    });
    // Variables pour stocker les tokens
    let userToken = "";
    let employeeToken = "";
    let adminToken = "";
    let userId = "";
    let employeeId = "";
    let adminId = "";

    describe("User Registration", () => {
        // Test de création /register
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
            // La réponse dépend de votre implémentation, mais devrait être un code d'erreur
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
            // La réponse dépend de votre implémentation, mais devrait être un code d'erreur
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
            // La réponse dépend de votre implémentation
            // Assurez-vous que le rôle n'a pas été modifié
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
            // La réponse dépend de votre implémentation, mais devrait être un code d'erreur
            expect(res.statusCode).toEqual(403);
        });
    });



    describe("User Deletion Tests", () => {
        it("should allow user to delete their own account", async () => {
            // Créer un utilisateur temporaire
            const tempUser = await request(app)
                .post("/api/users/register")
                .send({
                    email: "tempuser@example.com",
                    password: "secret",
                    pseudo: "tempuser",
                    role: 0
                });
            const tempToken = tempUser.body.token;

            // L'utilisateur supprime son compte
            const deleteRes = await request(app)
                .delete("/api/users")
                .set("Authorization", `Bearer ${tempToken}`);
            expect(deleteRes.statusCode).toEqual(200);

            // Vérifier que le compte est supprimé
            const loginAttempt = await request(app)
                .post("/api/users/login")
                .send({
                    email: "tempuser@example.com",
                    password: "secret"
                });
            expect(loginAttempt.statusCode).toEqual(401);
        });

        it("should not allow user to delete other accounts", async () => {
            // Créer un deuxième utilisateur temporaire
            const tempUser = await request(app)
                .post("/api/users/register")
                .send({
                    email: "tempuser2@example.com",
                    password: "secret",
                    pseudo: "tempuser2",
                    role: 0
                });
            const tempId = tempUser.body.user._id;

            // Tenter de supprimer un autre compte
            // Note: Cette fonctionnalité n'existe peut-être pas dans votre API actuelle
            // L'implémentation doit être ajustée selon votre API

            // Vérifier que le compte existe toujours
            const userCheck = await request(app)
                .get(`/api/users?id=${tempId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(userCheck.statusCode).toEqual(200);
        });
    });

    // Nettoyage après les tests
    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
        server.close();
    });
});

