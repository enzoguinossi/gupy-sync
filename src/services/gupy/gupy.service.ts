import axios, { AxiosInstance, AxiosError } from 'axios';
import { HttpError } from '../../errors/index.js';
import { GupyAchievementsPayload } from './gupy.achievement.input.types.js';
import {GupyAchievementsResponse} from "./gupy.achievement.raw.types.js";

const ACHIEVEMENTS_PATH= "/curriculum-management/candidate/curriculum/achievement"
const EDUCATION_PATH= "/curriculum-management/candidate/curriculum/academic-formation"

export class GupyService {
    constructor(private readonly http: AxiosInstance) { }
    async getAchievements(): Promise<GupyAchievementsResponse> {
        try {
            const res = await this.http.get<GupyAchievementsPayload>(
                ACHIEVEMENTS_PATH
            );

            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw this.mapAxiosError(err);
            }

            throw err;
        }
    }

    async replaceAchievements(
        body: GupyAchievementsPayload
    ): Promise<void> {
        try {
            await this.http.put(
                ACHIEVEMENTS_PATH,
                body
            );
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw this.mapAxiosError(err);
            }

            throw err;
        }
    }

    async replaceAcademicFormation(
        body: GupyAchievementsPayload
    ): Promise<void> {
        try {
            await this.http.put(
                EDUCATION_PATH,
                body
            );
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw this.mapAxiosError(err);
            }

            throw err;
        }
    }

    private mapAxiosError(err: AxiosError): HttpError {
        const status = err.response?.status;

        switch (status) {
            case 400:
                return new HttpError(
                    'Payload inválido enviado para a Gupy', 
                    status
                );
                
            case 401:
                return new HttpError(
                    'Token da Gupy inválido ou expirado',
                    status
                );
                
            default:
                return new HttpError(
                    'Erro inesperado na API da Gupy',
                    status
                );
        }
    }
}
