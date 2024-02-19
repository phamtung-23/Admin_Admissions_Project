import express from 'express';
import { showOilFields, showCreateField, showEditField } from '../../controllers/admin/oilField.dashboard.js';
import { verifyDashboardManager } from '../../utils/verifyToken.js';
import { createField, updateField } from '../../controllers/oilField.controller.js';
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


// show list oil field in dashboard
router.get('/',verifyDashboardManager, showOilFields); 
router.get('/create',verifyDashboardManager, showCreateField); 
router.get('/:id/edit',verifyDashboardManager, showEditField); 
router.post('/create',verifyDashboardManager, upload.array('colorImage', 12), createField); 
router.post('/edit/:id',verifyDashboardManager, upload.array('colorImage', 12), updateField); 



export default router