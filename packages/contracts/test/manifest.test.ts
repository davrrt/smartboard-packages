import { describe, it, expect } from "vitest";
import { assembleManifest, manifestSchema } from "../src/manifest";

const base = {
  user: { id: "u1", displayName: "Alice" },
  roleKeys: ["admin"],
  permissions: ["*"],
  branding: { appName: "Demo", theme: {} },
  enabledModules: [
    {
      id: "demo",
      version: "0.1.0",
      descriptor: {
        id: "demo",
        version: "0.1.0",
        permissions: ["demo.read", "demo.write"],
        navigation: [
          { label: "Démo", route: "/demo", requires: "demo.read" },
          { label: "Réglages", route: "/demo/settings", requires: "demo.write" },
        ],
      },
    },
  ],
};

describe("assembleManifest", () => {
  it("inclut toute la nav pour un admin (wildcard)", () => {
    const m = assembleManifest(base);
    expect(m.navigation.map((n) => n.route)).toEqual(["/demo", "/demo/settings"]);
    expect(m.modules).toEqual([{ id: "demo", version: "0.1.0" }]);
  });

  it("filtre la nav selon les permissions effectives", () => {
    const m = assembleManifest({ ...base, permissions: ["demo.read"], roleKeys: ["lecteur"] });
    expect(m.navigation.map((n) => n.route)).toEqual(["/demo"]);
  });

  it("produit un manifeste valide selon le schéma zod", () => {
    const m = assembleManifest(base);
    expect(() => manifestSchema.parse(m)).not.toThrow();
  });
});
