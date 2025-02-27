import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (request: Request, response: Response) => { 
    response.status(200).send("Hello World");
  }); 

app.get("/api/users/register", (request: Request, response: Response) => {
    response.status(200).send("Register");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);

export default app;