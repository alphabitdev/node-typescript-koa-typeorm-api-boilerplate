import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import supertest, { SuperTest, Test } from 'supertest';
import { getCustomRepository } from 'typeorm';
import { User } from '../../../../../src/db/relational/entities/User';
import UserRepository from '../../../../../src/db/relational/repositories/user';
import { setAdminMode, truncateTables } from '../../../database-utils';
import {
  createUserTest,
  getLoginToken,
  testServer,
  deactivateUser,
  createAdminTest,
  activateUser
} from '../../../server-utils';

describe('GET /api/v1/users/deactivate:id', () => {
  const app: SuperTest<Test> = supertest(testServer);
  let user: User;
  let admin: User;
  let token: string;
  let adminToken: string;
  beforeEach(async () => {
    await truncateTables(['user']);
    user = await createUserTest({
      username: 'user1@gmail.com',
      password: 'test1'
    });
    admin = await createAdminTest({
      username: 'god1@gmail.com',
      password: 'godmode1'
    });
    await setAdminMode(admin.username);
    token = await getLoginToken(user.username, 'test1');
    adminToken = await getLoginToken(admin.username, 'godmode1');
  });

  it('Should deactivate a user', async () => {
    await activateUser(user.username);
    await app
      .get(`/api/v1/users/deactivate/${user.id}`)
      .set('Authorization', adminToken)
      .expect(204);
    const updatedUser = await getCustomRepository(UserRepository).findByUsername(user.username);
    // eslint-disable-next-line no-unused-expressions
    expect(updatedUser.activated).to.be.false;
  });

  it('Should return 400 if deactivate itself', async () => {
    await app
      .get(`/api/v1/users/deactivate/${admin.id}`)
      .set('Authorization', adminToken)
      .expect(400);
  });

  it('Should return 403 not allowed error when not admin', async () => {
    await app
      .get(`/api/v1/users/deactivate/${admin.id}`)
      .set('Authorization', token)
      .expect(403);
  });

  it('Should return 401 when user is not activated', async () => {
    await deactivateUser(admin.username);

    const res = await app
      .get(`/api/v1/users/deactivate/${user.id}`)
      .set('Authorization', adminToken)
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is not valid', async () => {
    const res = await app
      .get(`/api/v1/users/deactivate/${user.id}`)
      .set('Authorization', 'wrong token')
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is missing', async () => {
    const res = await app.get(`/api/v1/users/deactivate/${user.id}`).expect(401);

    expect(res.body.code).equals(30002);
  });
});
