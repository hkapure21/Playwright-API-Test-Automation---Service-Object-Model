import { type APIRequestContext, type APIResponse } from "@playwright/test";
import { BaseService } from "./baseService";
import { BookingPayload } from "../models/booking.model";

export class BookingService extends BaseService {
    private readonly token?: string;

    constructor(request: APIRequestContext, token?: string) {
        super(request);
        this.token = token;
    }

    private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
        const headers: Record<string, string> = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...customHeaders,
        };

        if (this.token) {
            headers["Cookie"] = `token=${this.token}`;
        }

        return headers;
    }

    async createBooking(requestBody: BookingPayload | Record<string, unknown>): Promise<APIResponse> {
        return this.request.post('/booking', {
            data: requestBody,
            headers: this.getHeaders(),
        });
    }

    async getBooking(id: number | string): Promise<APIResponse> {
        return this.request.get(`/booking/${id}`, {
            headers: this.getHeaders(),
        });
    }

    async updateBooking(id: number | string, requestBody: BookingPayload | Record<string, unknown>): Promise<APIResponse> {
        return this.request.put(`/booking/${id}`, {
            data: requestBody,
            headers: this.getHeaders(),
        });
    }

    async partialUpdateBooking(id: number | string, requestBody: Partial<BookingPayload> | Record<string, unknown>): Promise<APIResponse> {
        return this.request.patch(`/booking/${id}`, {
            data: requestBody,
            headers: this.getHeaders(),
        });
    }

    async deleteBooking(id: number | string): Promise<APIResponse> {
        return this.request.delete(`/booking/${id}`, {
            headers: this.getHeaders(),
        });
    }

    async getBookingIds(params?: Record<string, string>): Promise<APIResponse> {
        return this.request.get('/booking', {
            params,
            headers: this.getHeaders(),
        });
    }

    async ping(): Promise<APIResponse> {
        return this.request.get('/ping');
    }
}