import { describe, it, expect } from "vitest";
import { moduleDescriptorSchema } from "@smartboard/contracts";
import { notesDescriptor } from "../src/backend/descriptor";

describe("notesDescriptor", () => {
  it("est un descripteur valide", () => {
    expect(() => moduleDescriptorSchema.parse(notesDescriptor)).not.toThrow();
  });
});
