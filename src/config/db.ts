import mongoose, { ConnectOptions } from "mongoose";

const MONGO_URI: string | undefined = process.env.MONGO_URI;

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI as string, {} as ConnectOptions);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
