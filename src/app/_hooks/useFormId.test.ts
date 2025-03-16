import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useFormId } from "./useFormId";

describe("hooks/useFormId", () => {
  test("should return id and errorId", () => {
    const { result } = renderHook(() => useFormId());

    expect(result.current.id).toBeDefined();
    expect(typeof result.current.id).toBe("string");

    expect(result.current.errorId).toBeDefined();
    expect(typeof result.current.errorId).toBe("string");
  });

  test("errorId should be derived from id", () => {
    const { result } = renderHook(() => useFormId());

    expect(result.current.errorId).toBe(`${result.current.id}-error`);
  });
});
