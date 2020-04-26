import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import supertest, { SuperTest, Test } from 'supertest';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../../../../../src/db/relational/repositories/user';
import { setAdminMode, truncateTables } from '../../../database-utils';
import { createUserTest, getLoginToken, testServer, deactivateUser } from '../../../server-utils';

describe('DELETE /api/v1/users/:id', () => {
  const app: SuperTest<Test> = supertest(testServer);
  beforeEach(async () => {
    await truncateTables(['user']);
  });

  it('Should delete a user', async () => {
    await createUserTest({
      username: 'god1@gmail.com',
      password: 'godmode1'
    });

    await setAdminMode('god1@gmail.com');
    const adminToken = await getLoginToken('god1@gmail.com', 'godmode1');

    const user = await createUserTest({
      username: 'user1@gmail.com',
      password: 'test1'
    });

    await app
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', adminToken)
      .expect(204);

    const users = await getCustomRepository(UserRepository).findAll();
    expect(users.length).eql(1);
    expect(users[0].username).eql('god1@gmail.com');
  });

  it('Should return 403 not allowed error when not admin', async () => {
    await createUserTest({
      username: 'god@gmail.com',
      password: 'godmode'
    });

    const user = await createUserTest({
      username: 'dude@gmail.com',
      password: 'test'
    });

    const token = await getLoginToken('god@gmail.com', 'godmode');

    await app
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', token)
      .expect(403);
  });

  it('Should return 401 when user is not activated', async () => {
    await createUserTest({
      username: 'god@gmail.com',
      password: 'godmode'
    });

    await setAdminMode('god@gmail.com');
    const adminToken = await getLoginToken('god@gmail.com', 'godmode');

    const user = await createUserTest({
      username: 'user@gmail.com',
      password: 'test'
    });

    await deactivateUser('god@gmail.com');

    const res = await app
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', adminToken)
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is not valid', async () => {
    const user = await createUserTest({
      username: 'user@gmail.com',
      password: 'test'
    });
    const res = await app
      .delete(`/api/v1/users/${user.id}`)
      .set('Authorization', 'wrong token')
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is missing', async () => {
    const user = await createUserTest({
      username: 'user@gmail.com',
      password: 'test'
    });
    const res = await app.delete(`/api/v1/users/${user.id}`).expect(401);

    expect(res.body.code).equals(30002);
  });
});
