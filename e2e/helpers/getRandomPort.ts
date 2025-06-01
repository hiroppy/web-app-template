import { createServer } from "node:http";

export async function getRandomPort() {
  return new Promise<number>((resolve) => {
    const server = createServer();

    server.listen(0, () => {
      const address = server.address();
      const port = address && typeof address === "object" ? address.port : null;

      if (port) {
        server.close();
        resolve(port);
      }
    });
  });
}
