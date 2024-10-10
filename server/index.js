import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import rootRouter from './routes/index.js';

const app = express();

console.log(process.env.FRONTEND_URL)
app.use(cors({
    origin: `${process.env.FRONTEND_URL || '*'}`,
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    mongoose.connect(`${process.env.MONGO_URI}`)
      .then(() => {
        console.log('db connected');
        app.listen(process.env.PORT || 8080, () => {
          console.log(`Server is running on port ${process.env.PORT}`);
        });
    });
  } catch (error) {
    console.log("Error while connecting to Mongo DB: ", error.message);
  }
};

startServer();

app.get('/', (req, res) => {
    res.send("Hello from PayZoid!");
});

app.use('/api/v1', rootRouter);
