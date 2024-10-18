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

describe('User Controller', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@eclass.com', password: 'PassWord123&' });
    token = response.body.token;
  });

  it('should create a new user', async () => {
    const milisegundosFecha = new Date().toISOString().replace(/[:T.Z]/g, '');
    const response = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: `testuser${milisegundosFecha}@eclass.com`, name: 'Test User', password: 'PassWord123&', role: 'alumno' });
    expect(response.statusCode).toBe(201);
    expect(response.body.user).toBeDefined();
    userId = response.body.user.id;
  });

  it('should not create a user with an existing email', async () => {
    const response = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: `alumno1@eclass.com`, name: 'Test User', password: 'PassWord123&', role: 'alumno' });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('The email is already registered.');
  });

  it('should update a user', async () => {
    const milisegundosFecha = new Date().toISOString().replace(/[:T.Z]/g, '');
    const response = await request(app)
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `testuser${milisegundosFecha}`, role: 'alumno', password: 'PassWord12388&', });
    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toBe(`testuser${milisegundosFecha}`);
    expect(response.body.user.role).toBe('alumno');
  });

  it('should not update a non-existent user', async () => {
    const response = await request(app)
      .put('/user/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Non-existent User' });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should delete a user', async () => {
    const response = await request(app)
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });

  it('should not delete a non-existent user', async () => {
    const response = await request(app)
      .delete('/user/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should list all users', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.users).toBeInstanceOf(Array);
  });
});
