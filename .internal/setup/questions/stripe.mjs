import {
  executeOptionalQuestion,
  getPackageJson,
  removeDeps,
  removeDirs,
  removeFiles,
  removeItemModelFromPrisma,
} from "../utils.mjs";

export const removedFiles = /** @type {const} */ ([
  "./src/app/_actions/payment.ts",
  "./src/app/_clients/stripe.ts",
  "./src/app/_components/Payment.tsx",
  "./src/app/_components/PaymentCheckoutButton.tsx",
  "./src/app/_components/PaymentCancelButton.tsx",
]);

export const removedDirs = /** @type {const} */ (["./src/app/api/payment"]);

export const modifiedFiles = /** @type {const} */ ([
  "prisma/schema.prisma",
  "README.md",
  "env.ts",
  ".env.sample",
  ".env.test",
  "./src/app/(public)/page.tsx",
]);

export async function stripe(answer, isSkipQuestion) {
  const fences = [
    ["# start: stripe #", "# end: stripe #"],
    ["/* start: stripe */", "/* end: stripe */"],
    ["<!-- start: stripe -->", "<!-- end: stripe -->"],
  ];

  await executeOptionalQuestion({
    question: "> Do you want to remove Stripe files? (y/N) ",
    answer,
    isSkipQuestion,
    codeAndFenceList: [
      [modifiedFiles[0], fences[0]],
      [modifiedFiles[1], fences[2]],
      [modifiedFiles[2], fences[1]],
      [modifiedFiles[3], fences[0]],
      [modifiedFiles[4], fences[0]],
      [modifiedFiles[5], fences[1]],
    ],
    yesCallback: async () => {
      const { data } = await getPackageJson();
      const deps = ["stripe"];

      await Promise.all([
        removeItemModelFromPrisma("Subscription"),
        removeFiles(removedFiles),
        removeDirs(removedDirs),
        removeDeps(deps),
      ]);
    },
  });
}
