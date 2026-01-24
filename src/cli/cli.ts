import { Command, CommanderError } from 'commander';

import { ExitCode, isKnownError } from '../errors/index.js';

import { syncGupyToLinkedin } from '../application/syncLinkedinAchievementsToGupy.js';
import { getGupyAchievements } from '../application/getGupyAchievements.js';
import { syncLinkedinEducationToGupy } from '../application/syncLinkedinEducationToGupy.js';

import { cliUserInput } from '../infra/cli/cliUserInput.js';

const program = new Command();
const userInput = cliUserInput;


program
    .name('gupy-sync')
    .description('Ferramenta de sincronização entre LinkedIn e Gupy')
    .version('0.2.0')
    .option('--debug', 'Exibe o stack trace completo em caso de erro');


program
    .command('importar-certificados')
    .description('Importa certificados a partir do CSV do LinkedIn')
    .requiredOption('--csv <path>', 'Caminho para o CSV exportado do LinkedIn')
    .option(
        '--dry-run',
        'Não envia dados para a Gupy, apenas exibe o resultado da análise'
    )
    .action(async (options) => {
        await syncGupyToLinkedin(options.csv, options.dryRun);
    });


program
    .command('mostrar-certificados')
    .description('Exibe os certificados atualmente cadastrados na Gupy')
    .action(async () => {
        const data = await getGupyAchievements();
        console.log(JSON.stringify(data, null, 2));
    });

program
    .command('importar-formacao')
    .description(
        'Substitui a formação acadêmica da Gupy pelos dados do LinkedIn'
    )
    .requiredOption('--csv <path>', 'Caminho para o CSV exportado do LinkedIn')
    .option(
        '--dry-run',
        'Não envia dados para a Gupy, apenas exibe o payload gerado'
    )
    .action(async (options) => {
        await syncLinkedinEducationToGupy(
            options.csv,
            options.dryRun,
            userInput
        );
    });

program.exitOverride();

program.parseAsync(process.argv).catch((err) => {
    const { debug } = program.opts();

    if (err instanceof CommanderError) {
        console.error(err.message);
        process.exit(ExitCode.CLI);
    }

    if (isKnownError(err)) {
        console.error(err.message);
        if (debug) console.error(err.stack);
        process.exit(err.exitCode);
    }

    console.error('❌ Erro inesperado.');
    if (debug && err instanceof Error) {
        console.error(err.stack);
    }

    process.exit(ExitCode.UNEXPECTED);
});
