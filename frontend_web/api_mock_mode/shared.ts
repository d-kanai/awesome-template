/**
 * Shared mock data used across multiple APIs
 */

export const mockUser = {
  id: "mock-user-id",
  name: "Mock User",
  email: "mock@example.com",
};

// Mock JWT token (header.payload.signature format)
// Payload: { sub: "mock-user-id", email: "mock@example.com", iat: 1700000000 }
const mockJwtPayload = Buffer.from(
  JSON.stringify({
    sub: "mock-user-id",
    email: "mock@example.com",
    iat: 1700000000,
  }),
).toString("base64");

export const mockAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${mockJwtPayload}.mock-signature`;
