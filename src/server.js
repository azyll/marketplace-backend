import http from 'http';
import app from './app.js';
import connectDB from './services/connectDB.js';
import nodeCron from 'node-cron';
import {OrderService} from './services/order.service.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

nodeCron.schedule('* * * * *', () => {
  OrderService.markOnGoingOrdersAsCancelled();
});

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

await startServer();
