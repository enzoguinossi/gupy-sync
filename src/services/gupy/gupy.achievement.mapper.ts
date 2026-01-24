import { LinkedinAchievementDomain } from '../../parsers/linkedin/achievement/linkedin.achievement.types.js';
import { GupyAchievementInput } from './gupy.achievement.input.types.js';

export function mapLinkedinAchievementToGupy(achievement: LinkedinAchievementDomain): GupyAchievementInput {
    return {
        type: achievement.Type,
        name: achievement.Name,
        description: achievement.Description,
    };
}
