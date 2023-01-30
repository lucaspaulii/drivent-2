import { prisma } from '@/config';
import { insertPayment, Payment } from '@prisma/client';

async function findPaymentByTicketId(ticketId: number): Promise<Payment> {
  const payment = prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });

  return payment;
}

async function createPayment(insertPayment: insertPayment): Promise<Payment> {
  const payment = await prisma.payment.create({
    data: insertPayment,
    select: {
      id: true,
      ticketId: true,
      value: true,
      cardIssuer: true,
      cardLastDigits: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return payment;
}

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
