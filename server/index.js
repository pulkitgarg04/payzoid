import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import prisma from './utils/prisma.js';

import userRouter from './routes/user.js';
import accountRouter from './routes/account.js';
import messageRouter from './routes/message.js';

const app = express();

console.log("Frontend: " + process.env.FRONTEND_URL)
app.use(cors({
    origin: `${process.env.FRONTEND_URL || '*'}`,
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL database connected');
    
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ${process.env.PORT || 8080}`);
    });
  } catch (error) {
    console.log("Error while connecting to PostgreSQL: ", error.message);
    process.exit(1);
  }
};

startServer();

app.get('/', (req, res) => {
    res.send("Hello from PayZoid!");
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/messages', messageRouter);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});