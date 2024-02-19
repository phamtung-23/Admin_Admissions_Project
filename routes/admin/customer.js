import express from 'express';


import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getCreateCustomer, getEditCustomer, getListCustomer, handleCreateCustomer, handleDeleteCustomer, handleUpdateCustomer } from '../../controllers/admin/customer.dashboard.js';

const router = express.Router();

// SHOW DASHBOARD
// router.get('/', showOilFields)

router.post('/', verifyDashboardManager, handleCreateCustomer);
router.put('/:id', verifyDashboardManager, handleUpdateCustomer);
router.delete('/:id', verifyDashboardManager, handleDeleteCustomer);

// router.get('/:id', verifyDashboardManager, getPipeLine);

router.get('/:id/edit', verifyDashboardManager, getEditCustomer); 
router.get('/create', verifyDashboardManager, getCreateCustomer); 
router.get('/', verifyDashboardManager, getListCustomer); 

export default router