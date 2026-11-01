import { expect, type APIRequestContext } from '@playwright/test';

export class BaseService {

    constructor(readonly request: APIRequestContext) { }

}