# 🚀 Challenge Mobile Alfa - Sistema de Comunicações

Este projeto é o Front-end Mobile da Fase 4 do Tech Challenge, desenvolvido com **React Native (Expo)**. Ele se integra ao nosso backend Node.js para fornecer um sistema completo de gestão de comunicações e usuários.

## ✨ Status do Projeto (Fase 4)

| Requisito | Status | Observações |
| :--- | :--- | :--- |
| **CRUD de Posts** | ✅ Completo | Criação, Edição, Deleção e Visualização de posts. |
| **CRUD de Usuários** | ✅ Completo | Implementada a interface de listagem, adição e exclusão de **Professores** e **Alunos**. |
| **Autenticação/Autorização** | ✅ Completo | Login com JWT e restrição de acesso (403 Forbidden) para usuários sem permissão de Professor. |
| **Interface (Figma)** | 📐 Quase Completo | Estilos e estrutura modular implementados. Necessita apenas do ajuste fino do layout. |

---

## 🛠️ Setup Completo da Aplicação (Backend + Frontend)

Para rodar o projeto mobile, o backend deve estar ativo na porta 3001.

### 1. Pré-requisitos
- **Repositório Backend:** Clonar e rodar o [Blog Backend API v2](https://github.com/Stiverson/blog-backend-v2).
- Docker e Docker Compose instalados.
- Node.js e npm.
- App **Expo Go** instalado no celular/emulador.

### 2. Configuração do Backend (API)

1.  **Inicie os serviços de Backend e Banco de Dados:**
    ```bash
    # Na pasta do backend (blog-backend-v2):
    docker-compose up --build -d
    ```

2.  **Popule o Banco de Dados (Usuários de Teste):**
    ```bash
    # Execute o seeder para criar posts, professor e aluno:
    docker-compose run --rm backend node seed.js
    ```
    * **Professor:** `professor@alfa.com` / `senha123`
    * **Aluno:** `aluno@alfa.com` / `senha123`

### 3. Configuração e Inicialização do Frontend Mobile

1.  **Clone o Repositório Mobile:**
    ```bash
    # Na pasta do frontend:
    git clone [https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa.git](https://github.com/Gabriel300p/challenge-3-centro-educacional-alfa.git)
    cd challenge-3-centro-educacional-alfa
    ```

2.  **Ajuste a URL da API:**
    * No arquivo **`src/api/config.ts`**, configure a URL com o **IP V4 da sua máquina** (Ex: `10.0.0.150` ou IP do Host) e a porta **3001**.
        ```typescript
        export const API_URL = `http://SEU_IP_V4:3001`; 
        ```

3.  **Instale Dependências e Inicie:**
    ```bash
    npm install
    npx expo start
    ```
    * Escaneie o QR Code com o Expo Go para iniciar o aplicativo.

---

## 💻 Guia de Uso

1.  **Tela de Login:** A aplicação inicia no Login. Use as credenciais de teste.
2.  **Comunicações:** Acesse a lista de posts.
    * **Professor:** Botões de `+ Nova Comunicação`, Edição (lápis) e Exclusão (lixeira) estão visíveis.
    * **Aluno:** Apenas visualiza a lista.
3.  **Administração:** Aba restrita para Professor.
    * Permite navegar para **Gerenciar Professores** e **Gerenciar Alunos** (CRUD).

## 📁 Estrutura do Projeto Mobile

*O projeto segue uma arquitetura modular com separação clara de responsabilidades.*

src/

├── api/          # Configuração e chamadas REST (posts, users, auth)

├── components/   # Componentes reutilizáveis (Header, PostCard)

├── context/      # AuthProvider (Gerenciamento de autenticação com AsyncStorage)

├── navigation/   # AppNavigator, TabNavigator (Fluxo de navegação)

├── screens/      # Telas principais (LoginScreen, PostsListScreen, UserListScreen)

│   ├── Admin/

│   ├── Auth/

│   └── Posts/

└── types/        # Tipagem com TypeScript (Role, UserData)