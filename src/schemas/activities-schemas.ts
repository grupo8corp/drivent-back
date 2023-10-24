import Joi from 'joi';
import { InputActivitiesBody } from '@/protocols';

export const bookingSchema = Joi.object<InputActivitiesBody>({
  activityId: Joi.number().integer().required()
});
