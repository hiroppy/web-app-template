import { test as base } from "@playwright/test";

// biome-ignore lint: lint/complexity/noBannedTypes
type TestFixtures = {};

export const test = base.extend<TestFixtures>({});

export { expect } from "@playwright/test";
