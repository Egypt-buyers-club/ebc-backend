// import libs
import express, { Request, Response } from "express";
import cors from "cors";
import { config as dotenv } from "dotenv";

// init dotenv
dotenv();

// import database connection
import { connectToDatabase } from "./config/database.config";

// import middlewares
import {
	errorMiddleware,
	notFoundMiddleware
} from "./middlewares/error.middleware";

// import routes
import { authRoutes } from "./routes/auth.route";
import { tokenRoutes } from "./routes/token.route";

// init app
const app = express();

// use cors
app.use(cors());

// connect to DB
connectToDatabase();

// use middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use routes
app.use("/api/auth/", authRoutes);
app.use("/api/token/", tokenRoutes);

// serve docs
app.use(express.static(__dirname + "/docs/"));
app.get("/", (req: Request, res: Response) => {
	res.status(200).sendFile(__dirname + "/docs/index.html");
});

// handle not found pages
app.use(notFoundMiddleware);

// handle errors
app.use(errorMiddleware);

// listen
app.listen(process.env.PORT, () => console.log("Working"));
