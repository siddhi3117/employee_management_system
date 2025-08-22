import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js'
import { getAdminSummary } from '../Controllers/adminSummaryController.js';


const router = express.Router();


router.get("/adminsummary", authMiddleware, getAdminSummary);





export default router;
