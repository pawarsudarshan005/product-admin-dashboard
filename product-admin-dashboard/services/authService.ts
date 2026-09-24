import { api } from "@/lib/api";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}
