import axios from 'axios';
import { AuthCredentials } from '../types/auth';
import { API_URL } from './config';

export async function apiLogin(credentials: AuthCredentials): Promise<{ token: string }> {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
}

export type Role = 'professor' | 'aluno'; 


export type UserListItem = { id: string; email: string; role: Role };

export interface UserData {
  id: string;
  email: string;
  role: Role;
}

