import { headers } from "next/headers";
import { auth, type User } from "../_clients/betterAuth";
import type { Result } from "../_types/result";

export async function getSessionOrReject(): Promise<Result<User, void>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        message: "no session token",
      };
    }

    return {
      success: true,
      data: session.user,
    };
  } catch {
    return {
      success: false,
      message: "no session token",
    };
  }
}
