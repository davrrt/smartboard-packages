import { describe, it, expect } from "vitest";
import { cn } from "../src/cn";

describe("cn", () => {
  it("concatène les classes conditionnelles", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
  it("fusionne les classes Tailwind en conflit (dernière gagne)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
