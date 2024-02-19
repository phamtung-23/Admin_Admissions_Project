import express from 'express';
import { errorPermission, showLogin, logout, showDashboard, showForgotPassword, handleForgotPassword, showInputOtp, handleOtp, handleSearch } from '../../controllers/admin/auth.dashboard.js';
import { login } from '../../controllers/auth.controller.js';

import { verifyDashboard, verifyDashboardManager } from '../../utils/verifyToken.js';
import { getProfile } from '../../controllers/admin/user.dashboard.js';
import { updateProfile } from '../../controllers/user.controller.js';
const router = express.Router();

// SHOW DASHBOARD
router.get('/',verifyDashboardManager, showDashboard)
// SHOW PROFILE
router.get('/profile',verifyDashboardManager, getProfile)
// HANDLE UPDATE PROFILE
router.put('/profile/:id',verifyDashboardManager, updateProfile)
// SHOW DENIED PAGE
router.get('/authorized', errorPermission)
// SHOW LOGIN PAGE
router.get('/login', showLogin)
// HANDLE LOGIN/LOGOUT
router.post('/login', login)
router.get('/logout', logout)
// SHOW FORGOT PASSWORD
router.get('/forgot/otp', showInputOtp)
router.post('/forgot/otp', handleOtp)
router.get('/forgot', showForgotPassword)
router.post('/forgot', handleForgotPassword)

// search
router.get('/search', handleSearch)



export default router