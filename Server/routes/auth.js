import express from 'express';
import { login,verify,register } from '../Controllers/authControllers.js';
import authMiddleware from '../middleware/authmiddleware.js'


const router = express.Router();


router.post('/login', login);
router.get('/verify',authMiddleware, verify)
router.post('/register', register);




export default router;
