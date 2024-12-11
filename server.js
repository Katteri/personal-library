import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/database.js';
import bookRoutes from './routes/bookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/config', (req, res) => {
    res.json({
        apiUrl: `http://localhost:${PORT}/api/books`,
        authorsUrl: `http://localhost:${PORT}/api/authors`,
        categoriesUrl: `http://localhost:${PORT}/api/categories`,
    });
});


// логи
app.use((req, res, next) => {
    const requestId = uuidv4();
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start; 
        console.log(`[${requestId}] ${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
    });

    req.requestId = requestId;
    next();
});

app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);

connectDB();

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized.');
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
