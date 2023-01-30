import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { inputPayment, insertPayment, Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import dayjs from 'dayjs';
import enrollmentRepository from '@/repositories/enrollment-repository';
import httpStatus from 'http-status';

async function getPaymentByTicketId(ticketId: number): Promise<Payment> {
  const payment = await paymentRepository.findPaymentByTicketId(ticketId);
  return payment;
}

async function postPayment(inputPayment: inputPayment, userId: number): Promise<Payment> {
  const ticket = await ticketsRepository.findTicketById(inputPayment.ticketId);
  const now = dayjs().toDate();
  const insertPayment: insertPayment = {
    createdAt: now,
    updatedAt: now,
    ticketId: ticket.id,
    value: ticket.TicketType.price,
    cardIssuer: inputPayment.cardData.issuer,
    cardLastDigits: inputPayment.cardData.number.toString().slice(-4),
  };

  const createdPayment = await paymentRepository.createPayment(insertPayment);
  return createdPayment;
}

const paymentService = {
  getPaymentByTicketId,
  postPayment,
};

export default paymentService;
