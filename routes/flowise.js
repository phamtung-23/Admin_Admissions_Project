import express from 'express';

import { verifyAdmin, verifyManager, verifyToken } from '../utils/verifyToken.js';
import { handleChatAI, handleChatPDF, handleChatPDFWithPinecone } from '../controllers/flowise.controller.js';
import multer from 'multer';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})
var upload = multer({ storage: storage })

const router = express.Router();

// get api chat
router.post('/', upload.array('files', 12), handleChatAI)
router.post('/pdf',upload.any(), handleChatPDFWithPinecone)

export default router