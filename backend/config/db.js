import mongoose from "mongoose";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to connect to MongoDB");
  }

  const maxPoolSize = Number(process.env.MONGO_MAX_POOL_SIZE) || 10;
  const minPoolSize = Number(process.env.MONGO_MIN_POOL_SIZE) || 0;
  const maxRetries = Number(process.env.MONGO_CONNECT_MAX_RETRIES) || 0; // 0 means retry until connected.
  let attempt = 0;

  while (true) {
    try {
      const connection = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize,
        minPoolSize,
        serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10_000,
        socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 45_000,
        maxIdleTimeMS: Number(process.env.MONGO_MAX_IDLE_TIME_MS) || 60_000,
      });
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection;
    } catch (error) {
      attempt += 1;
      if (maxRetries > 0 && attempt >= maxRetries) throw error;

      const delay = Math.min(1_000 * 2 ** Math.min(attempt - 1, 5), 30_000);
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
      console.log(`Retrying MongoDB connection in ${delay / 1000}s`);
      await sleep(delay);
    }
  }
};

mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected; Mongoose will attempt to reconnect"));
mongoose.connection.on("reconnected", () => console.log("MongoDB reconnected"));
mongoose.connection.on("error", (error) => console.error("MongoDB connection error:", error.message));

export default connectDB;
