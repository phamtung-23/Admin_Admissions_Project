import express from 'express';
import { verifyDashboardManager } from '../../utils/verifyToken.js';
import { updateField } from '../../controllers/oilField.controller.js';
import { showCreateEconomic, showEconomic, showEditEconomic } from '../../controllers/admin/economic.dashboard.js';
import { createEconomic } from '../../controllers/economic.controller.js';


const router = express.Router();


// show list oil field in dashboard
router.get('/',verifyDashboardManager, showEconomic); 
router.get('/create',verifyDashboardManager, showCreateEconomic); 
router.get('/:id/edit',verifyDashboardManager, showEditEconomic); 
// router.get('/:id/edit',verifyDashboardManager, showEditField); 

router.post('/create',verifyDashboardManager, createEconomic); 
router.post('/edit/:id',verifyDashboardManager, updateField); 



export default router