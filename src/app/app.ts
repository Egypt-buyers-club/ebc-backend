// import libs
import express from "express";
import { config as dotenv } from "dotenv";

// init dotenv
dotenv();

// import database connection
import { connectToDatabase } from "./database.config";

// import middlewares
import { errorMiddleware, notFoundMiddleware } from "./app.middlewares";

// import routes
import { authRoutes } from "../auth/auth";
import { tokenRoutes } from "../token/token";

// init app
const app = express();

// connect to DB
connectToDatabase();

// use middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use routes
app.use("/api/auth/", authRoutes);
app.use("/api/token/", tokenRoutes);

// handle not found pages
app.use(notFoundMiddleware);

// handle errors
app.use(errorMiddleware);

// listen
app.listen(process.env.PORT, () => console.log("Working"));
