import { api } from "./axios";
import type { LoginDto, RegisterDto, User } from "../types/auth.types";

export const authApi = {
  login: async (dto: LoginDto): Promise<{ accessToken: string; user: User }> => {
    const response = await api.post("/users/login", dto);
    return {
      accessToken: response.data.accessToken,
      user: response.data.user,
    };
  },

  register: async (dto: RegisterDto): Promise<void> => {
    const baseUsername = dto.username || dto.email.split("@")[0];
    const uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;
    await api.post("/users/register", {
      username: uniqueUsername,
      email: dto.email,
      password: dto.password,
      householdName: "My Home",
    });
  },
  logout: async (): Promise<void> => {
    await api.post("/users/logout");
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await api.get("/users/refresh");
    return { accessToken: response.data.accessToken };
  },
};
