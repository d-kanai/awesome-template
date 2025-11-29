/**
 * Mock data for Signin API
 */

import { mockAccessToken, mockUser } from "../shared";

export const mockSigninResponse = {
  data: {
    user: mockUser,
    accessToken: mockAccessToken,
  },
  status: 200,
};
