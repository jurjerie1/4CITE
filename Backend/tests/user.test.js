import request from "supertest";
import app from "../dist/index.js";
import { User } from "../dist/models/user.js";

describe("User API", () => {
       // Test de création /register
    it("should register user", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                email: "newuser@example.com",  
                password: "secret",
                pseudo: "newuser",
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("user");
        expect(res.body).toHaveProperty("token");
    });
    // test email valide
    it("should not register user with invalid email", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                email: "newuser",  
                password: "secret",
                pseudo: "newuser",
            });
        expect(res.statusCode).toEqual(400);
    });
    // test email déjà existant
    it("should not register user with existing email", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                email: "newuser@example.com",  
                password: "secret",
                pseudo: "newuser",
            });
        expect(res.statusCode).toEqual(400);
    });
    // test le mot de passe est vide    
    it("should not register user with empty password", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                email: "newuser@example.com",  
                pseudo: "newuser",
            });
        expect(res.statusCode).toEqual(400);
    });
    // test le pseudo est vide
    it("should not register user with empty pseudo", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                email: "newuser@example.com",  
                password: "secret",
            });
        expect(res.statusCode).toEqual(400);
    });

    // Test de connexion /login
    it("should login user", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "newuser@example.com",  
                password: "secret",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("user");
    });
    // test email invalide
    it("should not login user with invalid email", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "newuser",  
                password: "secret",
            });
        expect(res.statusCode).toEqual(400);
    });
    // test email inexistant
    it("should not login user with non-existing email", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "testemailIncorect@fge.com",
                password: "secret",
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("message", "Email ou mot de passe incorrect");
    });


    
    
    // nettoyage après les tests
    afterAll(async () => {
        await User.deleteMany({});
    });
}); // Fermeture correcte du describe
