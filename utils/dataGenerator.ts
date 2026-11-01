import { BookingPayload } from "../models/booking.model";

/**
 * Utility to dynamically generate test booking data
 * Useful for parallel execution without test data collisions
 */
export class DataGenerator {
    private static firstNames = ["James", "Emma", "Oliver", "Ava", "William", "Sophia", "Benjamin", "Isabella", "Lucas", "Mia"];
    private static lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    private static needs = ["Breakfast", "Late Checkout", "Airport Transfer", "Crib", "Extra Bed", "Quiet Room"];

    private static getRandomElement<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private static getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates a realistic booking payload with optional overrides
     */
    static generateBooking(overrides: Partial<BookingPayload> = {}): BookingPayload {
        const checkinDate = new Date();
        checkinDate.setDate(checkinDate.getDate() + this.getRandomNumber(1, 30));

        const checkoutDate = new Date(checkinDate);
        checkoutDate.setDate(checkoutDate.getDate() + this.getRandomNumber(1, 14));

        const formatDate = (d: Date) => d.toISOString().split("T")[0];

        const defaultPayload: BookingPayload = {
            firstname: `${this.getRandomElement(this.firstNames)}_${Date.now().toString().slice(-4)}`,
            lastname: this.getRandomElement(this.lastNames),
            totalprice: this.getRandomNumber(50, 1500),
            depositpaid: Math.random() < 0.5,
            bookingdates: {
                checkin: formatDate(checkinDate),
                checkout: formatDate(checkoutDate),
            },
            additionalneeds: this.getRandomElement(this.needs),
        };

        return {
            ...defaultPayload,
            ...overrides,
            bookingdates: {
                ...defaultPayload.bookingdates,
                ...(overrides.bookingdates || {}),
            },
        };
    }
}
