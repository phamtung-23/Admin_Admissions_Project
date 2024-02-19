import express from 'express';
import {  getAllUser, getFormCreate, getFormEdit, getProfile } from '../../controllers/admin/user.dashboard.js';
import { verifyAdmin, verifyDashboard, verifyDashboardAdmin, verifyManager, verifyToken } from '../../utils/verifyToken.js';
import { deleteUser } from '../../controllers/user.controller.js';
const router = express.Router();


// SHOW FORM CREATE USER IN DASHBOARD
router.get('/create',verifyDashboardAdmin,getFormCreate)
// SHOW FORM EDIT USER IN DASHBOARD
router.get('/:id/edit',verifyDashboardAdmin,getFormEdit)
// HANDLE DELETE USER IN DASHBOARD
router.delete('/:id',verifyDashboardAdmin,deleteUser)
// SHOW LIST ALL USER IN DASHBOARD
router.get('/',verifyDashboardAdmin,getAllUser)

export default router