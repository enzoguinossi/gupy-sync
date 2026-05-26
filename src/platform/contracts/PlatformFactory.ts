import { CliError } from "@/errors/index.js";
import { getEnvVar } from "@/config/env.js";
import { Platform } from "./Platform.js";
import { GupyPlatform } from "@/platform/gupy/GupyPlatform.js";

export type PlatformName = "gupy";

const PLATFORM_REGISTRY: Record<PlatformName, new (token: string) => Platform> = {
	gupy: GupyPlatform,
};

export function resolvePlatform(name: string, options?: { token?: string }): Platform {
	const normalized = name.toLowerCase() as PlatformName;

	const PlatformCtor = PLATFORM_REGISTRY[normalized];
	if (!PlatformCtor) {
		const available = Object.keys(PLATFORM_REGISTRY).join(", ");
		throw new CliError(
			`Plataforma desconhecida: "${name}". Plataformas disponíveis: ${available}`,
		);
	}

	const envVar = `${normalized.toUpperCase()}_TOKEN`;
	const token = options?.token ?? getEnvVar(envVar);

	if (!token || !token.trim()) {
		throw new CliError(
			`Token não informado para plataforma "${name}". Use --token ou defina ${envVar} no .env`,
		);
	}

	return new PlatformCtor(token);
}