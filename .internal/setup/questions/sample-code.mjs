import {
  executeOptionalQuestion,
  readFileFromCopiedDir,
  removeDirs,
  removeFiles,
  writeFileToCopiedDir,
} from "../utils.mjs";

export const removedFiles = /** @type {const} */ ([
  // removed
  "src/middleware.ts",
  "src/middleware.test.ts",
  "src/app/_actions/items.ts",
  "src/app/_actions/items.test.ts",
  "src/app/_actions/users.ts",
  "src/app/_actions/users.test.ts",
  "src/app/_hooks/useOnlineStatus.ts",
  "src/app/_hooks/useOnlineStatus.test.ts",
  "src/app/_schemas/items.ts",
  "src/app/_schemas/items.test.ts",
  "src/app/_schemas/users.ts",
  "src/app/_schemas/users.test.ts",
  "src/app/_utils/date.ts",
  "src/app/_utils/date.test.ts",
  "src/app/forbidden.tsx",
  "src/app/unauthorized.tsx",
  "src/app/opengraph-image.tsx",
  "src/app/favicon.ico",

  // e2e
  "e2e/integrations/me.test.ts",
  "e2e/integrations/top.test.ts",
  "e2e/models/MePage.ts",
  "e2e/models/TopPage.ts",
  "e2e/models/SignInPage.ts",

  // others
  "prisma/ERD.md",
]);

export const removedDirs = /** @type {const} */ ([
  "src/app/(private)/me",
  "src/app/(public)/signin",
  "src/app/@dialog",
]);

export const modifiedFiles = /** @type {const} */ ([
  "next.config.ts",
  "src/app/layout.tsx",
  "src/app/(public)/page.tsx",
  "prisma/schema.prisma",
]);

export async function sampleCode(answer, isSkipQuestion) {
  const fences = [["/* start: sample */", "/* end: sample */"]];

  await executeOptionalQuestion({
    question: "> Do you want to remove sample application code? (y/N) ",
    answer,
    isSkipQuestion,
    codeAndFenceList: [
      [modifiedFiles[0], fences[0]],
      [modifiedFiles[1], fences[0]],
    ],
    yesCallback: async () => {
      await Promise.all([
        removeItemModelFromPrisma(),
        removeFiles(removedFiles),
        removeDirs(removedDirs),
        writeFileToCopiedDir(
          modifiedFiles[1],
          `
import { clsx } from "clsx";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "",
  description: "",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={clsx("bg-gray-800 text-gray-200", inter.className)}>
        <main>{children}</main>
      </body>
    </html>
  );
}
        `.trim(),
        ),
        writeFileToCopiedDir(
          modifiedFiles[2],
          `
export default async function Page() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-2xl">Hello World 😄</h1>
    </div>
  );
}

          `.trim(),
        ),
      ]);
    },
  });
}

async function removeItemModelFromPrisma() {
  const data = await readFileFromCopiedDir(modifiedFiles[3]);
  const modelName = "Item";
  const modelRegex = new RegExp(
    `model\\s+${modelName}\\s+\\{[^\\}]*\\}\\n*`,
    "g",
  );
  let updatedSchema = data.replace(modelRegex, "");

  const fieldRegex = new RegExp(`\\s+\\w+\\s+${modelName}\\[\\]\\s*;?`, "g");
  updatedSchema = updatedSchema.replace(fieldRegex, "");

  // @@
  updatedSchema = updatedSchema.replace(
    /([^\n])(\s*@@\w+\s*\(.*?\))/g,
    "$1\n$2",
  );
  updatedSchema = updatedSchema.replace(/([^\n])(\s*@@\w+)/g, "$1\n$2"); // @@ユニークやインデックス系
  updatedSchema = updatedSchema.replace(/(\w)\s+(\/\/)/g, "$1\n$2"); // コメントの位置を修正

  await writeFileToCopiedDir(modifiedFiles[3], updatedSchema);
}

// async function cleanUpNextConfig() {
//   const data = await readFileFromCopiedDir("next.config.ts");
//   const sourceFile = ts.createSourceFile(
//     "next.config.ts",
//     data,
//     ts.ScriptTarget.Latest,
//     true,
//   );

//   function visit(context) {
//     return (rootNode) => {
//       function visitor(node) {
//         if (
//           ts.isVariableDeclaration(node) &&
//           node.name.getText() === "nextConfig" &&
//           node.initializer &&
//           ts.isObjectLiteralExpression(node.initializer)
//         ) {
//           return ts.factory.updateVariableDeclaration(
//             node,
//             node.name,
//             node.exclamationToken,
//             node.type,
//             ts.factory.createObjectLiteralExpression([], false),
//           );
//         }
//         return ts.visitEachChild(node, visitor, context);
//       }
//       return ts.visitNode(rootNode, visitor);
//     };
//   }

//   const result = ts.transform(sourceFile, [visit]);
//   const updatedSourceFile = result.transformed[0];
//   const printer = ts.createPrinter();
//   const updatedContent = printer.printFile(updatedSourceFile);

//   await writeFileToCopiedDir("next.config.ts", updatedContent);
// }
