import express from 'express';

import { verifyAdmin, verifyManager, verifyToken } from '../utils/verifyToken.js';
import multer from 'multer';
import { handleGetBanner } from '../controllers/banner.controller.js';

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
router.get('/', handleGetBanner)

export default router