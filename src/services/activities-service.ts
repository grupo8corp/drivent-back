import { conflictError, notFoundError } from "@/errors";
import { activitiesRepository } from "@/repositories";

async function getActivities() {
  const activities = await activitiesRepository.findMany();
  return activities.map(({ _count: { Participants }, capacity, ...rest }) => ({ ...rest, capacity, remainingVacancies: capacity - Participants }));
};

async function postParticipant(activityId: number, userId: number) {
  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.capacity === activity._count.Participants) throw conflictError('This activity already have reached its maximum capacity of participants');

  const participantActivity = await activitiesRepository.findParticipantByUserId(userId);
  if (participantActivity.some(({ Activity: { startsAt, endsAt }}) => {
    if (startsAt.toLocaleDateString() === activity.startsAt.toLocaleDateString()){
      const mineStartTime = startsAt.getUTCHours();
      const mineEndTime = endsAt.getUTCHours();

      const iWantStartTime = activity.startsAt.getUTCHours();
      const iWantEndTime = activity.startsAt.getUTCHours();

      if (iWantStartTime <= mineEndTime && iWantStartTime >= mineStartTime) return true;
      if (mineEndTime >= iWantStartTime && mineEndTime <= iWantEndTime) return true;
    }
  })) throw conflictError('You cannot participant in events that occur on the same time');

  return await activitiesRepository.createParticipant(activityId, userId);
};

export const activitiesService = {
  getActivities,
  postParticipant
};
