/**
 * Mock data for Signup API
 */

import { mockAccessToken, mockUser } from "../shared";

export const mockSignupResponse = {
  data: {
    user: mockUser,
    accessToken: mockAccessToken,
  },
  status: 201,
};
