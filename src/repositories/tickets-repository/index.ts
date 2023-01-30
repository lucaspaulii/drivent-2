import { prisma } from '@/config';
import { insertTicket } from '@prisma/client';
import { Ticket, TicketType } from '@prisma/client';

async function findAllTypes(): Promise<TicketType[]> {
  const types = await prisma.ticketType.findMany();
  return types;
}

async function findFirstUserTicket(enrollmentId: number): Promise<Ticket> {
  const ticket = await prisma.ticket.findFirst({
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      enrollmentId: enrollmentId,
    },
  });

  return ticket;
}

async function createUserTicket(insertTicket: insertTicket): Promise<Ticket> {
  const ticket = await prisma.ticket.create({
    data: insertTicket,
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return ticket;
}

async function updatePaymentTicket(enrollmentId: number, ticketId: number) : Promise<void> {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
}

async function findTicketById(ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      id: ticketId,
    },
  });

  return ticket;
}

const ticketsRepository = {
  findAllTypes,
  findFirstUserTicket,
  createUserTicket,
  updatePaymentTicket,
  findTicketById
};

export default ticketsRepository;
