import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log("MongoDB connected: ", connection.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);
  }
};

export default connectDB;
