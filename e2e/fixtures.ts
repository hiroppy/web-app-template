import { test as base } from "@playwright/test";

// biome-ignore lint: lint/complexity/noBannedTypes
export type TestFixtures = {};

// biome-ignore lint: lint/complexity/noBannedTypes
export type WorkerFixtures = {};

export const test = base.extend<TestFixtures, WorkerFixtures>({});

export { expect } from "@playwright/test";
