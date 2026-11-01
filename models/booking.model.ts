export interface BookingDates {
    checkin: string;
    checkout: string;
}

export interface BookingPayload {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

export interface BookingResponse {
    bookingid: number;
    booking: BookingPayload;
}

export interface BookingTestCase {
    scenario: string;
    payload: BookingPayload;
    expectedStatus: number;
}

export interface NegativeBookingTestCase {
    scenario: string;
    payload: Record<string, unknown>;
    expectedStatus: number;
}
