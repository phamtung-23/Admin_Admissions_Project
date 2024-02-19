import express from 'express';


import { verifyDashboard, verifyDashboardManager, verifyTokenMobile } from '../utils/verifyToken.js';
import { getDetailLegendItemEn, getDetailLegendItemVi, getLegendItemEn, getLegendItemVi } from '../controllers/legendItem.controller.js';

const router = express.Router();


router.get('/vi',verifyTokenMobile, getLegendItemVi);
router.get('/en',verifyTokenMobile, getLegendItemEn);

router.get('/vi/:id',verifyTokenMobile, getDetailLegendItemVi); 
router.get('/en/:id',verifyTokenMobile, getDetailLegendItemEn); 

export default router