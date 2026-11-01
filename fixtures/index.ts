import { test as base } from '@playwright/test';
import { ServiceFactory } from '../service/serviceFactory';

interface MyFixtures {
    services: ServiceFactory;
}

export const test = base.extend<MyFixtures>({
    services: async ({ request }, use) => {
        await use(new ServiceFactory(request));
    },
});

export { expect } from '@playwright/test';