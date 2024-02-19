import express from 'express';


import { verifyDashboard, verifyDashboardManager, verifyTokenMobile } from '../utils/verifyToken.js';
import { getDetailLegendGroupEn, getDetailLegendGroupVi, getLegendGroupEn, getLegendGroupVi } from '../controllers/legendGroup.controller.js';

const router = express.Router();

router.get('/vi',verifyTokenMobile, getLegendGroupVi); 
router.get('/en',verifyTokenMobile, getLegendGroupEn); 
router.get('/vi/:id',verifyTokenMobile, getDetailLegendGroupVi); 
router.get('/en/:id',verifyTokenMobile, getDetailLegendGroupEn); 

export default router