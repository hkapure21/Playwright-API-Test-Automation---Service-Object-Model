import { test, expect } from "../fixtures";
import bookingData from "../data/bookingData.json";
import { DataGenerator } from "../utils/dataGenerator";
import { BookingResponse, BookingPayload } from "../models/booking.model";

test.describe("Data-Driven API Tests: Booking Creation (External JSON Dataset)", () => {
    // 1. Parameterized Positive Scenarios from JSON
    for (const testCase of bookingData.positiveCases) {
        test(`[Positive] ${testCase.scenario}`, async ({ services }) => {
            const bookingApi = services.booking();
            const res = await bookingApi.createBooking(testCase.payload);

            expect(res.status(), `Expected status ${testCase.expectedStatus}`).toBe(testCase.expectedStatus);

            const body = (await res.json()) as BookingResponse;
            expect(body).toHaveProperty("bookingid");
            expect(typeof body.bookingid).toBe("number");
            expect(body.booking.firstname).toBe(testCase.payload.firstname);
            expect(body.booking.lastname).toBe(testCase.payload.lastname);
            expect(body.booking.totalprice).toBe(testCase.payload.totalprice);
            expect(body.booking.depositpaid).toBe(testCase.payload.depositpaid);
            expect(body.booking.bookingdates.checkin).toBe(testCase.payload.bookingdates.checkin);
            expect(body.booking.bookingdates.checkout).toBe(testCase.payload.bookingdates.checkout);

            if (testCase.payload.additionalneeds) {
                expect(body.booking.additionalneeds).toBe(testCase.payload.additionalneeds);
            }
        });
    }

    // 2. Parameterized Negative Scenarios from JSON
    for (const testCase of bookingData.negativeCases) {
        test(`[Negative] ${testCase.scenario}`, async ({ services }) => {
            const bookingApi = services.booking();
            const res = await bookingApi.createBooking(testCase.payload);

            // Restful Booker returns 500 Internal Server Error when required schema fields are missing
            expect(res.status()).toBe(testCase.expectedStatus);
        });
    }
});

test.describe("Data-Driven API Tests: Dynamic Generation & Full Lifecycle", () => {
    // 3. Dynamic Data-Driven CRUD Lifecycle (Generates random realistic data per test run)
    test("Full CRUD lifecycle with dynamic randomized data and authentication", async ({ services }) => {
        const bookingApi = services.booking();
        const authedBookingApi = await services.authedBooking();

        // Step 1: Create booking with dynamic generated data
        const initialPayload = DataGenerator.generateBooking();
        const createRes = await bookingApi.createBooking(initialPayload);
        expect(createRes.status()).toBe(200);

        const createdBody = (await createRes.json()) as BookingResponse;
        const bookingId = createdBody.bookingid;
        expect(bookingId).toBeGreaterThan(0);
        expect(createdBody.booking.firstname).toBe(initialPayload.firstname);

        // Step 2: Fetch and verify
        const getRes = await bookingApi.getBooking(bookingId);
        expect(getRes.status()).toBe(200);
        const fetchedBody = (await getRes.json()) as BookingPayload;
        expect(fetchedBody.firstname).toBe(initialPayload.firstname);
        expect(fetchedBody.totalprice).toBe(initialPayload.totalprice);

        // Step 3: Partial Update (PATCH) with authentication
        const patchPayload = { firstname: "UpdatedName", totalprice: 777 };
        const patchRes = await authedBookingApi.partialUpdateBooking(bookingId, patchPayload);
        expect(patchRes.status()).toBe(200);
        const patchedBody = (await patchRes.json()) as BookingPayload;
        expect(patchedBody.firstname).toBe("UpdatedName");
        expect(patchedBody.totalprice).toBe(777);

        // Step 4: Full Update (PUT) with authentication
        const fullUpdatePayload = DataGenerator.generateBooking({
            firstname: "FullUpdate",
            additionalneeds: "All-inclusive",
        });
        const putRes = await authedBookingApi.updateBooking(bookingId, fullUpdatePayload);
        expect(putRes.status()).toBe(200);
        const putBody = (await putRes.json()) as BookingPayload;
        expect(putBody.firstname).toBe("FullUpdate");
        expect(putBody.additionalneeds).toBe("All-inclusive");

        // Step 5: Delete (DELETE) with authentication
        const deleteRes = await authedBookingApi.deleteBooking(bookingId);
        // Restful Booker returns 201 Created on delete
        expect(deleteRes.status()).toBe(201);

        // Step 6: Verify deletion
        const verifyDeletedRes = await bookingApi.getBooking(bookingId);
        expect(verifyDeletedRes.status()).toBe(404);
    });

    // 4. Parameterized In-Code Dataset (Boundary testing for price values)
    const priceScenarios = [
        { label: "Zero price boundary", price: 0 },
        { label: "Low tier price", price: 1 },
        { label: "High tier luxury price", price: 99999 },
    ];

    for (const scenario of priceScenarios) {
        test(`Parameterized Price Boundary: ${scenario.label} ($${scenario.price})`, async ({ services }) => {
            const bookingApi = services.booking();
            const payload = DataGenerator.generateBooking({ totalprice: scenario.price });

            const res = await bookingApi.createBooking(payload);
            expect(res.status()).toBe(200);

            const body = (await res.json()) as BookingResponse;
            expect(body.booking.totalprice).toBe(scenario.price);
        });
    }
});