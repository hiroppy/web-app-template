import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useOnlineStatus } from "./useOnlineStatus";

describe("hooks/useOnlineStatus", () => {
  function setNavigatorOnline(online: boolean) {
    Object.defineProperty(window.navigator, "onLine", {
      writable: true,
      value: online,
    });
  }

  beforeEach(() => {
    setNavigatorOnline(true);

    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  test("should return the current online status", () => {
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current.isOnline).toBe(true);

    act(() => {
      setNavigatorOnline(false);
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current.isOnline).toBe(false);

    act(() => {
      setNavigatorOnline(true);
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current.isOnline).toBe(true);
  });

  test("should add and remove event listeners", () => {
    const { unmount } = renderHook(() => useOnlineStatus());

    expect(window.addEventListener).toHaveBeenCalledWith(
      "online",
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      "offline",
      expect.any(Function),
    );

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "online",
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "offline",
      expect.any(Function),
    );
  });
});
