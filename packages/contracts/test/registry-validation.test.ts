import { describe, it, expect } from "vitest";
import type { ModuleDescriptor } from "../src/module";
import { CONTRACT_VERSION } from "../src/version";
import { validateModuleRegistry } from "../src/registry-validation";

// Descripteur minimal valide, namespacé sous `id`, ciblant le contrat courant.
function mod(id: string, over: Partial<ModuleDescriptor> = {}): ModuleDescriptor {
  return {
    id,
    version: "0.1.0",
    contractVersion: CONTRACT_VERSION,
    permissions: [`${id}.read`],
    navigation: [{ label: id, route: `/${id}`, requires: `${id}.read` }],
    ...over,
  };
}

describe("validateModuleRegistry — M1 (versionnement du contrat)", () => {
  it("registre valide → ne lève pas", () => {
    expect(() => validateModuleRegistry([mod("demo"), mod("notes")])).not.toThrow();
  });

  it("module sans contractVersion (legacy) → toléré", () => {
    expect(() => validateModuleRegistry([mod("demo", { contractVersion: undefined })])).not.toThrow();
  });

  it("majeur de contrat différent → fail-fast avec message clair", () => {
    expect(() => validateModuleRegistry([mod("legacy", { contractVersion: "2.0.0" })], "1.4.0")).toThrow(
      /legacy.*contrat.*2\.0\.0.*1\.4\.0|incompatible/i,
    );
  });

  it("montée mineure (même majeur) → compatible, ne lève pas", () => {
    expect(() => validateModuleRegistry([mod("demo", { contractVersion: "1.0.0" })], "1.5.0")).not.toThrow();
  });

  it("contractVersion non parseable → fail-fast", () => {
    expect(() => validateModuleRegistry([mod("demo", { contractVersion: "abc" })], "1.0.0")).toThrow();
  });
});

describe("validateModuleRegistry — M2 (anti-collision au démarrage)", () => {
  it("deux modules avec le même id → fail-fast", () => {
    expect(() => validateModuleRegistry([mod("demo"), mod("demo")])).toThrow(/id.*demo|collision/i);
  });

  it("deux modules avec la même route de nav → fail-fast", () => {
    const a = mod("a");
    const b = mod("b", { navigation: [{ label: "B", route: "/a", requires: "b.read" }] });
    expect(() => validateModuleRegistry([a, b])).toThrow(/route.*\/a|collision/i);
  });

  it("permission non namespacée sous l'id du module → fail-fast", () => {
    const m = mod("demo", { permissions: ["notes.read"] });
    expect(() => validateModuleRegistry([m])).toThrow(/notes\.read.*demo|namespac/i);
  });

  it("permission égale à l'id nu (ex. \"demo\") → tolérée", () => {
    const m = mod("demo", { permissions: ["demo", "demo.read"] });
    expect(() => validateModuleRegistry([m])).not.toThrow();
  });
});
