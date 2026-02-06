// test/notes.test.js
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../server.js';
import mongoose from 'mongoose';
import { User } from '../src/models/user.model.js';
import { Note } from '../src/models/note.model.js';

describe('Notes API Tests', () => {
  let accessToken;
  let userId;

  // Connect to test database before all tests
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glassnotes-test');
  });

  // Create a test user and login before each test
  beforeEach(async () => {
    // Clean database
    await User.deleteMany({});
    await Note.deleteMany({});

    // Create and login user
    const user = await User.create({
      username: 'testuser',
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      avatar: 'https://example.com/avatar.jpg'
    });

    userId = user._id;

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });

    accessToken = loginRes.body.data.accessToken;
  });

  // Disconnect after all tests
  after(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/notes', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app)
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note content'
        });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('title', 'Test Note');
      expect(res.body.data).to.have.property('content', 'This is a test note content');
      expect(res.body.data).to.have.property('owner');
    });

    it('should fail if title is missing', async () => {
      const res = await request(app)
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Content without title'
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('should fail if content is missing', async () => {
      const res = await request(app)
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Title without content'
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/notes')
        .send({
          title: 'Test Note',
          content: 'Test Content'
        });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('GET /api/v1/notes', () => {
    beforeEach(async () => {
      // Create some test notes
      await Note.create([
        {
          owner: userId,
          title: 'Note 1',
          content: 'Content 1',
          isFavorite: false,
          isArchived: false
        },
        {
          owner: userId,
          title: 'Note 2',
          content: 'Content 2',
          isFavorite: true,
          isArchived: false
        },
        {
          owner: userId,
          title: 'Note 3',
          content: 'Content 3',
          isFavorite: false,
          isArchived: true
        }
      ]);
    });

    it('should fetch all notes for authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/notes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
      expect(res.body.data).to.have.lengthOf(3);
    });

    it('should filter favorite notes', async () => {
      const res = await request(app)
        .get('/api/v1/notes?favorite=true')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.lengthOf(1);
      expect(res.body.data[0].isFavorite).to.be.true;
    });

    it('should filter archived notes', async () => {
      const res = await request(app)
        .get('/api/v1/notes?archived=true')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.lengthOf(1);
      expect(res.body.data[0].isArchived).to.be.true;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/notes');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('GET /api/v1/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        owner: userId,
        title: 'Test Note',
        content: 'Test Content'
      });
      noteId = note._id;
    });

    it('should fetch a specific note by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.title).to.equal('Test Note');
    });

    it('should fail if note does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/notes/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .get(`/api/v1/notes/${noteId}`);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('PUT /api/v1/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        owner: userId,
        title: 'Original Title',
        content: 'Original Content'
      });
      noteId = note._id;
    });

    it('should update a note successfully', async () => {
      const res = await request(app)
        .put(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.title).to.equal('Updated Title');
      expect(res.body.data.content).to.equal('Updated Content');
    });

    it('should fail if note does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/notes/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        });

      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .put(`/api/v1/notes/${noteId}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('DELETE /api/v1/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        owner: userId,
        title: 'Note to Delete',
        content: 'Content'
      });
      noteId = note._id;
    });

    it('should delete a note successfully', async () => {
      const res = await request(app)
        .delete(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;

      // Verify note is deleted
      const deletedNote = await Note.findById(noteId);
      expect(deletedNote).to.be.null;
    });

    it('should fail if note does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/v1/notes/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/v1/notes/${noteId}`);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('PATCH /api/v1/notes/:id/favorite', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        owner: userId,
        title: 'Test Note',
        content: 'Test Content',
        isFavorite: false
      });
      noteId = note._id;
    });

    it('should toggle favorite status to true', async () => {
      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}/favorite`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.isFavorite).to.be.true;
    });

    it('should toggle favorite status to false', async () => {
      // First, set to favorite
      await Note.findByIdAndUpdate(noteId, { isFavorite: true });

      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}/favorite`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.isFavorite).to.be.false;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}/favorite`);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('PATCH /api/v1/notes/:id/archive', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        owner: userId,
        title: 'Test Note',
        content: 'Test Content',
        isArchived: false
      });
      noteId = note._id;
    });

    it('should archive a note', async () => {
      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}/archive`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.isArchived).to.be.true;
    });

    it('should unarchive a note', async () => {
      // First, set to archived
      await Note.findByIdAndUpdate(noteId, { isArchived: true });

      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}/archive`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.isArchived).to.be.false;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}/archive`);

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('GET /api/v1/notes/search', () => {
    beforeEach(async () => {
      // Create notes with searchable content
      await Note.create([
        {
          owner: userId,
          title: 'JavaScript Tutorial',
          content: 'Learn JavaScript programming'
        },
        {
          owner: userId,
          title: 'Python Guide',
          content: 'Python programming basics'
        },
        {
          owner: userId,
          title: 'React Framework',
          content: 'Building apps with React'
        }
      ]);
    });

    it('should search notes by title', async () => {
      const res = await request(app)
        .get('/api/v1/notes/search?q=JavaScript')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.lengthOf(1);
      expect(res.body.data[0].title).to.include('JavaScript');
    });

    it('should search notes by content', async () => {
      const res = await request(app)
        .get('/api/v1/notes/search?q=programming')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.lengthOf(2);
    });

    it('should return empty array if no matches', async () => {
      const res = await request(app)
        .get('/api/v1/notes/search?q=NonExistent')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.lengthOf(0);
    });

    it('should fail if search query is missing', async () => {
      const res = await request(app)
        .get('/api/v1/notes/search')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('should fail if not authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/notes/search?q=test');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });
});