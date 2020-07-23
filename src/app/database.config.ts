import mongoose from "mongoose";

let database: mongoose.Connection;

let mongoURI: string = process.env.mongoURI!;

export const connectToDatabase = () => {
  if (database) return;

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = mongoose.connection;

  database.once("open", async () => {
    console.log("Connected to database");
  });

  database.on("error", () => {
    console.log("Error connecting to database");
  });
};
