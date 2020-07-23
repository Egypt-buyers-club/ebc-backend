// import libs
import express from "express";
import { config as dotenv } from "dotenv";

// init dotenv
dotenv();

// import database connection
import { connectToDatabase } from "./database.config";

// import middlewares
import errorMiddleware from "./app.middlewares";

// import routes
import authRoutes from "../users/users";

// init app
const app = express();

// use middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to DB
connectToDatabase();

// use routes
app.use("/api/users/", authRoutes);

// handle errors
app.use(errorMiddleware);

// listen
app.listen(process.env.PORT, () => console.log("Working"));
