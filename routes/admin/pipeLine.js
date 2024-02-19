import express from 'express';
import { verifyDashboardManager } from '../../utils/verifyToken.js';
import { createEconomic } from '../../controllers/economic.controller.js';
import { showCreatePipeLine, showEditPipeLine, showPipeLine } from '../../controllers/admin/pipeLine.dashboard.js';


const router = express.Router();


// show list oil field in dashboard
router.get('/',verifyDashboardManager, showPipeLine); 
router.get('/create',verifyDashboardManager, showCreatePipeLine); 
router.get('/:id/edit',verifyDashboardManager, showEditPipeLine); 
// router.get('/:id/edit',verifyDashboardManager, showEditField); 

router.post('/create',verifyDashboardManager, createEconomic); 
// router.post('/edit/:id',verifyDashboardManager, updateField); 



export default router