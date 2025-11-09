import express from "express";
import { connectionDB } from "./config/connectDB";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoute";
import campaignRoutes from "./routes/campaignRoutes";
import productRoutes from "./routes/productRoutes";
import purchaseRoutes from "./routes/purchasesRoutes";
import storeRoutes from "./routes/storeRoute";
import ubicacionRoutes from "./routes/ubicacionRoutes";

const app =  express();

// Habilita las variables de entorno
dotenv.config();

// Conecta con la BD
connectionDB();

// Habilita la entrada de datos en formato JSON
app.use(express.json());

// configura el router
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/campaign", campaignRoutes);
app.use("/product", productRoutes)
app.use("/purchase", purchaseRoutes);
app.use("/store", storeRoutes);
app.use("/ubicacion", ubicacionRoutes);

export default app;