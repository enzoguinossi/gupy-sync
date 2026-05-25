import { AchievementEntity, AchievementType } from "@/domain/entities/achievement.entity.js";
import { truncateText } from "@/shared/util/truncateText.js";

const achievementTypeMap: Record<AchievementType, string> = {
	[AchievementType.Course]: "Curso",
	[AchievementType.Certification]: "Certificação",
	[AchievementType.License]: "Licença",
	[AchievementType.Award]: "Prêmio",
	[AchievementType.Acknowledgement]: "Reconhecimento",
	[AchievementType.volunteerWork]: "Voluntariado",
};

export function displayAchievements(achievements: AchievementEntity[]) {
	if (achievements.length === 0) {
		console.log("Nenhum certificado/conquista encontrado.");
		return;
	}

	const tableData = achievements.map((item) => ({
		Nome: truncateText(item.name, 30),
		Tipo: achievementTypeMap[item.type] || item.type,
		Emissor: truncateText(item.issuer, 20),
		Data: item.issueDate ? `${item.issueDate.month}/${item.issueDate.year}` : "-",
		Validade: item.expirationDate
			? `${item.expirationDate.month}/${item.expirationDate.year}`
			: "Sem validade",
		ID: item.credentialId ? truncateText(item.credentialId, 10) : "-",
		Descricao: item.description ? truncateText(item.description, 15) : "-",
	}));

	console.table(tableData);
}