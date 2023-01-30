import { AuthenticatedRequest } from '@/middlewares';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { createPaymentSchema } from '@/schemas/payment-schema';
import paymentService from '@/services/payment-service';
import ticketsService from '@/services/tickets-services';
import { inputPayment } from '@prisma/client';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  const { userId } = req;
  if (!ticketId) return res.sendStatus(400);
  if (!userId) return res.sendStatus(401);

  try {
    const ticket = await ticketsRepository.findTicketById(Number(ticketId));
    if (!ticket) return res.sendStatus(httpStatus.NOT_FOUND);
    
    const userEnrollment = await enrollmentRepository.findEnrollmentIdByUserId(userId);
    if (ticket.enrollmentId !== userEnrollment.id) return res.sendStatus(401);

    const payment = await paymentService.getPaymentByTicketId(Number(ticketId));
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const inputPayment = req.body as inputPayment;
  const { userId } = req;

  const { error } = createPaymentSchema.validate(inputPayment, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try {
    const ticket = await ticketsRepository.findTicketById(inputPayment.ticketId);
    if (!ticket) return res.sendStatus(httpStatus.NOT_FOUND);

    const userEnrollment = await enrollmentRepository.findEnrollmentIdByUserId(userId);
    if (ticket.enrollmentId !== userEnrollment.id) return res.sendStatus(401);

    const createdPayment = await paymentService.postPayment(inputPayment, userId);
    await ticketsService.updateTicketStatus(userId);
    return res.status(httpStatus.OK).send(createdPayment);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
