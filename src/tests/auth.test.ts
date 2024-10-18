import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';

beforeAll(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Error during Data Source initialization', error);
  }
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Auth Controller', () => {
  it('Login successfully', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({email: 'admin@eclass.com', password: 'PassWord123&'});
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('Login wrong credenctials.', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'alumno1@eclass.com', password: 'WrongPassword'});
    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('Login wrong json', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', passord: 'wrongpassword' });
    expect(response.status).toBe(404);
  });
});

describe('Protected-route (authenticate)', () => {
  it('Return 401 code, if no token is provided', async () => {
    const response = await request(app).get('/user');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'No token, access denied' });
  });

  it('should return 401 if token is invalid', async () => {
    const invalidToken = 'invalidtoken';
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid token' });
  });

  it('should return 200 if token is valid', async () => {
    const respToken = await request(app)
    .post('/auth/login')
    .send({email: 'admin@eclass.com', password: 'PassWord123&'});
    const token = respToken.body.token;

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe('GET /admin-route (authorize)', () => {
  it('should return 403 if user does not have the right role', async () => {
    const respToken = await request(app)
    .post('/auth/login')
    .send({email: 'alumno1@eclass.com', password: 'PassWord123&'});
    const token = respToken.body.token;

    const response = await request(app)
      .post('/course')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Access denied' });
  });

  it('should return 200 if user has the right role', async () => {
    const respToken = await request(app)
    .post('/auth/login')
    .send({email: 'admin@eclass.com', password: 'PassWord123&'});
    const token = respToken.body.token;

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

