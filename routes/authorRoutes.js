import express from 'express';
import { getAuthors } from '../controllers/authorController.js';

const router = express.Router();

router.get('/', getAuthors);

export default router;