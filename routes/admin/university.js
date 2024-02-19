import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getCreateProject, getDetailProject, getEditProject, getListProject, getServicesSelect, getServicesSelectProject, handleCreateProject, handleDeleteImage, handleDeleteProject, handleUpdateProject } from '../../controllers/admin/project.dashboard.js';
import multer from 'multer';
import { getCreateUniversity, getListUniversity, handleCreateUniversity } from '../../controllers/admin/university.dashboard.js';

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

router.post('/', verifyDashboardManager, upload.any(), handleCreateUniversity);
// router.put('/:id', verifyDashboardManager,upload.any(), handleUpdateProject);

// router.delete('/:id/:index', verifyDashboardManager, handleDeleteImage);
// router.delete('/:id', verifyDashboardManager, handleDeleteProject);

// router.post('/getServicesSelect', verifyDashboardManager, getServicesSelect); 
// router.post('/getServicesSelectProject/:id', verifyDashboardManager, getServicesSelectProject); 

// router.get('/:id/edit', verifyDashboardManager, getEditProject); 
// router.get('/detail/:id', verifyDashboardManager, getDetailProject); 
router.get('/create', verifyDashboardManager, getCreateUniversity); 
router.get('/', verifyDashboardManager, getListUniversity); 

export default router