import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-services';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticketTypes = await ticketsService.getAllTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticket = await ticketsService.getUserTicket(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postUserTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  if (!ticketTypeId) return res.sendStatus(400);

  try {
    const createdTicket = await ticketsService.postUserTicket(Number(ticketTypeId), userId);
    return res.status(httpStatus.CREATED).send(createdTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
