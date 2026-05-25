import "dotenv/config";
import { CliError } from "@/errors/index.js";

let gupyToken: string | undefined;

export function initEnv(options?: { token?: string }) {
	gupyToken = options?.token ?? process.env.GUPY_TOKEN;

	if (!gupyToken) {
		throw new CliError("Token da Gupy não informado. Use --token ou defina GUPY_TOKEN no .env");
	}
	if (!gupyToken.trim()) {
		throw new CliError("O token da Gupy não pode ser vazio");
	}
}

export const env = {
	get GUPY_TOKEN() {
		if (!gupyToken) {
			throw new CliError("Env não inicializado");
		}
		return gupyToken;
	},
};
