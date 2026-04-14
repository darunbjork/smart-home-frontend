import type { LoginDto, RegisterDto, User } from "../types/auth.types";

// Placeholder for API calls. In a real app, this would use fetch or axios.
const authApi = {
  login: async (dto: LoginDto): Promise<{ accessToken: string; user: User }> => {
    console.log("Auth API login called with:", dto);
    // Simulate API call
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
    console.log("Auth API logout called");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
  },
  register: async (dto: RegisterDto): Promise<void> => {
    console.log("Auth API register called with:", dto);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  // Added refresh method
  refresh: async (): Promise<{ accessToken: string }> => {
    console.log("Auth API refresh token called");
    // Simulate API call for refreshing token
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would call a dedicated refresh endpoint
    // and return a new access token.
    // For simulation, let's return a new dummy token.
    const newAccessToken = `refreshed-dummy-access-token-${Date.now()}`;
    return { accessToken: newAccessToken };
  },
};

export { authApi };
