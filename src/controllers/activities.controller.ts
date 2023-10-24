import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { activitiesService } from '@/services';
import httpStatus from 'http-status';
import { InputActivitiesBody } from '@/protocols';

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const activities = await activitiesService.getActivities();
  return res.status(httpStatus.OK).send(activities);
}

export async function postParticipant(req: AuthenticatedRequest, res: Response) {
  const body = req.body as InputActivitiesBody;
  const participant = await activitiesService.postParticipant(body.activityId, req.userId);
  return res.status(httpStatus.CREATED).send(participant);
}
