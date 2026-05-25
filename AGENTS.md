# Agent Documentation

Este documento centraliza todas as **informações externas** do projeto, incluindo:

- Estrutura de payloads enviados e recebidos
- Contratos de integração
- Estrutura e mapeamento de arquivos CSV
- Regras e validações importantes

Este arquivo deve ser utilizado como **fonte de verdade** para desenvolvimento, manutenção e testes.

## 🔧 Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Executa em desenvolvimento com `tsx` |
| `npm run build` | Compila TypeScript com `tsc` + resolve aliases `@/` com `tsc-alias` |
| `npm test` | Executa testes com `vitest` (quando implementados) |

## 📁 Path Alias

O projeto usa `@/` como alias para `src/` (ex: `@/domain/entities/education.entity.js`).
O `tsc-alias` converte automaticamente para caminhos relativos no `dist/`.

## 🧩 Tipos e Contratos (TypeScript)

Todos os tipos de integração estão centralizados em `src/types/`.

### Gupy – Education

| Arquivo | Conteúdo |
|---------|----------|
| `src/types/gupy/education/enum/gupy.education.enum.ts` | `GupyEducationTypes`, `GupyEducationConclusionStatus`, `GupyUnderGraduationTypes` |
| `src/types/gupy/education/input/gupy.education.input.types.ts` | `GupyEducationInput`, `GupyEducationPayload` |
| `src/types/gupy/education/raw/gupy.education.raw.types.ts` | `GupyFormationRaw`, `GupyFormationsRaw` |

### Gupy – Achievement

| Arquivo | Conteúdo |
|---------|----------|
| `src/types/gupy/achievement/input/gupy.achievement.input.types.ts` | `GupyAchievementInput`, `GupyAchievementsPayload` |
| `src/types/gupy/achievement/raw/gupy.achievement.raw.types.ts` | `GupyAchievementTypesEnum`, `GupyAchievementRaw`, `GupyAchievementsResponse` |

### LinkedIn

| Arquivo | Conteúdo |
|---------|----------|
| `src/types/linkedin/achievement/linkedin.achievement.types.ts` | `LinkedinAchievementRaw`, `LinkedinAchievementParsed` |
| `src/types/linkedin/education/linkedin.education.types.ts` | `LinkedinEducationRaw`, `LinkedinEducationParsed` |
| `src/types/linkedin/shared/linkedin.shared.types.ts` | `LinkedinDates`, `LinkedinDatesMonths` |

### Domínio (entidades internas)

| Arquivo | Conteúdo |
|---------|----------|
| `src/domain/entities/achievement.entity.ts` | `AchievementEntity`, `AchievementType` |
| `src/domain/entities/education.entity.ts` | `EducationEntity` |
| `src/domain/enums/education-level.enum.ts` | `EducationLevel` |
| `src/domain/enums/education-status.enum.ts` | `EducationStatus` |


---

## 📦 Integrações Externas

### Plataforma: Gupy / LinkedIn

O projeto realiza sincronização de dados de **certificados** e **formação educacional**, utilizando payloads JSON e
arquivos CSV como fonte.

---

## 📄 Payload: Certificados (GET / PUT)

### Estrutura Geral

```json
{
  "achievements": [
    {
      "type": "courses",
      "name": "Inglês Avançado",
      "description": "Emitido por: Pró-Ser Instituto de Qualificação"
    }
  ]
}
```

**Campos**

| Campo         | Tipo   | Obrigatório | Descrição                                                |
|---------------|--------|-------------|----------------------------------------------------------|
| `type`        | string | ✅ Sim       | Tipo do achievement (ex: `courses`)                      |
| `name`        | string | ✅ Sim       | Nome do certificado                                      |
| `description` | string | ❌ Não       | Informações adicionais (instituição, URL, licença, etc.) |

**Regras**

- `type` sempre deve ser uma string
- `name` não pode ser vazio
- `description` pode ser omitido

Todos os certificados são enviados dentro do array `achievements`

## 🎓 Payload: Formação / Educação (GET / PUT)

### Estrutura Geral

```json
{
  "formations": [
    {
      "formation": "technological",
      "conclusionStatus": "in_progress",
      "course": "análise e desenvolvimento de sistemas",
      "institution": "Centro Universitário Serra dos Órgãos - UNIFESO",
      "startDateMonth": 1,
      "startDateYear": "2026",
      "endDateMonth": 8,
      "endDateYear": "2028"
    }
  ],
  "underGraduationDegree": "completed_high_school"
}
```

**Campos – formations[]**

| Campo              | Tipo   | Obrigatório | Descrição                                                    |
|--------------------|--------|-------------|--------------------------------------------------------------|
| `formation`        | string | ✅ Sim       | Tipo da formação (`technological`, `technical_course`, etc.) |
| `conclusionStatus` | string | ✅ Sim       | Status (`in_progress`, `completed`)                          |
| `course`           | string | ✅ Sim       | Nome do curso                                                |
| `institution`      | string | ✅ Sim       | Instituição de ensino                                        |
| `startDateMonth`   | number | ✅ Sim       | Mês de início (1–12)                                         |
| `startDateYear`    | string | ✅ Sim       | Ano de início                                                |
| `endDateMonth`     | number | ✅ Sim       | Mês de término                                               |
| `endDateYear`      | string | ✅ Sim       | Ano de término                                               |

**Campo underGraduationDegree (opcional)**

| Campo                   | Tipo   | Obrigatório | Descrição            |
|-------------------------|--------|-------------|----------------------|
| `underGraduationDegree` | string | ❌ Não       | Grau de escolaridade |

## 📊 CSV: Formação Acadêmica

### Estrutura

```csv
School Name,Start Date,End Date,Notes,Degree Name,Activities
```

| Coluna        | Descrição                         |
|---------------|-----------------------------------|
| `School Name` | Nome da instituição               |
| `Start Date`  | Data inicial (ex: `Jan 2026`)     |
| `End Date`    | Data final (ex: `Aug 2028`)       |
| `Notes`       | Observações adicionais (opcional) |
| `Degree Name` | Nome do grau (opcional)           |
| `Activities`  | Atividades realizadas (opcional)  |

**Observações**

- Datas estão no formato `MMM YYYY`
- Campos vazios são permitidos
- Cada linha representa uma formação

## 📜 CSV: Certificados (Certifications.csv)

### Estrutura

```csv
Name,Url,Authority,Started On,Finished On,License Number
```

**Colunas**

| Coluna           | Obrigatório | Descrição               |
|------------------|-------------|-------------------------|
| `Name`           | ✅ Sim       | Nome do certificado     |
| `Url`            | ❌ Não       | URL do certificado      |
| `Authority`      | ❌ Não       | Instituição emissora    |
| `Started On`     | ❌ Não       | Data de início          |
| `Finished On`    | ❌ Não       | Data de conclusão       |
| `License Number` | ❌ Não       | Número de licença ou ID |