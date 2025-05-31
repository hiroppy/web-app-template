import { createServer } from "node:http";

export async function getRandomPort() {
  return new Promise<number>((resolve) => {
    const server = createServer((req, res) => {
      res.end("");
    });

    server.listen(0);

    server.on("listening", () => {
      const address = server.address();
      const port = address && typeof address === "object" ? address.port : null;

      if (port) {
        server.close();
        resolve(port);
      }
    });
  });
}
