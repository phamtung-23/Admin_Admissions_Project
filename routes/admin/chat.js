import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getChatBox, handleChatGPT } from '../../controllers/admin/chat.dashboard.js';
import { chatPdfOpenAi, inject_docs } from '../../controllers/chat.controller.js';




const router = express.Router();

router.post('/gpt', handleChatGPT);
router.post('/pdf', chatPdfOpenAi);
router.post('/injectPdf', inject_docs);
router.get('/', verifyDashboardManager, getChatBox);

export default router