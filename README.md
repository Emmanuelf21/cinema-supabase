# 🎬 Absolute Cinema - Projeto Fullstack com Supabase

Sistema de compra de ingressos de cinema desenvolvido com React no frontend e Supabase como backend (banco de dados, autenticação e API).
O projeto consome também a API do TMDB para exibir informações atualizadas sobre os filmes.

# 🚀 Funcionalidades

- Autenticação de usuários com Supabase Auth.

- Associação entre usuario da tabela e credenciais do Supabase.

- Listagem de sessões disponíveis com:
  - Filme, descrição, classificação etária
  - Sala e horário
  - Cadeiras disponíveis ou ocupadas
  - Seleção de assentos em tempo real.

- Confirmação de compra com:
  - Inserção de ingresso na tabela ingresso
  - Alteração automática do status da cadeira (status_filme → "Ocupado")

- Área Meus Ingressos:
  - Lista todos os ingressos do usuário logado
  - Exibe informações de filme, sala, horário e assento

# 🛠️ Tecnologias

<b>Frontend</b>
- React (Vite)
- Supabase JS Client
- React Router
- TMDB API

<b>Backend</b>
- Supabase (Postgres + Auth)

<b>Deploy</b>
- Vercel (Frontend)
[Deploy](https://cinema-supabase.vercel.app)

# 📂 Estrutura do Banco de Dados
<img width="1533" height="793" alt="image" src="https://github.com/user-attachments/assets/64d60eef-9e69-43b0-906e-545e94bd7328" />

# ⚙️ Configuração do Projeto
1. Clone o repositório
   ```
   git clone https://github.com/seu-usuario/cinema-supabase.git
   cd cinema-supabase
   ```
   
 2. Instale as dependências
    ```
    npm install
    ```
    
3. Configure variáveis de ambiente
Crie um arquivo .env na raiz com:
    ```
    VITE_SUPABASE_URL=https://xxxx.supabase.co
    VITE_SUPABASE_KEY=chave_publica_aqui
    VITE_API_MOVIE=https://api.themoviedb.org/3/movie/
    VITE_API_KEY=api_key_tmdb_aqui
    VITE_IMG=https://image.tmdb.org/t/p/w500/
    ```
    
4. Rode o projeto
    ```
    npm run dev
    ```

# 👨‍💻 Fluxo de Uso

1. Usuário faz login/cadastro via Supabase Auth.

2. Na tela de Sessões, escolhe o filme, horário e assentos.

3. Ao confirmar compra:
   - ingresso é criado.
   - status_filme da cadeira muda para "Ocupado".

4. Na área Meus Ingressos, o usuário pode visualizar todos os ingressos comprados.
