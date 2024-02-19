import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getCreateProject, getDetailProject, getEditProject, getListProject, getServicesSelect, getServicesSelectProject, handleCreateProject, handleDeleteImage, handleDeleteProject, handleUpdateProject } from '../../controllers/admin/project.dashboard.js';
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

router.post('/', verifyDashboardManager, upload.any(), handleCreateProject);
router.put('/:id', verifyDashboardManager,upload.any(), handleUpdateProject);

router.delete('/:id/:index', verifyDashboardManager, handleDeleteImage);
router.delete('/:id', verifyDashboardManager, handleDeleteProject);

router.post('/getServicesSelect', verifyDashboardManager, getServicesSelect); 
router.post('/getServicesSelectProject/:id', verifyDashboardManager, getServicesSelectProject); 
router.get('/:id/edit', verifyDashboardManager, getEditProject); 
router.get('/detail/:id', verifyDashboardManager, getDetailProject); 
router.get('/create', verifyDashboardManager, getCreateProject); 
router.get('/', verifyDashboardManager, getListProject); 

export default router