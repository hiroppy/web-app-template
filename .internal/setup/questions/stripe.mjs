import {
  executeOptionalQuestion,
  removeDeps,
  removeDirs,
  removeFiles,
  removeItemModelFromPrisma,
  removeWords,
} from "../utils.mjs";

export const removedFiles = /** @type {const} */ ([
  "./src/app/_actions/payment.ts",
  "./src/app/_actions/payment.test.ts",
  "./src/app/_clients/stripe.ts",
  "./src/app/_components/Payment.tsx",
  "./src/app/_components/PaymentButton.tsx",
  "./src/app/_utils/payment.ts",
  "./src/app/_utils/payment.test.ts",
]);

export const removedDirs = /** @type {const} */ ([
  "./src/app/api/payment",
  "./src/app/(private)/me/payment",
]);

export const modifiedFiles = /** @type {const} */ ([
  "prisma/schema/user.prisma",
  "README.md",
  "env.ts",
  ".env.sample",
  ".env.test",
  "Dockerfile",
  ".github/workflows/ci.yml",
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
      // TODO:
      // [modifiedFiles[0], fences[0]],
      [modifiedFiles[1], fences[2]],
      [modifiedFiles[2], fences[1]],
      [modifiedFiles[3], fences[0]],
      [modifiedFiles[4], fences[0]],
      [modifiedFiles[5], fences[0]],
      [modifiedFiles[6], fences[0]],
    ],
    yesCallback: async () => {
      const deps = ["stripe"];

      await Promise.all([
        removeItemModelFromPrisma("user", "Subscription"),
        removeFiles(removedFiles),
        removeDirs(removedDirs),
        removeDeps(deps),
        removeWords(modifiedFiles[6], [
          // biome-ignore lint/suspicious/noTemplateCurlyInString: GitHub Actions syntax
          "--build-arg STRIPE_PRICE_ID=${{env.STRIPE_PRICE_ID}} \\",
          // biome-ignore lint/suspicious/noTemplateCurlyInString: GitHub Actions syntax
          "--build-arg STRIPE_SECRET_KEY=${{env.STRIPE_SECRET_KEY}} \\",
          // biome-ignore lint/suspicious/noTemplateCurlyInString: GitHub Actions syntax
          "--build-arg STRIPE_WEBHOOK_SECRET=${{env.STRIPE_WEBHOOK_SECRET}} \\",
        ]),
      ]);
    },
  });
}
