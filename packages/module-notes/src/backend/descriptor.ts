import type { ModuleDescriptor } from "@smartboard/contracts";

export const notesDescriptor: ModuleDescriptor = {
  id: "notes",
  version: "0.1.0",
  minLevel: 1, // niveau minimum requis pour voir/utiliser ce module
  permissions: ["notes.read"],
  navigation: [
    { label: "Notes", icon: "box", route: "/notes", requires: "notes.read" },
  ],
  // requiredTier: "pro", // hook payant (réservé, non appliqué pour l'instant)
};
