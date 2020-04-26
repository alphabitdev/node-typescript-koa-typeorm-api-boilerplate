import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import supertest, { SuperTest, Test } from 'supertest';
import { truncateTables } from '../../../database-utils';
import { createUserTest, testServer, deactivateUser } from '../../../server-utils';

describe('POST /api/v1/users/login', () => {
  const app: SuperTest<Test> = supertest(testServer);
  beforeEach(async () => {
    await truncateTables(['user']);

    const user = {
      username: 'dude@gmail.com',
      password: 'test'
    };

    await createUserTest(user);
  });

  it('Should return a valid token', async () => {
    const res = await app
      .post('/api/v1/users/login')
      .send({ username: 'dude@gmail.com', password: 'test' })
      .expect(200);

    expect(res.body).keys(['accessToken']);
  });

  it('Should return 400 when non existant username', async () => {
    const res = await app
      .post('/api/v1/users/login')
      .send({ username: 'nope', password: 'test' })
      .expect(400);

    expect(res.body.code).equals(30000);
    expect(res.body.message).eql('Wrong credentials');
  });
  it('Should return 400 when wrong password', async () => {
    const res = await app
      .post('/api/v1/users/login')
      .send({ username: 'dude@gmail.com', password: 'wrong' })
      .expect(400);

    expect(res.body.code).equals(30000);
    expect(res.body.message).eql('Wrong credentials');
  });

  it('Should return 400 when missing password', async () => {
    const res = await app
      .post('/api/v1/users/login')
      .send({ username: 'dude@mail.com' })
      .expect(400);

    expect(res.body.code).equals(30001);
    expect(res.body.fields.length).equals(1);
    expect(res.body.fields[0].message).eql('"password" is required');
  });

  it('Should return 400 when user is not activated', async () => {
    await deactivateUser('dude@gmail.com');
    const res = await app
      .post('/api/v1/users/login')
      .send({ username: 'dude@gmail.com', password: 'test' })
      .expect(401);

    expect(res.body.code).equals(30004);
    expect(res.body.message).eql('User not activated');
  });
});
