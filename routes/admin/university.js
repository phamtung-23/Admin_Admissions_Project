import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import multer from 'multer';
import { getCreateUniversity, getEditUniversity, getListUniversity, handleCreateUniversity, handleDeleteUniversity, handleUpdateUniversity } from '../../controllers/admin/university.dashboard.js';
import { handleGetPdfForUniversity } from '../../controllers/admin/file.dashboard.js';

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

router.post('/getPdf', handleGetPdfForUniversity);
router.post('/', verifyDashboardManager, upload.any(), handleCreateUniversity);
router.put('/:id', verifyDashboardManager,upload.any(), handleUpdateUniversity);

// router.delete('/:id/:index', verifyDashboardManager, handleDeleteImage);
router.delete('/:id', verifyDashboardManager, handleDeleteUniversity);

// router.post('/getServicesSelect', verifyDashboardManager, getServicesSelect); 
// router.post('/getServicesSelectProject/:id', verifyDashboardManager, getServicesSelectProject); 

router.get('/:id/edit', verifyDashboardManager, getEditUniversity); 
// router.get('/detail/:id', verifyDashboardManager, getDetailProject); 
router.get('/create', verifyDashboardManager, getCreateUniversity); 
router.get('/', verifyDashboardManager, getListUniversity); 

export default router