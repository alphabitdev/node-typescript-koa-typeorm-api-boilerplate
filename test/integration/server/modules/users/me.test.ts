import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import supertest, { SuperTest, Test } from 'supertest';
import { truncateTables } from '../../../database-utils';
import { createUserTest, getLoginToken, testServer, deactivateUser } from '../../../server-utils';

describe('GET /api/v1/users/me', () => {
  const app: SuperTest<Test> = supertest(testServer);
  beforeEach(async () => {
    await truncateTables(['user']);

    const user = {
      username: 'dude@gmail.com',
      password: 'test'
    };

    await createUserTest(user);
  });

  it('Should return user information', async () => {
    const token = await getLoginToken('dude@gmail.com', 'test');
    const res = await app
      .get('/api/v1/users/me')
      .set('Authorization', token)
      .expect(200);

    expect(res.body.data).keys([
      'id',
      'username',
      'created',
      'updated',
      'activated',
      'api_key',
      'name',
      'password',
      'role'
    ]);
  });
  it('Should return 401 when user is not activated', async () => {
    const token = await getLoginToken('dude@gmail.com', 'test');
    await deactivateUser('dude@gmail.com');
    const res = await app
      .get('/api/v1/users/me')
      .set('Authorization', token)
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is not valid', async () => {
    const res = await app
      .get('/api/v1/users/me')
      .set('Authorization', 'wrong token')
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is missing', async () => {
    const res = await app.get('/api/v1/users/me').expect(401);

    expect(res.body.code).equals(30002);
  });
});
