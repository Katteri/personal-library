import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const DB = process.env.DB_STORAGE;

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB,
    logging: false,
});

sequelize.query('PRAGMA journal_mode=WAL;');

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
