import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db';
import userRouter from './routes/userRouter';
import appRouter from './routes/appRouter'


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/apps', appRouter);


connectDB();
export { app };