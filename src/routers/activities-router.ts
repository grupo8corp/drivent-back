import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getActivities, postParticipant } from '@/controllers';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', getActivities)
  .post('/participant', postParticipant)

export { activitiesRouter };
