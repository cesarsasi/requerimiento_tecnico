


import { DataSource } from "typeorm";
import { Course } from "../models/courseModel";
import { User } from "../models/userModel";
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    logging: false,
    synchronize: false,
    entities: [Course, User],
    extra: {
        connectionLimit: 10,
    },
});
