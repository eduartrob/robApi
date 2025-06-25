import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db';
import userRouter from './routes/userRouter';
import appRouter from './routes/appRouter'
import s3Router from './routes/s3Router';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/apps', appRouter);
app.use('/api/s3', s3Router);


connectDB();
export { app };