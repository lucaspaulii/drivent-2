import Joi from 'joi';

export const createUserTicketSchema = Joi.object({
  ticketTypeId: Joi.number(),
});
