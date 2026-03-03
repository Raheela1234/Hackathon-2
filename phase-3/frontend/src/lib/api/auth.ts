import apiClient from './client';

interface SignPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

export async function signUp(data: SignPayload): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/auth/signup', data);
  return res.data;
}

export async function signIn(data: SignPayload): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/auth/signin', data);
  return res.data;
}
