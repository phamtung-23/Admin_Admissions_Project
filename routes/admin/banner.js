import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import multer from 'multer';
import { getCreateBanner, getEditBanner, getListBanner, handleCreateBanner, handleDeleteBanner, handleUpdateBanner } from '../../controllers/admin/banner.dashboard.js';
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

router.post('/', verifyDashboardManager, upload.array('iconImage', 12), handleCreateBanner);
router.put('/:id', verifyDashboardManager,upload.array('iconImage', 12), handleUpdateBanner);
router.delete('/:id', verifyDashboardManager, handleDeleteBanner);


router.get('/:id/edit', verifyDashboardManager, getEditBanner); 
router.get('/create', verifyDashboardManager, getCreateBanner); 
router.get('/', verifyDashboardManager, getListBanner); 

export default router