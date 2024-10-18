import 'reflect-metadata';
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger.json';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import userRoutes from './routes/userRoutes';
import './types/custom';

const app: Application = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/course', courseRoutes);
app.use('/user', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
