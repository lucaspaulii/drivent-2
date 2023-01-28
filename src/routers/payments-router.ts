import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter.get('/payments?ticketId=1');
paymentsRouter.post('/payments/process');

export { paymentsRouter };
