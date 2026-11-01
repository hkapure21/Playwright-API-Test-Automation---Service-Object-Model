import { BaseService } from "./baseService";
import { expect, type APIRequestContext, type APIResponse } from "@playwright/test";

export interface AuthResponse {
    token: string;
}

export class AuthService extends BaseService {
    constructor(request: APIRequestContext) {
        super(request);
    }

    async authenticate(username = process.env.API_USERNAME ?? "admin", password = process.env.API_PASSWORD ?? "password123"): Promise<APIResponse> {
        return this.request.post('/auth', {
            data: { username, password },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
    }

    async login(username = process.env.API_USERNAME ?? "admin", password = process.env.API_PASSWORD ?? "password123"): Promise<string> {
        const res = await this.authenticate(username, password);
        expect(res.ok(), `Authentication failed with status ${res.status()}`).toBe(true);
        const data = (await res.json()) as AuthResponse;
        return data.token;
    }
}