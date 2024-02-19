import express from 'express';


import { verifyDashboard, verifyDashboardManager, verifyTokenMobile } from '../utils/verifyToken.js';
import { createField, deleteField, getField, getFields, updateField } from '../controllers/oilField.controller.js';

const router = express.Router();

// SHOW DASHBOARD
// router.get('/', showOilFields)

router.get('/',verifyTokenMobile, getFields); 

router.get('/:id',verifyTokenMobile, getField);

// router.put('/:id', updateField);

// router.post('/', createField);

router.delete('/:id', deleteField);


export default router