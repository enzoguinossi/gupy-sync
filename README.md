<img width="1280" height="640" alt="gupy-sync-logo" src="https://github.com/user-attachments/assets/bf258bbe-2bad-4884-9440-033e662ae731" />

# Gupy ↔ LinkedIn Achievements Sync (CLI)

Ferramenta em **Node.js + TypeScript** para **sincronizar certificados/cursos do LinkedIn com a Gupy**, utilizando o CSV oficial exportado pelo LinkedIn e a API privada da Gupy.

> ⚠️ Projeto educacional e experimental. Não é afiliado à Gupy nem ao LinkedIn.

---

## ✨ O que este projeto faz

- Lê o CSV de certificações exportado pelo LinkedIn
- Converte os dados para o formato de *Achievements* da Gupy
- Atualiza completamente seus achievements na Gupy via API
- Possui modo `--dry-run` para validar o parse sem alterar nada

---

## 🛠️ Tecnologias usadas

- **Node.js**
- **TypeScript**
- **Axios**
- **axios-cookiejar-support**
- **tough-cookie**
- **uDSV** (parser de CSV de alta performance)
- **commander** (CLI)

---

## 📥 Passo 1 — Baixar seus dados do LinkedIn

1. Acesse:  
   👉 https://www.linkedin.com/mypreferences/d/download-my-data

2. Selecione **Download the larger data archive**
3. Aguarde o e-mail do LinkedIn com o link de download
4. Extraia o `.zip` recebido
5. Dentro dele, localize o arquivo:

>Certifications.csv

---
## 🔐 Passo 2 — Obter o `candidate_secure_token` da Gupy

1. Acesse https://www.gupy.io e faça login normalmente
2. Abra o **Firefox DevTools**
   - `F12` → aba **Rede (Network)**
3. Recarregue a página
4. Procure qualquer requisição **GET** para:

> private-api.gupy.io

5. Clique nela → aba **Headers**
6. Procure por **Cookies**
7. Copie **somente o valor** de:

> candidate_secure_token=SEU_TOKEN_AQUI


⚠️ **Importante**
- Copie **apenas o valor**
- Não inclua `candidate_secure_token=`
- Não use aspas
- Não adicione espaços

---

## 📦 Passo 3 — Instalar o projeto

```bash
git clone https://github.com/enzoguinossi/gupy-linkedin-sync
cd gupy-linkedin-sync
npm install
```
---
## ⚙️ Passo 4 — Configurar o .env

1. Crie um arquivo .env na raiz do projeto
2. Coloque essa variável dentro do .env
> GUPY_TOKEN=cole_aqui_o_candidate_secure_token

❗ **Exemplo**
> GUPY_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
---
## ✅ Passo 5 — Testar se o token está correto

Antes de alterar qualquer dado, teste a conexão com a Gupy:
> npm run dev -- show-certificates

Se tudo estiver certo, o comando irá:
- Autenticar com a Gupy
- Buscar seus achievements atuais
- Imprimir o JSON no terminal
- ❌ Se o token estiver inválido, um erro claro será exibido.

---
## 🔄 Passo 6 — Importar certificados do LinkedIn
1. Coloque o arquivo Certifications.csv na raiz do projeto
2. Execute:
Modo seguro (recomendado primeiro)
> npm run dev -- import-linkedin --csv ./Certifications.csv --dry-run

Nesse modo:

- O CSV é validado
- Os dados são parseados
- O payload final é exibido
- ❌ Nenhuma alteração é enviada à Gupy

Modo normal (Atenção)
> npm run dev -- import-linkedin --csv ./Certifications.csv

⚠️ Esse comando substitui todos os achievements atuais da Gupy pelos dados do LinkedIn.
---
## 📌 Aviso legal
Este projeto:
- não utiliza APIs públicas oficiais
- depende de comportamento observado da API privada da Gupy
- pode parar de funcionar a qualquer momento
- Use por sua conta e risco.

> 🎉 **Desenvolvido por [Enzo Guinossi](https://www.linkedin.com/in/enzoguinossi/)** 🎉




