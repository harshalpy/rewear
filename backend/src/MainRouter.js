import express from 'express';
import AuthRouter from './routers/auth.router.js';
import UsersRouter from './routers/user.router.js';
import ProductsRouter from './routers/product.router.js';
import SwapsRouter from './routers/swap.router.js';
import AdminRouter from './routers/admin.router.js';

const MainRouter = express.Router();

MainRouter.get('/', (req, res) => {
  res.send('ReWear API is running...');
});

MainRouter.use('/auth', AuthRouter);
MainRouter.use('/users', UsersRouter);
MainRouter.use('/products', ProductsRouter);
MainRouter.use('/swaps', SwapsRouter);
MainRouter.use('/admin', AdminRouter);

export default MainRouter;