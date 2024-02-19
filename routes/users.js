import express from 'express';
import { updateUser, deleteUser, getUser} from '../controllers/user.controller.js';
import { verifyAdmin, verifyManager, verifyToken } from '../utils/verifyToken.js';
const router = express.Router();

// 
router.put('/:id',verifyManager,updateUser)
// API FOR  GET USER ID
router.get('/:id',verifyManager,getUser)

export default router