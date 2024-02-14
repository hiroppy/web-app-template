import { prisma } from "../src/app/_clients/prisma";

export default async function globalTeardown() {
  const tables = Object.keys(prisma).filter(
    (model) =>
      !(
        typeof model === "string" &&
        (model.startsWith("$") || model.startsWith("_"))
      ),
  );

  await Promise.all(
    tables.map(async (table) => {
      // @ts-expect-error
      await prisma?.[table]?.deleteMany({});
    }),
  );
}
