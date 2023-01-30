import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { insertTicket, Ticket, TicketType } from '@prisma/client';
import dayjs from 'dayjs';

async function getAllTypes(): Promise<TicketType[]> {
  const types = await ticketsRepository.findAllTypes();
  return types;
}

async function getUserTicket(userId: number): Promise<Ticket> {
  const enrollmentId = await verifyEnrollment(userId);
  const ticket = await ticketsRepository.findFirstUserTicket(enrollmentId);
  if (!ticket) throw notFoundError();
  return ticket;
}

async function postUserTicket(ticketTypeId: number, userId: number): Promise<Ticket> {
  const enrollmentId = await verifyEnrollment(userId);
  const now: Date = dayjs().toDate();
  const insertTicket: insertTicket = {
    ticketTypeId,
    enrollmentId,
    createdAt: now,
    updatedAt: now,
    status: 'RESERVED',
  };
  const ticket = await ticketsRepository.createUserTicket(insertTicket);
  return ticket;
}

async function updateTicketStatus(userId: number): Promise<void> {
  const enrollmentId = await verifyEnrollment(userId);

  const ticket = await ticketsRepository.findFirstUserTicket(enrollmentId);
  if (!ticket) throw notFoundError();

  await ticketsRepository.updatePaymentTicket(enrollmentId, ticket.id);
}

async function verifyEnrollment(userId: number): Promise<number> {
  const enrollment = await enrollmentRepository.findEnrollmentIdByUserId(userId);
  if (!enrollment) throw notFoundError();
  return enrollment.id;
}

const ticketsService = {
  getAllTypes,
  getUserTicket,
  postUserTicket,
  updateTicketStatus,
};

export default ticketsService;
