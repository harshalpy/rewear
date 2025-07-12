import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authenticate.js';
import {
    createSwap,
    getUserSwaps,
    getSwapById,
    acceptSwap,
    declineSwap,
    completeSwap
} from '../controllers/swap.controller.js';



const SwapsRouter = express.Router();

SwapsRouter.use(authMiddleware);

SwapsRouter.post('/', createSwap);
SwapsRouter.get('/', getUserSwaps);
SwapsRouter.get('/:id', getSwapById);
SwapsRouter.patch('/:id/accept', acceptSwap);
SwapsRouter.patch('/:id/decline', declineSwap);
SwapsRouter.patch('/:id/complete', completeSwap);

export default SwapsRouter;
