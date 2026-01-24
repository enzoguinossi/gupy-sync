# Instalação

## Requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 24 ou superior recomendada)
- **npm** (vem com o Node)

Para verificar:
```bash
node -v
npm -v
```
## Clonando o repositório

```bash
git clone https://github.com/enzoguinossi/gupy-linkedin-sync
cd gupy-linkedin-sync
```
## Instalando dependências
```bash
npm install
```
## Configurando o ambiente
1. Crie um arquivo .env na raiz do projeto
2. Adicione a variável abaixo:
```dotenv
GUPY_TOKEN=cole_aqui_o_candidate_secure_token
```
Exemplo: 
```dotenv
GUPY_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
>🔐 O token é obtido seguindo este guia:
> -  [Como obter o token da Gupy](./gupy-token.md)

# Testando se está tudo funcionando
Execute:
```bash
npm run dev -- show-certificates
```
Se o token estiver correto, o CLI irá:
1. Autenticar na Gupy
2. Buscar seus achievements
3. Exibir o JSON no terminal

⚠️ Se houver erro de autenticação, uma mensagem clara será exibida. ⚠️

