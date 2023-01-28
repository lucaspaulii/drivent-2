import { prisma } from '@/config';
import { Prisma, Ticket, TicketType } from '@prisma/client';
import dayjs from 'dayjs';
import enrollmentRepository from '../enrollment-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const types = await prisma.ticketType.findMany();
  return types;
}

async function getUserTicket(enrollmentId: number): Promise<Ticket> {
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

async function postUserTicket(ticketTypeId: number, enrollmentId: number): Promise<Ticket> {
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

async function putPaymentTicket(enrollmentId: number) {
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
  getTicketTypes,
  getUserTicket,
  postUserTicket,
  putPaymentTicket
};

export default ticketsRepository;
