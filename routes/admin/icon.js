import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getCreateIcon, getDetailIcon, getEditIcon, getListIcon, handleCreateIcon, handleDeleteIcon, handleUpdateIcon } from '../../controllers/admin/icon.dashboard.js';
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

router.post('/', verifyDashboardManager,upload.array('iconImage', 12), handleCreateIcon);
router.put('/:id', verifyDashboardManager,upload.array('iconImage', 12), handleUpdateIcon);
router.delete('/:id', verifyDashboardManager, handleDeleteIcon);

router.get('/:id/detail', verifyDashboardManager, getDetailIcon); 
router.get('/:id/edit', verifyDashboardManager, getEditIcon); 
router.get('/create', verifyDashboardManager, getCreateIcon); 
router.get('/', verifyDashboardManager, getListIcon); 

export default router