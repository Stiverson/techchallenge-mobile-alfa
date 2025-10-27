import axios from 'axios';
import { ComunicacaoForm, type Comunicacao, type Post } from '../types/comunicacao';
import { API_URL } from './config';

function mapPostToComunicacao(post: Post): Comunicacao {
  return {
    id: post._id,
    titulo: post.title,
    autor: post.author,
    tipo: post.tipo,
    descricao: post.content,
    dataCriacao: new Date(post.createdAt),
    dataAtualizacao: new Date(post.createdAt),
  };
}

/**
 * Busca todos os posts (Comunicações) do backend.
 * @returns Array de Comunicacoes.
 */
export async function apiFetchPosts(): Promise<Comunicacao[]> {
  const response = await axios.get<Post[]>(`${API_URL}/posts`);
  return response.data.map(mapPostToComunicacao);
}


export async function apiCreatePost(data: ComunicacaoForm, token: string): Promise<Comunicacao> {
  const response = await axios.post<Post>(`${API_URL}/posts`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return mapPostToComunicacao(response.data);
}

export async function apiUpdatePost(id: string, data: ComunicacaoForm, token: string): Promise<Comunicacao> {
  const response = await axios.put<Post>(`${API_URL}/posts/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return mapPostToComunicacao(response.data);
}

export async function apiDeletePost(id: string, token: string): Promise<void> {
  await axios.delete(`${API_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}