import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge single class name", () => {
    const result = cn("text-red-500");
    expect(result).toBe("text-red-500");
  });

  it("should merge multiple class names", () => {
    const result = cn("text-red-500", "bg-blue-500", "p-4");
    expect(result).toContain("text-red-500");
    expect(result).toContain("bg-blue-500");
    expect(result).toContain("p-4");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toContain("base-class");
    expect(result).toContain("active-class");
  });

  it("should filter out false/null/undefined values", () => {
    const result = cn("base-class", false && "hidden", null, undefined, "visible");
    expect(result).toContain("base-class");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("should merge conflicting Tailwind classes correctly", () => {
    // tailwind-merge should keep the last class when there's a conflict
    const result = cn("p-4", "p-8");
    expect(result).toBe("p-8");
  });

  it("should handle arrays of classes", () => {
    const result = cn(["text-red-500", "bg-blue-500"]);
    expect(result).toContain("text-red-500");
    expect(result).toContain("bg-blue-500");
  });

  it("should handle objects with boolean values", () => {
    const result = cn({
      "text-red-500": true,
      "bg-blue-500": false,
      "p-4": true,
    });
    expect(result).toContain("text-red-500");
    expect(result).not.toContain("bg-blue-500");
    expect(result).toContain("p-4");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle complex combinations", () => {
    const isActive = true;
    const result = cn(
      "base-class",
      ["array-class-1", "array-class-2"],
      {
        "object-class-1": true,
        "object-class-2": false,
      },
      isActive && "conditional-class"
    );
    expect(result).toContain("base-class");
    expect(result).toContain("array-class-1");
    expect(result).toContain("array-class-2");
    expect(result).toContain("object-class-1");
    expect(result).not.toContain("object-class-2");
    expect(result).toContain("conditional-class");
  });
});
