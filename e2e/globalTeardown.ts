export default async function globalTeardown() {
  await global.down();
}
