import express from 'express';

import { verifyAdmin, verifyManager, verifyToken } from '../utils/verifyToken.js';
import multer from 'multer';
import { handleGetMessageById, handleSaveMessage } from '../controllers/messages.controller.js';

const router = express.Router();

// get api chat
router.post('/', handleSaveMessage)
router.get('/:userId', handleGetMessageById)

export default router