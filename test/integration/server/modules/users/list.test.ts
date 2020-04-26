import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import supertest, { SuperTest, Test } from 'supertest';
import { truncateTables, removeAdminMode } from '../../../database-utils';
import { getLoginToken, testServer, deactivateUser, createAdminTest } from '../../../server-utils';

describe('GET /api/v1/users', () => {
  const app: SuperTest<Test> = supertest(testServer);
  beforeEach(async () => {
    await truncateTables(['user']);

    const user = {
      username: 'dude@gmail.com',
      password: 'test'
    };

    await createAdminTest(user);
  });

  it('Should return users list', async () => {
    const token = await getLoginToken('dude@gmail.com', 'test');
    const res = await app
      .get('/api/v1/users/')
      .set('Authorization', token)
      .expect(200);

    expect(res.body.data[0]).keys([
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
  it('Should return 403 not allowed error when not admin', async () => {
    await removeAdminMode('dude@gmail.com');
    const token = await getLoginToken('dude@gmail.com', 'test');
    await app
      .get(`/api/v1/users/`)
      .set('Authorization', token)
      .expect(403);
  });
  it('Should return 401 when user is not activated', async () => {
    const token = await getLoginToken('dude@gmail.com', 'test');
    await deactivateUser('dude@gmail.com');
    const res = await app
      .get('/api/v1/users/')
      .set('Authorization', token)
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is not valid', async () => {
    const res = await app
      .get('/api/v1/users/')
      .set('Authorization', 'wrong token')
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is missing', async () => {
    const res = await app.get('/api/v1/users/').expect(401);

    expect(res.body.code).equals(30002);
  });
});
