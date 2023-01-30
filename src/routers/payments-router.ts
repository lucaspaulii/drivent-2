import { getPayment, postPayment } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter
  .get('/payments', authenticateToken, getPayment)
  .post('/payments/process', authenticateToken, postPayment);

export { paymentsRouter };
