import express from 'express';
import { login,verify } from '../Controllers/authControllers.js';
import authMiddleware from '../middleware/authmiddleware.js'


const router = express.Router();


router.post('/login', login);
router.get('/verify',authMiddleware, verify)




export default router;
