<img width="1280" height="640" alt="gupy-sync-logo" src="https://github.com/user-attachments/assets/bf258bbe-2bad-4884-9440-033e662ae731" />

# Gupy ↔ LinkedIn Achievements Sync (CLI)

Ferramenta CLI em **Node.js + TypeScript** para **sincronizar certificados, cursos e formações do LinkedIn com a Gupy**, utilizando o CSV oficial exportado pelo LinkedIn e a API privada da Gupy.

> ⚠️ Projeto educacional e experimental.  
> Não é afiliado à Gupy nem ao LinkedIn.

---

## ✨ O que este projeto faz

- Importa **certificados (achievements)** a partir do CSV do LinkedIn
- Importa **formação acadêmica** (educação)
- Converte os dados para o formato aceito pela Gupy
- Substitui completamente os dados existentes na Gupy
- Suporta **modo interativo via CLI** quando há dados ambíguos
- Possui modo `--dry-run` para validação segura antes de aplicar

---

## 🛠️ Tecnologias usadas

- Node.js
- TypeScript
- Axios
- axios-cookiejar-support
- tough-cookie
- uDSV (parser de CSV)
- commander
- @inquirer/prompts

---

## 📚 Documentação

- 📥 [Como baixar seus dados do LinkedIn](docs/linkedin-export.md)
- 🔐 [Como obter o token da Gupy](docs/gupy-token.md)
- ⚙️ [Instalação](docs/instalacao.md)
- 🚀 [Como usar o CLI](docs/uso.md)

---

## ⚠️ Observação importante

Após a sincronização, é **altamente recomendável** revisar/reselecionar os títulos de cursos e instituições diretamente na Gupy, reescrevendo-os para um formato mais legível e compatível com ferramentas de ATS (Sistema de Rastreamento de Candidatos).

---

## 📌 Aviso legal

Este projeto:
- não utiliza APIs públicas oficiais
- depende de comportamento observado da API privada da Gupy
- pode parar de funcionar a qualquer momento

Use por sua conta e risco.

---

🎉 Desenvolvido por **[Enzo Guinossi](https://www.linkedin.com/in/enzoguinossi/)**  
⭐ Gostou do projeto? Favorite o repositório!  
