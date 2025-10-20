export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  role: 'professor' | 'aluno';
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserData | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}