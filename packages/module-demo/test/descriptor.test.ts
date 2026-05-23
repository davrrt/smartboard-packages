import { describe, it, expect } from "vitest";
import { moduleDescriptorSchema } from "@smartboard/contracts";
import { demoDescriptor } from "../src/backend/descriptor";

describe("demoDescriptor", () => {
  it("est un descripteur valide", () => {
    expect(() => moduleDescriptorSchema.parse(demoDescriptor)).not.toThrow();
  });
  it("déclare ses permissions et sa nav", () => {
    expect(demoDescriptor.permissions).toContain("demo.read");
    expect(demoDescriptor.navigation[0].route).toBe("/demo");
  });
});
