import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getCreateService, getEditService, getListService, handleCreateService, handleDeleteService, handleUpdateService } from '../../controllers/admin/service.dashboard.js';

const router = express.Router();

router.post('/', verifyDashboardManager, handleCreateService);
router.put('/:id', verifyDashboardManager, handleUpdateService);
router.delete('/:id', verifyDashboardManager, handleDeleteService);

router.get('/:id/edit', verifyDashboardManager, getEditService); 
router.get('/create', verifyDashboardManager, getCreateService); 
router.get('/', verifyDashboardManager, getListService); 

export default router