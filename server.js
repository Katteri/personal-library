import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs/promises';
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

// информация о сервере
app.get('/api/server-info', (req, res) => {
    const serverInfo = {
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        uptime: os.uptime(),
        memory: {
            free: os.freemem(),
            total: os.totalmem(),
        },
        cpus: os.cpus(),
    };

    res.json(serverInfo);
});

// чтение файла
app.get('/api/file-content', async (req, res) => {
    const filePath = './data/example.txt';
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        res.json({ content: fileContent });
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Failed to read file' });
    }
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
