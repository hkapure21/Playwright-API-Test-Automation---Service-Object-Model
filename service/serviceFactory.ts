import { type APIRequestContext } from "@playwright/test";
import { AuthService } from "./authService";
import { BookingService } from "./bookingService";

export class ServiceFactory {
    private authService?: AuthService;
    private token?: string;

    constructor(private readonly request: APIRequestContext) {}

    auth(): AuthService {
        return (this.authService ??= new AuthService(this.request));
    }

    booking(): BookingService {
        return new BookingService(this.request);
    }

    async authedBooking(username?: string, password?: string): Promise<BookingService> {
        this.token ??= await this.auth().login(username, password);
        return new BookingService(this.request, this.token);
    }
}

// Backward-compatibility alias
export { ServiceFactory as SericeFactory };