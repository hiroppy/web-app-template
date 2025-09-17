import type { Session } from "next-auth";
import { auth } from "../_clients/nextAuth";
import type { Result } from "../_types/result";

export async function getSessionOrReject(): Promise<Result<Session, void>> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "no session token",
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch {
    return {
      success: false,
      message: "no session token",
    };
  }
}
