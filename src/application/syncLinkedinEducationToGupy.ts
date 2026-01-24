import {parseLinkedinEducationCSV} from "../parsers/linkedin/education/linkedin.education.parser.js";
import {UserInput} from "../infra/cli/userInput.types.js";
import {buildEducationPayload} from "../services/gupy/gupy.payload.js";
import {createGupyClient} from "../infra/http/gupyClient.factory.js";
import {normalizeCourseText} from "../shared/util/normalizeCourseText.js";
import {GupyEducationInput, GupyEducationTypes} from "../services/gupy/gupy.education.input.types.js";
import {LinkedinEducationDomain} from "../parsers/linkedin/education/linkedin.education.types.js";
import {CliError} from "../errors/index.js";

export async function syncLinkedinEducationToGupy(
    csvPath: string,
    dryRun: boolean,
    userInput: UserInput
) {
    const { formations, underGraduationDegree } =
        parseLinkedinEducationCSV(csvPath);

    for (const formation of formations) {
        if (formation.formation === 'unknown') {
            formation.formation = await userInput.selectFormationType(
                formation.institution
            );
        }

        if (!formation.course) {
            formation.course = await userInput.askCourseName(
                formation.institution
            );
        }
    formation.course = normalizeCourseText(formation.course)
    }


    function mapToGupyEducationInput(
        formations: LinkedinEducationDomain[]
    ): GupyEducationInput[] {
        return formations.map(f => {
            if (f.formation === 'unknown') {
                throw new CliError(
                    `O curso da instituição "${f.institution}" ainda está "unknown". 
Selecione o tipo de formação antes de enviar.`
                );
            }

            return {
                formation: f.formation as GupyEducationTypes,
                course: f.course!,
                conclusionStatus: f.conclusionStatus,
                institution: f.institution,
                startDateMonth: f.startDateMonth,
                startDateYear: String(f.startDateYear),
                endDateMonth: f.endDateMonth,
                endDateYear: String(f.endDateYear),
            };
        });
    }




    const payload = buildEducationPayload({
        formations: mapToGupyEducationInput(formations),
        underGraduationDegree,
    });

    if (dryRun) {
        console.log('🔎 DRY RUN — nenhum dado foi enviado');
        console.log(JSON.stringify(payload, null, 2));
        return;
    }

    const gupy  = await createGupyClient()
    await gupy.replaceAcademicFormation(payload);

    console.log(`
🎉 Sucesso!

A formação acadêmica foi sincronizada com a Gupy com base nos dados do LinkedIn.

ℹ️ Recomendação importante:
Após a sincronização, é altamente recomendável acessar a Gupy e
ajustar manualmente o nome do curso e da instituição para o padrão
utilizado pela plataforma. Isso melhora a legibilidade e aumenta a
compatibilidade com as ferramentas de ATS da Gupy.

Exemplo:
- Curso: "Análise e Desenvolvimento de Sistemas"
- Instituição: "Centro Universitário XYZ"

💙 Curtiu o projeto?
⭐ Favorite no GitHub — isso ajuda muito!
👉 https://github.com/enzoguinossi

🔗 Me siga no LinkedIn:
👉 https://www.linkedin.com/in/enzoguinossi/

— Enzo
`);
}
