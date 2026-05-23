import { describe, it, expect } from "vitest";
import { hasPermission } from "../src/rbac";

describe("hasPermission", () => {
  it("retourne true sur match exact", () => {
    expect(hasPermission(["demo.read"], "demo.read")).toBe(true);
  });
  it("retourne false si absent", () => {
    expect(hasPermission(["demo.read"], "demo.write")).toBe(false);
  });
  it("wildcard global '*' accorde tout", () => {
    expect(hasPermission(["*"], "demo.write")).toBe(true);
  });
  it("wildcard de namespace 'demo.*' accorde demo.read", () => {
    expect(hasPermission(["demo.*"], "demo.read")).toBe(true);
  });
  it("wildcard de namespace n'accorde pas un autre namespace", () => {
    expect(hasPermission(["demo.*"], "billing.read")).toBe(false);
  });
  it("requis vide => autorisé", () => {
    expect(hasPermission([], "")).toBe(true);
  });
});
