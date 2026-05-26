# Agent Documentation

Documentação centralizada para desenvolvimento, manutenção e testes do gupy-sync.
Use como **fonte de verdade** para decisões de arquitetura, contratos de API e regras de negócio.

---

## 🔧 Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Executa em desenvolvimento com `tsx` |
| `npm run build` | Compila TypeScript com `tsc` + resolve aliases `@/` com `tsc-alias` |
| `npm test` | Executa testes com `vitest` (78 testes) |
| `npm run test:watch` | Modo watch dos testes |
| `npm run prepack` | Build automático antes do `npm publish` |

**CI/CD:** GitHub Actions em `.github/workflows/release.yml`
- Trigger: push de tag `v*`
- Faz build, zip, cria release no GitHub, publica no npm com `--provenance` (Trusted Publishing/OIDC)
- ⚠️ **Bug corrigido:** `npm logout` estava antes do `npm publish` (impedia publicação)

---

## 📁 Path Alias

O projeto usa `@/` como alias para `src/` (ex: `@/domain/entities/education.entity.js`).
O `tsc-alias` converte automaticamente para caminhos relativos no `dist/`.

---

## 🏗️ Arquitetura (Adapter Pattern)

```
src/
  domain/                ← Lógica pura, sem dependências externas
    entities/            ← AchievementEntity, EducationEntity
    enums/               ← EducationLevel, EducationStatus
    services/            ← diffByKey(), DiffResult — genérico

  parsers/
    linkedin/            ← Parse de CSV do LinkedIn (fonte de dados)

  types/
    linkedin/            ← Tipos dos dados do LinkedIn

  platform/
    contracts/           ← Interface Platform (contrato para qualquer plataforma)
      Platform.ts        ← getAchievements, replaceEducation, getAchievementMatchKey, etc.
      PlatformFactory.ts ← resolvePlatform("gupy", { token }) → carrega adapter
    gupy/                ← Adapter Gupy
      GupyPlatform.ts    ← Implementa Platform
      GupyHttpService.ts ← HTTP service (chamadas à API)
      GupyClientFactory.ts
      mappers/           ← Domain → Gupy format
      parsers/           ← Gupy raw → Domain
      payloads/          ← Montagem de payloads da API
      types/             ← Tipos internos do Gupy

  application/
    linkedin/            ← Leitura de CSV do LinkedIn
    sync/
      syncLinkedinAchievements.ts  ← sync + diff, recebe Platform
      syncLinkedinEducation.ts     ← sync + diff, recebe Platform
    platform/
      getAchievements.ts ← Operação genérica de leitura

  cli/
    cli.ts               ← CLI com --platform e --diff
    displayers/          ← Display de achievements, education, diff

  config/
    env.ts               ← getEnvVar(name) — genérico

  infra/
    cli/                 ← UserInput (usa EducationLevel do domínio)
```

---

## 🔄 Fluxo de Dados

### Sync (ex: importar-certificados)
```
CSV LinkedIn → linkedin.parser → AchievementEntity[]
                                   ↓
                            Platform.replaceAchievements()
                                   ↓
                            GupyPlatform (adapter)
                              → mapper (Domain → Gupy)
                              → payload builder
                              → HTTP PUT
```

### Diff (ex: importar-certificados --diff)
```
CSV LinkedIn → linkedin.parser → AchievementEntity[]
Platform     → getAchievements → AchievementEntity[]
                                   ↓
                            diffByKey(linkedin, platform, getMatchKey)
                                   ↓
                            DiffResult { added, removed, kept }
                                   ↓
                            displayer com cores (+ verde, - vermelho, ~ cinza)
```

---

## 🧩 Platform Interface

```typescript
interface Platform {
  readonly name: string;

  // Match keys para diff (cada plataforma define seus próprios critérios)
  getAchievementMatchKey(entity: AchievementEntity): string;
  getEducationMatchKey(entity: EducationEntity): string;

  // Operações CRUD
  getAchievements(): Promise<AchievementEntity[]>;
  replaceAchievements(achievements: AchievementEntity[]): Promise<void>;
  getEducation(): Promise<EducationEntity[]>;
  replaceEducation(education: EducationEntity[], underGraduationDegree?: string): Promise<void>;
}
```

**Regras de matching por plataforma:**

| Plataforma | Achievement Match Key | Education Match Key |
|------------|----------------------|---------------------|
| Gupy | `name` (case-insensitive) | `institution \| level` |
| Futura (TOTVS) | `name \| issuer` | `institution \| course \| level` |

---

## 🧪 Testes (78 testes, 5 arquivos)

```
src/__tests__/
  detectEducationLevel.test.ts     (23 testes) — Detecção de nível educacional
  linkedin.education.parser.test.ts (15 testes) — Parse de CSV de formação
  linkedin.achievement.parser.test.ts (10 testes) — Parse de CSV de certificados
  diff.service.test.ts              (8 testes) — Lógica de diff
  gupy.mapper.test.ts              (22 testes) — Mapeamento domínio → Gupy
```

**Mocks:** `src/__tests__/mocks/` — CSVs de exemplo (Education.csv, Certifications.csv, EdgeCases.csv)

---

## 🧠 Regras de Negócio Importantes

### Detecção de Nível Educacional (`detectEducationLevel`)
- Concatena `degreeName` + `notes` e busca por regex em ordem de precedência
- **Ordem importa:** Pós-graduação antes de Graduação, Pós-doutorado antes de Doutorado
- O normalizador (`normalizeDegreeText`) remove acentos, hífens e converte para lowercase
- Suporta termos em PT e EN
- Se não reconhecer, retorna `EducationLevel.Unknown`

### Status de Conclusão
- Baseado na `endDate` comparada com a data atual
- Futuro = `InProgress`, Passado = `Completed`

### Diff
- Usa `diffByKey<T>(fromLeft, fromRight, getKey)` — genérico, recebe função de extração de chave
- Cada plataforma fornece sua própria `getMatchKey` (ex: Gupy ignora `issuer` porque não armazena)
- As chaves são comparadas como string — case-insensitive

### Gupy Platform Specifics
- Gupy **não armazena `issuer`** em achievements — o mapper coloca no `description`
- Gupy **não armazena `url` ou `credentialId`** separadamente — tudo vai no `description`
- `underGraduationDegree` é inferido: se há formação superior, assume `completed_high_school`

---

## 📄 Payloads da API (Gupy)

### Certificados (GET / PUT)

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

### Formação (GET / PUT)

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

---

## 📊 CSV: LinkedIn

### Formação Acadêmica

```csv
School Name,Start Date,End Date,Notes,Degree Name,Activities
```

| Coluna | Descrição |
|--------|-----------|
| `School Name` | Nome da instituição |
| `Start Date` / `End Date` | Formato `MMM YYYY` (ex: `Jan 2026`) |
| `Notes` | Observações — usado para detectar nível educacional |
| `Degree Name` | Nome do grau (ex: `Bachelor's Degree`) |
| `Activities` | Atividades (não utilizado) |

### Certificados

```csv
Name,Url,Authority,Started On,Finished On,License Number
```

| Coluna | Descrição |
|--------|-----------|
| `Name` | Nome do certificado |
| `Url` | URL de verificação |
| `Authority` | Instituição emissora |
| `Started On` / `Finished On` | Formato `MMM YYYY` |
| `License Number` | ID da licença |

---

## 🚀 Como adicionar uma nova plataforma

1. Criar `src/platform/minhaplataforma/MinhaPlataforma.ts` implementando `Platform`
2. Definir `getAchievementMatchKey` e `getEducationMatchKey` (quais campos usar para diff)
3. Implementar chamadas HTTP, mappers domain→platform e parsers platform→domain
4. Registrar em `src/platform/contracts/PlatformFactory.ts`:
   ```typescript
   const PLATFORM_REGISTRY = {
     gupy: GupyPlatform,
     minhaplataforma: MinhaPlataforma,
   };
   ```
5. O CLI automaticamente suporta `--platform minhaplataforma`

---

## 🐛 Histórico de Bugs Corrigidos

| Bug | Solução |
|-----|---------|
| Amend removeu 8 arquivos novos | Restaurado do backup local |
| `@types/node` ausente nas devDeps | Adicionado ao package.json |
| `preAction` exigia token Gupy para comandos locais | Token check movido para `resolvePlatform()` |
| `release.yml`: `npm logout` antes de `npm publish` | Ordem corrigida |
| `release.yml`: sem `--provenance` para OIDC | Adicionado |
| `detectEducationLevel("Pós-Graduação")` retornava BACHELOR | Reordenado regex + `normalizeDegreeText` trata hífens |
| Tipos Gupy espalhados entre parsers/ e services/ | Centralizados em `src/types/gupy/` → depois `src/platform/gupy/types/` |
| CLI descrevia comandos como "Gupy" | Agora diz "plataforma" |
| `imports relativos` profundos | Substituídos por `@/` alias |