import { createGupyClient } from "@/infra/http/gupyClient.factory.js";
import { parseGupyEducation } from "@/parsers/gupy/education/gupy.education.parser.js";

export async function getGupyEducation() {
	const gupy = await createGupyClient();
	const data = await gupy.getEducation();
	return parseGupyEducation(data);
}
