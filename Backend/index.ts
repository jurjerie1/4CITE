import express, { Request, Response } from "express";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./utils/connectDB.js";
const app = express();

import dotenv from 'dotenv'
dotenv.config()

app.use(express.json());
connectDB();
app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

app.use('/api/users', userRoutes);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);

export default app;