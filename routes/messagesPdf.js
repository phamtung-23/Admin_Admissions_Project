import express from 'express';

import { verifyAdmin, verifyManager, verifyToken } from '../utils/verifyToken.js';
import { handleGetMessagePdfById, handleSaveMessagePdf } from '../controllers/messagesPdf.controller.js';

const router = express.Router();

// get api chat
router.get('/:userId/:type', handleGetMessagePdfById)
router.post('/', handleSaveMessagePdf)

export default router