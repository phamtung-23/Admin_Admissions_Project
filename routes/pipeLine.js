import express from 'express';


import { verifyDashboard, verifyDashboardManager, verifyTokenMobile } from '../utils/verifyToken.js';
import { createPipeLine, deletePipeLine, getPipeLine, getPipeLines, updatePipeLine } from '../controllers/pipeLine.controller.js';

const router = express.Router();

// SHOW DASHBOARD
// router.get('/', showOilFields)

router.post('/', createPipeLine);

router.put('/:id', updatePipeLine);

router.delete('/:id', deletePipeLine);

router.get('/:id',verifyTokenMobile, getPipeLine);

router.get('/',verifyTokenMobile, getPipeLines); 

export default router