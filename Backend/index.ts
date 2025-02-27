import express, { Request, Response } from "express";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./utils/connectDB.js";
import cors from 'cors';
const app = express();

import dotenv from 'dotenv'
dotenv.config()
app.use(cors());
app.use(express.json());
connectDB();


app.use('/api/users', userRoutes);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);

export default app;