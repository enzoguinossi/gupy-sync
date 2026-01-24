# 📘 Como usar o `gupy-sync`

Abaixo estão os comandos disponíveis e suas flags, explicados de forma didática.

---

## 🔹 Comandos disponíveis

### 1️⃣ `importar-certificados`

Importa certificados do LinkedIn para a Gupy.

```bash
gupy-sync importar-certificados --csv <caminho_para_csv> [--dry-run]
```

O que faz:
- Autentica na Gupy usando seu token
- Substitui seus certificados da Gupy com os do Linkedin (ou apenas mostra no --dry-run)
- Mostra mensagem de êxito

**Flags:**
- `--csv <path>` → Obrigatório. Caminho para o CSV exportado do LinkedIn.
- `--dry-run` → Opcional. Faz um "ensaio" da importação: o CLI vai validar e mostrar o payload final sem enviar nada para a Gupy.

Exemplo:
```bash
gupy-sync importar-certificados --csv ./Certifications.csv --dry-run
```
> ✅ Dica: use --dry-run primeiro para conferir se todos os dados foram análisados corretamente.

### 1️⃣ `mostrar-certificados`
Exibe todos os certificados atualmente cadastrados na Gupy.
```bash
gupy-sync mostrar-certificados
```
O que faz:
- Autentica na Gupy usando seu token
- Busca os certificados atuais
- Mostra o resultado no terminal em JSON legível

### 3️⃣ `importar-formacao`

Substitui a formação acadêmica da Gupy pelos dados do LinkedIn.
```bash
gupy-sync importar-formacao --csv <caminho_para_csv> [--dry-run]
```
**Flags:**
- `--csv <path>` → Obrigatório. Caminho para o CSV exportado do LinkedIn.
- `--dry-run` → Opcional. Faz um "ensaio" da importação: o CLI vai validar e mostrar o payload final sem enviar nada para a Gupy.

**Exemplo:**
```bash
gupy-sync importar-formacao --csv ./Education.csv
```
O que faz:
- Normaliza os dados do CSV
- Pergunta interativamente caso algum curso não seja identificavel automaticamente
- Envia a formação completa para a Gupy (ou apenas mostra no --dry-run)
- Mostra mensagem de êxito


