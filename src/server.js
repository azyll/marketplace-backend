import http from "http";
import app from "./app.js";

const PORT = 3000;

const server = http.createServer(app);

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
