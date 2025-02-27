import request from "supertest";
import app from "../dist/index.js";

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
        expect(res.statusCode).toEqual(200);
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
    
}); // Fermeture correcte du describe
