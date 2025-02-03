import { executeCommonProcessing } from "./common-processing.mjs";
import { format } from "./format.mjs";
import { askQuestions } from "./questions/index.mjs";
import { execAsync, removeDirs, title } from "./utils.mjs";

await execAsync("npm run setup", { stdio: "ignore" });

title("Installing dependencies");
await execAsync("pnpm i", { stdio: "ignore" });

title("Copying .env.sample to .env");
await execAsync("cp .env.sample .env");

await executeCommonProcessing();

await askQuestions();

// need to execute after asking questions
await removeDirs([".internal"]);

await format();

await execAsync("npx lefthook install");

console.info("done! please commit them 🐶");
