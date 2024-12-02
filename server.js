import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/database.js';
import bookRoutes from './routes/bookRoutes.js';
import { setupAssociations } from './models/associations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// логи
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
    });
    next();
});

app.use('/api/books', bookRoutes);

connectDB();

setupAssociations();

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized.');
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
