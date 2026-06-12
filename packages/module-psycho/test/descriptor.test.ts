import { describe, it, expect } from "vitest";
import { moduleDescriptorSchema } from "@smartboard/contracts";
import { psychoDescriptor } from "../src/backend/descriptor";

describe("psychoDescriptor", () => {
  it("est un descripteur valide", () => {
    expect(() => moduleDescriptorSchema.parse(psychoDescriptor)).not.toThrow();
  });
});
