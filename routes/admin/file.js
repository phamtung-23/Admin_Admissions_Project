import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import {  downloadFilePdfAll, getAddPdf, getHandleGetPdf, handleFilePdf } from '../../controllers/admin/file.dashboard.js';
import multer from 'multer';
import { convertFilename } from '../../utils/convertFileName.js';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,convertFilename(file.originalname))
  }
})
var upload = multer({ storage: storage })

const router = express.Router();

// router.post('/create', verifyDashboardManager, upload.array('colorImage', 12), handleCreateLegendItem);
// router.put('/:id', verifyDashboardManager,upload.array('colorImage', 12), handleUpdateLegendItem);
router.delete('/:id', verifyDashboardManager, handleFilePdf);

// router.get('/:id/edit', verifyDashboardManager, getEditLegendItem); 
router.get('/create', verifyDashboardManager, getAddPdf); 
router.get('/download', verifyDashboardManager, downloadFilePdfAll); 
router.get('/', verifyDashboardManager, getHandleGetPdf); 

export default router