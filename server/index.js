import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/dbConfig.js";
import authRoutes from "./routes/auth.routes.js";
import productsRouter from "./routes/product.routes.js";
import cors from 'cors';

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: ['http://localhost:8085', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth/', authRoutes)

app.use('/api/products', productsRouter)



app.listen(3000, () => {
    console.log('server started')
})