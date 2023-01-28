import { prisma } from '@/config';
import { Prisma, Ticket, TicketType } from '@prisma/client';
import dayjs from 'dayjs';
import enrollmentRepository from '../enrollment-repository';

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

async function createUserTicket(ticketTypeId: number, enrollmentId: number): Promise<Ticket> {
  const now = dayjs().toString();
  const ticket = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: 'RESERVED',
      createdAt: now,
      updatedAt: now,
    },
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

async function updatePaymentTicket(enrollmentId: number) {
  const ticketId = await prisma.ticket.findFirst({
    select: {
      id: true,
    },
    where: {
      enrollmentId,
    },
  });
  await prisma.ticket.update({
    where: {
      id: ticketId.id,
    },
    data: {
      status: 'PAID',
    },
  });
}

const ticketsRepository = {
  findAllTypes,
  findFirstUserTicket,
  createUserTicket,
  updatePaymentTicket
};

export default ticketsRepository;
