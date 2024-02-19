import express from 'express';


import { verifyDashboard, verifyDashboardManager, verifyTokenMobile } from '../utils/verifyToken.js';
import {  getDetailProjectEn, getDetailProjectVi, getProjectsEn, getProjectsVi } from '../controllers/project.controller.js';


const router = express.Router();


// router.post('/', createEconomic);

// router.put('/:id', updateEconomic);

// router.delete('/:id', deleteEconomic);
router.get('/en',verifyTokenMobile, getProjectsEn);
router.get('/vi',verifyTokenMobile, getProjectsVi);

router.get('/vi/:id',verifyTokenMobile, getDetailProjectVi);
router.get('/en/:id',verifyTokenMobile, getDetailProjectEn);



export default router