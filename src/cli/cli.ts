import { Command } from 'commander';;
import { isKnownError, ExitCode } from '../errors';


import { createGupyCookieJar } from '../infra/http/cookieJar';
import { createGupyHttpClient } from '../infra/http/axiosClient';
import { GupyService } from '../services/gupy/gupy.service';
import { parseLinkedinCSV } from '../parsers/linkedin/linkedin.parser';
import { buildAchievementsPayload } from '../services/gupy/gupy.payload';
import { validateCsvPath } from '../shared/validators/validateCsvPath';
import { syncGupyToLinkedin } from '../application/syncGupyToLinkedin';
import { getGupyAchievements } from '../application/getGupyAchievements';

const program = new Command()

program
    .name('gupy-sync')
    .description('Sincroniza achievements do LinkedIn com a Gupy')
    .version('0.1.0');

program
    .command('import-linkedin')
    .description('Importa certificados a partir do CSV do LinkedIn')
    .requiredOption('--csv <path>', 'Caminho para o CSV exportado do LinkedIn')
    .option('--dry-run', 'Não atualiza o Gupy, apenas mostra o resultado da análise do CSV')
    .action(async (options) => {
        await syncGupyToLinkedin(options.csv, options.dryRun);
    });

program
    .command('show-certificates')
    .description('Mostra os certificados já existentes na Gupy')
    .action(async () => {
       const data = await getGupyAchievements()
       console.log(JSON.stringify(data, null, 2));
    });


program.exitOverride();

program.parseAsync(process.argv).catch(err => {
  if (isKnownError(err)) {
    console.error(err.message);
    process.exit(err.exitCode);
  }

  console.error('Erro inesperado:', err);
  process.exit(ExitCode.UNEXPECTED);
});

