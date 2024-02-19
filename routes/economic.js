import express from 'express';


import { verifyDashboard, verifyDashboardManager, verifyTokenMobile } from '../utils/verifyToken.js';
import { createEconomic, deleteEconomic, getEconomic, getEconomics, updateEconomic } from '../controllers/economic.controller.js';

const router = express.Router();

// SHOW DASHBOARD
// router.get('/', showOilFields)

router.post('/', createEconomic);

router.put('/:id', updateEconomic);

router.delete('/:id', deleteEconomic);

router.get('/:id',verifyTokenMobile, getEconomic);

router.get('/',verifyTokenMobile, getEconomics); 

export default router