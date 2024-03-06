import express from 'express';


import { verifyDashboard, verifyDashboardManager, verifyTokenMobile } from '../utils/verifyToken.js';
import { getAllUniversity, getDetailUniversity, getTopUniversity } from '../controllers/university.controller.js';


const router = express.Router();


router.get('/', getAllUniversity);
// router.get('/:limit', getTopUniversity);
router.get('/:id', getDetailUniversity);

// router.post('/', createEconomic);

// router.put('/:id', updateEconomic);

// router.delete('/:id', deleteEconomic);
// router.get('/vi',verifyTokenMobile, getProjectsVi);

// router.get('/vi/:id',verifyTokenMobile, getDetailProjectVi);
// router.get('/en/:id',verifyTokenMobile, getDetailProjectEn);



export default router