import http from "http";
import app from "./app.js";
import connectDB from "./services/connectDB.js";

const PORT = 3000;

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

await startServer();
