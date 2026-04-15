import type { LoginDto, User } from "../types/auth.types";

const authApi = {
  login: async (dto: LoginDto): Promise<{ accessToken: string; user: User }> => {

    await new Promise(resolve => setTimeout(resolve, 500));
    // Return dummy data
    return {
      accessToken: "dummy-access-token",
      user: {
        id: "user-123",
        username: "testuser",
        email: dto.email,
      },
    };
  },
  logout: async (): Promise<void> => {

    await new Promise(resolve => setTimeout(resolve, 200));
  },
  register: async (): Promise<void> => {

    await new Promise(resolve => setTimeout(resolve, 500));
  },
  refresh: async (): Promise<{ accessToken: string }> => {

    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would call a dedicated refresh endpoint
    // and return a new access token.
    // For simulation, let's return a new dummy token.
    const newAccessToken = `refreshed-dummy-access-token-${Date.now()}`;
    return { accessToken: newAccessToken };
  },
};

export { authApi };
