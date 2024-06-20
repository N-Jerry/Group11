const request = require('supertest');
const app = require('./server'); // Adjust the path to your server file

describe('Security Testing', () => {
  it('should prevent XSS attacks', async () => {
    // Test XSS attack through input field
    const maliciousInput = `<script>alert('XSS Attack!');</script>`;
    const response = await request(app)
      .post('/api/main/courses')
      .send({ userInput: maliciousInput })
      .expect(500);
  });

  it('should restrict unauthorized access', async () => {
    // Test unauthorized access to a restricted endpoint
    const response = await request(app)
      .delete('/api/auth')
      .expect(401);

    // Assert that unauthorized access is properly restricted
    expect(response.body.error).toBe('Authorization token required');
  });

});
