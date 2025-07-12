import express from 'express';
import { createProduct , getAllProducts , getProductById , updateProduct , deleteProduct} from '../controllers/product.controller.js';

import { authMiddleware } from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';

const ProductsRouter = express.Router();

ProductsRouter.get('/', getAllProducts);
ProductsRouter.get('/:id', getProductById);

ProductsRouter.use(authMiddleware);
ProductsRouter.post('/', upload.array('images') , createProduct);
ProductsRouter.patch('/:id', updateProduct);
ProductsRouter.delete('/:id', deleteProduct);

export default ProductsRouter;