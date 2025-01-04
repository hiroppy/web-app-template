import { writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { getPackageJson } from "./utils.mjs";

export async function updatePackageJson() {
  const { path, data } = await getPackageJson();
  const currentDirectoryName = basename(process.cwd());

  data.name = currentDirectoryName;
  data.version = "0.0.1";

  await writeFile(path, JSON.stringify(data, null, 2));
}
