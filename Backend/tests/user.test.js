import request from "supertest";
import app from "../dist/index.js";

describe("User API", () => {
       // Test de création /register
    it("should register user", async () => {
        const res = await request(app)
            .post("api/users/register")
            .send({
                email: "newuser@example.com",  
                password: "secret",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
    });
}); // Fermeture correcte du describe
