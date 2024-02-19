import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getCreateLegendGroup, getEditLegendGroup, getListLegendGroup, handleCreateLegendGroup, handleDeleteLegendGroup, handleUpdateLegendGroup } from '../../controllers/admin/legendGroup.dashboard.js';

const router = express.Router();

router.post('/', verifyDashboardManager, handleCreateLegendGroup);
router.put('/:id', verifyDashboardManager, handleUpdateLegendGroup);
router.delete('/:id', verifyDashboardManager, handleDeleteLegendGroup);

router.get('/:id/edit', verifyDashboardManager, getEditLegendGroup); 
router.get('/create', verifyDashboardManager, getCreateLegendGroup); 
router.get('/', verifyDashboardManager, getListLegendGroup); 

export default router