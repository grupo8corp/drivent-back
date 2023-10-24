import { conflictError, notFoundError } from "@/errors";
import { activitiesRepository } from "@/repositories";

async function getActivities() {
  const activities = await activitiesRepository.findMany();
  return activities.map(({ _count, ...rest }) => ({ ...rest, participantsCount: _count.Participants }));
}

async function postParticipant(activityId: number, userId: number) {
  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();
  if (activity.capacity === activity._count.Participants) throw conflictError('This activity already have reached its maximum capacity of participants');

  const participant = await activitiesRepository.findParticipantByInput(activityId, userId);
  if (participant) throw conflictError('You cannot participate in two of the same activity');

  await activitiesRepository.createParticipant(activityId, userId);
}

export const activitiesService = {
  getActivities,
  postParticipant
};
