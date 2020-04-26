import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import supertest, { SuperTest, Test } from 'supertest';
import { truncateTables } from '../../../database-utils';
import { createUserTest, getLoginToken, testServer, deactivateUser } from '../../../server-utils';

describe('GET /api/v1/users/createapikey', () => {
  const app: SuperTest<Test> = supertest(testServer);
  let token: string;

  beforeEach(async () => {
    await truncateTables(['user']);

    const user = {
      username: 'dude@gmail.com',
      password: 'test'
    };

    await createUserTest(user);
    token = await getLoginToken('dude@gmail.com', 'test');
  });

  it('Should create a api-key and return it in data with 200', async () => {
    const res = await app
      .get('/api/v1/users/createapikey')
      .set({ Authorization: token })
      .expect(200);

    expect(res.body).include({
      message: 'success'
    });
    expect(res.body).to.have.property('data');
  });

  it('Should return 401 when user is not activated', async () => {
    await deactivateUser('dude@gmail.com');
    const res = await app
      .get('/api/v1/users/createapikey')
      .set('Authorization', token)
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is not valid', async () => {
    const res = await app
      .get('/api/v1/users/createapikey')
      .set('Authorization', 'wrong token')
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it('Should return 401 when token is missing', async () => {
    const res = await app.get('/api/v1/users/createapikey').expect(401);
    expect(res.body.code).equals(30002);
  });
});
