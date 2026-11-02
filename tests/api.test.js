import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server/app.js';
import { db, resetDatabase } from '../server/db.js';

describe('Secure Application Integration API', () => {
  beforeAll(() => resetDatabase());
  afterAll(() => db.close());

  it('returns internship records for the frontend', async () => {
    const response = await request(app).get('/api/internships');
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.pagination.total).toBeGreaterThan(0);
  });

  it('filters internships using query parameters', async () => {
    const response = await request(app).get('/api/internships?category=Design');
    expect(response.status).toBe(200);
    expect(response.body.data.every(item => item.category === 'Design')).toBe(true);
  });

  it('rejects invalid application data', async () => {
    const response = await request(app).post('/api/applications').send({ internshipId: 1, email: 'not-an-email' });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
  });

  it('rejects an application for a missing internship', async () => {
    const response = await request(app).post('/api/applications').send({
      internshipId: 99999, fullName: 'Test Candidate', email: 'test@example.com',
      phone: '+91 9876543210', college: 'Test College', skills: 'React, SQL',
      coverNote: 'I am interested in this internship role.'
    });
    expect(response.status).toBe(404);
  });

  it('creates a valid application and returns a reference ID', async () => {
    const response = await request(app).post('/api/applications').send({
      internshipId: 1, fullName: 'Test Candidate', email: 'candidate@example.com',
      phone: '+91 9876543210', college: 'Test Engineering College', skills: 'React, JavaScript, SQL',
      coverNote: 'I would like to contribute and learn from this engineering team.'
    });
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeTypeOf('number');
    expect(response.body.data.status).toBe('Submitted');
  });

  it('sets security headers and hides Express fingerprint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
