import type { ModuleDescriptor } from "@smartboard/contracts";

export const demoDescriptor: ModuleDescriptor = {
  id: "demo",
  version: "0.1.0",
  contractVersion: "1.0.0", // version du contrat @smartboard ciblée — vérifiée au boot (M1)
  minLevel: 1,
  permissions: ["demo.read", "demo.write"],
  navigation: [
    { label: "Démo", icon: "box", route: "/demo", requires: "demo.read" },
    { label: "Admin Démo", icon: "shield", route: "/demo/admin", minLevel: 3 },
  ],
};
