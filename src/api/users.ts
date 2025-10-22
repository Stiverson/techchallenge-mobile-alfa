import axios from 'axios';
import { type AuthCredentials, type Role, type UserListItem } from '../types/auth';
import { API_URL } from './config';

type UserFromBackend = { _id: string; email: string; role: Role }; 


export async function apiFetchUsers(role: Role, token: string): Promise<UserListItem[]> {
  const response = await axios.get<UserFromBackend[]>(`${API_URL}/users/${role}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return response.data.map(user => ({ 
      id: user._id, 
      email: user.email,
      role: user.role,
  }));
}


export async function apiCreateUser(role: Role, data: AuthCredentials, token: string): Promise<UserListItem> {
  const payload = { ...data, role }; 
  const response = await axios.post<UserListItem>(`${API_URL}/users/${role}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}


export async function apiDeleteUser(role: Role, id: string, token: string): Promise<void> {
  await axios.delete(`${API_URL}/users/${role}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}


export async function apiUpdateUser(role: Role, id: string, data: any, token: string): Promise<UserListItem> {
  const response = await axios.put<UserFromBackend>(`${API_URL}/users/${role}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
 
  return {
    id: response.data._id,
    email: response.data.email,
    role: response.data.role,
  };
}