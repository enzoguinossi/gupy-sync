import packageInfo from "@/shared/util/packageInfo.js";
import { Command, CommanderError } from "commander";

import { ExitCode, isKnownError } from "@/errors/index.js";

import { syncLinkedinAchievements, diffLinkedinAchievements } from "@/application/sync/syncLinkedinAchievements.js";
import { syncLinkedinEducation, diffLinkedinEducation } from "@/application/sync/syncLinkedinEducation.js";
import { getLinkedinAchievements } from "@/application/linkedin/getLinkedinAchievements.js";
import { getLinkedInFormation } from "@/application/linkedin/getLinkedInFormation.js";
import { getAchievements } from "@/application/platform/getAchievements.js";
import { getEducation } from "@/application/platform/getEducation.js";
import { displayAchievements } from "@/cli/displayers/achievement.displayer.js";
import { displayEducation } from "@/cli/displayers/education.displayer.js";
import { displayAchievementDiff, displayEducationDiff } from "@/cli/displayers/diff.displayer.js";
import { cliUserInput } from "@/infra/cli/cliUserInput.js";
import { resolvePlatform } from "@/platform/contracts/PlatformFactory.js";

const program = new Command();
const userInput = cliUserInput;

program
	.name("gupy-sync")
	.description("Ferramenta de sincronização de dados do LinkedIn com plataformas de currículo")
	.version(packageInfo.version)
	.option("--platform <name>", "Plataforma de destino (gupy, ...)", "gupy")
	.option("--token <token>", "Token de autenticação da plataforma")
	.option("--debug", "Exibe o stack trace completo em caso de erro");

program
	.command("importar-certificados")
	.description("Importa certificados a partir do CSV do LinkedIn")
	.requiredOption("--csv <path>", "Caminho para o CSV exportado do LinkedIn")
	.option("--dry-run", "Não envia dados, apenas exibe o resultado da análise")
	.option("--diff", "Mostra diferenças entre LinkedIn e plataforma sem sincronizar")
	.action(async (options) => {
		if (options.dryRun) {
			await syncLinkedinAchievements(options.csv, true);
			return;
		}
		const platform = resolvePlatform(program.opts().platform, { token: options.token ?? program.opts().token });
		if (options.diff) {
			const result = await diffLinkedinAchievements(options.csv, platform);
			displayAchievementDiff(result);
			return;
		}
		await syncLinkedinAchievements(options.csv, false, platform);
	});

program
	.command("mostrar-certificados")
	.description("Exibe os certificados atualmente cadastrados na plataforma")
	.action(async () => {
		const platform = resolvePlatform(program.opts().platform, { token: program.opts().token });
		const data = await getAchievements(platform);
		displayAchievements(data);
	});

program
	.command("mostrar-formacao")
	.description("Exibe a formação atualmente cadastrada na plataforma")
	.action(async () => {
		const platform = resolvePlatform(program.opts().platform, { token: program.opts().token });
		const data = await getEducation(platform);
		displayEducation(data);
	});

program
	.command("mostrar-certificados-linkedin")
	.description("Exibe os certificados de um arquivo CSV do LinkedIn")
	.requiredOption("--csv <path>", "Caminho para o CSV exportado do LinkedIn")
	.action(async (options) => {
		const data = await getLinkedinAchievements(options.csv);
		displayAchievements(data);
	});

program
	.command("mostrar-formacao-linkedin")
	.description("Exibe a formação acadêmica presente no csv exportado do Linkedin")
	.requiredOption("--csv <path>", "Caminho para o CSV exportado do LinkedIn")
	.action(async (options) => {
		const data = await getLinkedInFormation(options.csv);
		displayEducation(data);
	});

program
	.command("importar-formacao")
	.description("Substitui a formação acadêmica pelos dados do LinkedIn")
	.requiredOption("--csv <path>", "Caminho para o CSV exportado do LinkedIn")
	.option("--dry-run", "Não envia dados, apenas exibe o resultado da análise")
	.option("--diff", "Mostra diferenças entre LinkedIn e plataforma sem sincronizar")
	.action(async (options) => {
		if (options.dryRun) {
			await syncLinkedinEducation(options.csv, true, userInput);
			return;
		}
		const platform = resolvePlatform(program.opts().platform, { token: options.token ?? program.opts().token });
		if (options.diff) {
			const result = await diffLinkedinEducation(options.csv, userInput, platform);
			displayEducationDiff(result);
			return;
		}
		await syncLinkedinEducation(options.csv, false, userInput, platform);
	});

program.exitOverride();

const TOKENLESS_COMMANDS = ["mostrar-certificados-linkedin", "mostrar-formacao-linkedin"];

program.hook("preAction", (thisCommand, actionCommand) => {
	const commandName = actionCommand.name();
	const subOpts = actionCommand.opts();

	const isDryRun = subOpts.dryRun ?? false;
	const isTokenless = TOKENLESS_COMMANDS.includes(commandName) || isDryRun;

	if (!isTokenless) {
		// Token validation happens inside resolvePlatform() when the action runs
	}
});

try {
	await program.parseAsync(process.argv);
} catch (err) {
	const { debug } = program.opts?.() ?? {};

	if (err instanceof CommanderError) {
		console.error(err.message);
		process.exit(ExitCode.CLI);
	}

	if (isKnownError(err)) {
		console.error(err.message);
		if (debug) console.error(err.stack);
		process.exit(err.exitCode);
	}

	console.error("❌ Erro inesperado.");
	if (debug && err instanceof Error) {
		console.error(err.stack);
	}

	process.exit(ExitCode.UNEXPECTED);
}