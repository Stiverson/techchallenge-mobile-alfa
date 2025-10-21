export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  __v?: number;
}

export interface Comunicacao {
  id: string;
  titulo: string;
  autor: string;
  tipo: string; 
  descricao: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface ComunicacaoForm {
  titulo: string;
  descricao: string;
  autor: string;
  tipo: string;
}