import express from 'express';
import { register, login, loginMobile } from '../controllers/auth.controller.js';
const route = express.Router();

// API FOR REGISTER
route.post('/register', register)
// API FOR LOGIN
route.post('/login', login)

export default route