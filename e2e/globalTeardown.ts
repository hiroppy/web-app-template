export default async function globalTeardown() {
  // @ts-expect-error Retrieve the container reference from global
  const container = global.__DB_CONTAINER__;

  if (container) {
    await container.down();
  }
}
