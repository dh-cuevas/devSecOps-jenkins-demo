const request = require('supertest');
const { app, server } = require('./app');

describe('App Tests', () => {
  afterAll((done) => {
    server.close(done);
  });

  test('GET / should return Hello World message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello World - DevSecOps Demo!');
  });

  test('GET /health should return healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});