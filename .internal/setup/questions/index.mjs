import { docker } from "./docker.mjs";
import { e2e } from "./e2e.mjs";
import { otel } from "./otel.mjs";
import { sampleCode } from "./sample-code.mjs";
import { stripe } from "./stripe.mjs";

export async function askQuestions() {
  const [_, __, ...flags] = process.argv;
  const isSkipQuestions = flags.includes("--skip-questions");

  await sampleCode(flags.includes("--remove-sample-code"), isSkipQuestions);
  await docker(flags.includes("--remove-docker"), isSkipQuestions);
  await e2e(flags.includes("--remove-e2e"), isSkipQuestions);
  await otel(flags.includes("--remove-otel"), isSkipQuestions);
  await stripe(flags.includes("--remove-stripe"), isSkipQuestions);
}
