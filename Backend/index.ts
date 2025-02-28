import express, { Request, Response } from "express";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./utils/connectDB.js";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { setupSwagger } from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();
app.use('/api/users', userRoutes);

setupSwagger(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});