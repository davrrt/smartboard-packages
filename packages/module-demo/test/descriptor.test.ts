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
  it("expose un niveau de module et une entrée gardée par niveau", () => {
    expect(demoDescriptor.minLevel).toBe(1);
    const admin = demoDescriptor.navigation.find((n) => n.route === "/demo/admin");
    expect(admin?.minLevel).toBe(3);
  });
});
