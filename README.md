# Piscord – Chat em Tempo Real Full Stack 🚀

Aplicação inspirada em plataformas de chat, utilizando Angular no frontend, Go (com Gorilla Toolkit) no backend e MongoDB para armazenamento. Projeto avançado para mostrar integração real-time, autenticação e arquitetura escalável na prática.

## 🚩 Motivação do Projeto

Criado para aprender na prática como unir Angular, Go e MongoDB em uma aplicação real-time robusta. Ideal como showcase para recrutadores e times técnicos que buscam desenvolvedores com domínio em soluções web modernas e comunicação instantânea.

## ✨ Funcionalidades

- Autenticação básica de usuários (JWT)
- Chat em tempo real por WebSocket
- Lista de conversas e usuários online
- Persistência de mensagens, salas e notificações no MongoDB
- CRUD de usuários, mensagens, salas e notificações
- Interface responsiva e otimizada em Angular
- Backend estruturado com Gorilla Mux (Go)
- Separação entre camadas: API, sockets, serviços e modelos

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Angular 17+, TypeScript, RxJS, Angular Material, PrimeNG
- **Backend:** Go 1.21+, Gorilla Mux/WS, Gin, Middleware customizado, WebSocket
- **Banco de Dados:** MongoDB Atlas
- **Autenticação:** JWT (JSON Web Tokens)
- **Testes:** Go Test (backend)

## 🚀 Como Executar

Esta aplicação utiliza Docker e Docker Compose para automatizar o setup do ambiente, facilitando a reprodução por outros usuários.

### Pré-requisitos

- Docker instalado ([Get Docker](https://docs.docker.com/get-started/get-docker/))
- Docker Compose

### Passos para execução

1. Abrir o projeto:

```bash
git clone https://github.com/davmp/piscord-chat-app.git

// Entrar na pasta do projeto
cd /piscord-chat-app
```

2. Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

3. Preencha o `.env` com seus próprios valores (JWT secret, URLs etc.)

4. Execute o seguinte comando para iniciar os serviços (frontend, backend e banco MongoDB):

```bash
docker compose up --build -d
```

5. A aplicação Angular estará disponível por padrão em http://localhost:4200 e a API backend em http://localhost:8000.

6. Para parar os serviços:

```bash
docker compose down

// Deletar os containers e imagens criados
docker compose rm -f
```

## 🔒 Configuração de Ambiente

### Gerando uma chave secreta JWT

Para criar uma chave aleatória e segura para o JWT no console:

### Usando Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e coloque no campo `JWT_SECRET` do seu `.env`.

### Usando OpenSSL

```bash
openssl rand -base64 32
```

Copie a saída e utilize como sua chave secreta.
