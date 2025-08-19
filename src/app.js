import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://sti-marketplace.netlify.app', 'https://sti-fairview-proware.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.urlencoded({extended: true}));

app.use('/api', routes);

app.use('*', (req, res) => {
  res.status(404).json({error: 'Not Found'});
});

export default app;
