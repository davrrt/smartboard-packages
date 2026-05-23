import type { ModuleDescriptor } from "@smartboard/contracts";

export const demoDescriptor: ModuleDescriptor = {
  id: "demo",
  version: "0.1.0",
  permissions: ["demo.read", "demo.write"],
  navigation: [
    { label: "Démo", icon: "box", route: "/demo", requires: "demo.read" },
  ],
};
