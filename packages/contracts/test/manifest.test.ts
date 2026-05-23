import { describe, it, expect } from "vitest";
import { assembleManifest, manifestSchema } from "../src/manifest";

const base = {
  user: { id: "u1", displayName: "Alice" },
  roleKeys: ["admin"],
  permissions: ["*"],
  level: 5,
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
          { label: "Admin", route: "/demo/admin", minLevel: 3 },
        ],
      },
    },
  ],
};

describe("assembleManifest", () => {
  it("admin (perms * + niveau 5) voit toute la nav", () => {
    const m = assembleManifest(base);
    expect(m.navigation.map((n) => n.route)).toEqual(["/demo", "/demo/settings", "/demo/admin"]);
    expect(m.level).toBe(5);
    expect(m.modules).toEqual([{ id: "demo", version: "0.1.0" }]);
  });

  it("filtre par permission ET par niveau", () => {
    const m = assembleManifest({ ...base, permissions: ["demo.read"], level: 1, roleKeys: ["lecteur"] });
    // /demo : perm ok, pas de minLevel -> visible
    // /demo/settings : perm demo.write absente -> masqué
    // /demo/admin : niveau 1 < 3 -> masqué
    expect(m.navigation.map((n) => n.route)).toEqual(["/demo"]);
    expect(m.level).toBe(1);
  });

  it("masque un module entier si son minLevel n'est pas atteint", () => {
    const input = {
      ...base,
      permissions: ["*"],
      level: 1,
      enabledModules: [
        {
          id: "pro",
          version: "1.0.0",
          descriptor: {
            id: "pro",
            version: "1.0.0",
            minLevel: 3,
            permissions: [],
            navigation: [{ label: "Pro", route: "/pro" }],
          },
        },
      ],
    };
    const m = assembleManifest(input);
    expect(m.modules).toEqual([]);
    expect(m.navigation).toEqual([]);
  });

  it("produit un manifeste valide (zod) avec level", () => {
    const m = assembleManifest(base);
    expect(() => manifestSchema.parse(m)).not.toThrow();
  });
});
