import express from 'express';

import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { handleCreateGeneral, handleEditGeneral, showEditGeneral,showSettingGeneral } from '../../controllers/admin/setting.dashboard.js';
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


// get setting general page
router.get('/general',verifyDashboardManager, showSettingGeneral)
// handle create general setting
router.post('/general', handleCreateGeneral)
// get edit general setting
router.get('/general/:id/edit',verifyDashboardManager, showEditGeneral)
// handle edit general setting
router.put('/general/:id/edit',verifyDashboardManager, upload.array('iconOfClient', 12), handleEditGeneral)

export default router