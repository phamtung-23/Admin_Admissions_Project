import express from 'express';

import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { handleCreateGeneral, handleCreateVersion, handleDeleteVersion, handleEditGeneral, handleEditVersion, showCreateVersion, showEditGeneral, showEditVersion, showSettingGeneral, showVersion } from '../../controllers/admin/setting.dashboard.js';
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

// // SHOW version app
router.get('/version',verifyDashboardManager, showVersion)
// get create version
router.get('/version/create',verifyDashboardManager, showCreateVersion)
// handle create version
router.post('/version/create',verifyDashboardManager, handleCreateVersion)
// get edit version
router.get('/version/:id/edit',verifyDashboardManager, showEditVersion)
// handle edit version
router.put('/version/:id',verifyDashboardManager, handleEditVersion)
// handle delete version
router.delete('/version/:id',verifyDashboardManager, handleDeleteVersion)

// get setting general page
router.get('/general',verifyDashboardManager, showSettingGeneral)
// handle create general setting
router.post('/general', handleCreateGeneral)
// get edit general setting
router.get('/general/:id/edit',verifyDashboardManager, showEditGeneral)
// handle edit general setting
router.put('/general/:id/edit',verifyDashboardManager, upload.array('iconOfClient', 12), handleEditGeneral)

export default router