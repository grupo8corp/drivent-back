import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { createActivity, createParticipant } from '../factories/activities-factory';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /activities/participant', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/activities/participant');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/activities/participant').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/activities/participant').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 409 if the activity doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.post('/activities/participant').set('Authorization', `Bearer ${token}`).send({ activityId: 999 });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if the activities already have reached its maximum capacity of participants', async () => {
      const user = await createUser();
      await generateValidToken(user);
      const activity = await createActivity(1);
      await createParticipant(activity.id, user.id);

      const user2 = await createUser();
      const token2 = await generateValidToken(user2);
      const response = await server.post('/activities/participant').set('Authorization', `Bearer ${token2}`).send({ activityId: activity.id });
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('should respond with status 404 if the user is already participating in a event that occur on the same time', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const activity = await createActivity(5, true);
      await createParticipant(activity.id, user.id);

      const activity2 = await createActivity(5, true)

      const response = await server.post('/activities/participant').set('Authorization', `Bearer ${token}`).send({ activityId: activity2.id });
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('should respond with status 201 and participant data if everything is ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const activity = await createActivity(5);

      const response = await server.post('/activities/participant').set('Authorization', `Bearer ${token}`).send({ activityId: activity.id });
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        activityId: activity.id,
        userId: user.id
      });
    });
  });
});

describe('GET /activities', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 and activity data if everything is ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const activity = await createActivity(5);
      const participant = await createParticipant(activity.id, user.id);

      const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: activity.id,
          name: activity.name,
          startsAt: activity.startsAt.toISOString(),
          endsAt: activity.endsAt.toISOString(),
          auditory: activity.auditory,
          createdAt: activity.createdAt.toISOString(),
          updatedAt: activity.updatedAt.toISOString(),
          Participants: [
            {
              id: participant.id,
              userId: user.id
            }
          ],
          capacity: activity.capacity,
          remainingVacancies: activity.capacity - participant.Activity._count.Participants
        }
      ]);
    });
  });
});
