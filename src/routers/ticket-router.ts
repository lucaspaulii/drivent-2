import { getTicketTypes, getUserTicket, postUserTicket } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const ticketsRouter = Router();

ticketsRouter
  .get('/', authenticateToken, getUserTicket)
  .post('/', authenticateToken, postUserTicket)
  .get('/types', authenticateToken, getTicketTypes);

export { ticketsRouter };
