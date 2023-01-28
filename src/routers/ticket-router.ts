import { Router } from 'express';

const ticketsRouter = Router();

ticketsRouter.get('/tickets');
ticketsRouter.post('/tickets');
ticketsRouter.get('/tickets/types');

export { ticketsRouter };
