// test/auth.test.js
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../server.js';
import mongoose from 'mongoose';
import { User } from '../src/models/user.model.js';

describe('Auth API Tests', () => {
  
  // Connect to test database before all tests
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glassnotes-test');
  });

  // Clean up database after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect after all tests
  after(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .field('username', 'testuser')
        .field('fullName', 'Test User')
        .field('email', 'test@example.com')
        .field('password', 'Password123!')
        .attach('avatar', Buffer.from('fake-image'), 'avatar.jpg');

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('username', 'testuser');
      expect(res.body.data).to.have.property('email', 'test@example.com');
      expect(res.body.data).to.not.have.property('password');
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com'
          // missing password
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('should fail if user already exists', async () => {
      // First registration
      await User.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        avatar: 'https://example.com/avatar.jpg'
      });

      // Try to register again
      const res = await request(app)
        .post('/api/v1/auth/register')
        .field('username', 'testuser')
        .field('fullName', 'Test User')
        .field('email', 'test@example.com')
        .field('password', 'Password123!')
        .attach('avatar', Buffer.from('fake-image'), 'avatar.jpg');

      expect(res.status).to.equal(409);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.include('already exists');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await User.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        avatar: 'https://example.com/avatar.jpg'
      });
    });

    it('should login user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('user');
      expect(res.body.data).to.have.property('accessToken');
      expect(res.body.data).to.have.property('refreshToken');
      expect(res.headers['set-cookie']).to.exist;
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'Password123!'
        });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });

    it('should fail with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!'
        });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });

    it('should fail if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com'
          // missing password
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    let accessToken;

    beforeEach(async () => {
      // Create and login a user
      const user = await User.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        avatar: 'https://example.com/avatar.jpg'
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      accessToken = loginRes.body.data.accessToken;
    });

    it('should logout user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        avatar: 'https://example.com/avatar.jpg'
      });
    });

    it('should send password reset email for valid user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'test@example.com'
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });

    it('should return success even for non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });

    it('should fail if email is missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });
  });

  describe('POST /api/v1/auth/reset-password/:token', () => {
    let resetToken;
    let user;

    beforeEach(async () => {
      user = await User.create({
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        avatar: 'https://example.com/avatar.jpg'
      });

      // Generate reset token
      resetToken = user.generatePasswordResetToken();
      await user.save({ validateBeforeSave: false });
    });

    it('should reset password with valid token', async () => {
      const res = await request(app)
        .post(`/api/v1/auth/reset-password/${resetToken}`)
        .send({
          password: 'NewPassword123!'
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/reset-password/invalidtoken123')
        .send({
          password: 'NewPassword123!'
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('should fail if password is too short', async () => {
      const res = await request(app)
        .post(`/api/v1/auth/reset-password/${resetToken}`)
        .send({
          password: '123'
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });
  });
});