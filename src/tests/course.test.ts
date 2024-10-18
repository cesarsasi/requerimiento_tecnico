import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { User } from '../models/userModel';

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

describe('Course Controller', () => {
  let token: string;
  let courseId: number;
  let userId: number;

  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@eclass.com', password: 'PassWord123&' });
    token = response.body.token;

    const user = new User();
    user.email = 'testuser@eclass.com';
    user.name = 'testUser'
    user.password = 'PassWord123&';
    await user.save();
    userId = user.id;
  });

  afterAll(async () => {
    await User.delete({ id: userId });
  });

  it('should create a new course', async () => {
    const response = await request(app)
      .post('/course')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Course', description: 'This is a test course' });
    expect(response.statusCode).toBe(201);
    expect(response.body.course).toBeDefined();
    courseId = response.body.course.id;
  });

  it('should fail to create a course without a name', async () => {
    const response = await request(app)
      .post('/course')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Missing name' });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should update the course', async () => {
    const response = await request(app)
      .put(`/course/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Course', description: 'Updated description' });
    expect(response.statusCode).toBe(200);
    expect(response.body.course.name).toBe('Updated Course');
  });

  it('should fail to update a non-existent course', async () => {
    const response = await request(app)
      .put('/course/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Non-existent', description: 'Does not exist' });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Course not found');
  });

  it('should assign a course to a user', async () => {
    const response = await request(app)
      .post(`/course/${courseId}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Course assigned to user successfully');
  });

  it('should fail to assign a non-existent course to a user', async () => {
    const response = await request(app)
      .post('/course/99999/assign')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Course or user not found');
  });

  it('should unassign a course from a user', async () => {
    const response = await request(app)
      .post(`/course/${courseId}/unassign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Course unassigned from user successfully');
  });

  it('should delete the course', async () => {
    const response = await request(app)
      .delete(`/course/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Course deleted successfully');
  });

  it('should fail to delete a non-existent course', async () => {
    const response = await request(app)
      .delete('/course/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Course not found');
  });
});
