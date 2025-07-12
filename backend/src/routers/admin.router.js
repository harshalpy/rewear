import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authenticate.js';
import { listPendingItems , approveItem , rejectItem , removeProduct , viewAdminLogs} from '../controllers/admin.controller.js';

const AdminRouter = express.Router();

AdminRouter.use(authMiddleware, adminMiddleware);

AdminRouter.get('/products', listPendingItems);
AdminRouter.post('/products/:id/approve', approveItem);
AdminRouter.post('/products/:id/reject', rejectItem);
AdminRouter.delete('/products/:id', removeProduct);

AdminRouter.get('/logs', viewAdminLogs);

export default AdminRouter;