import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { TicketType } from '@prisma/client';

async function getAllTypes(): Promise<TicketType[]> {
  const types = await ticketsRepository.findAllTypes();
  return types;
}

async function getUserTicket(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentIdByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findFirstUserTicket(enrollment.id);
  if (!ticket) throw notFoundError();
  return ticket;
}

const ticketsService = {
  getAllTypes,
  getUserTicket,
};

export default ticketsService;
