import type { ModuleDescriptor } from "@smartboard/contracts";

export const psychoDescriptor: ModuleDescriptor = {
  id: "psycho",
  version: "0.1.0",
  contractVersion: "1.0.0",
  minLevel: 1,
  permissions: ["patients.read", "patients.write", "appointments.read", "appointments.write"],
  navigation: [
    { label: "Patients", icon: "users", route: "/patients", requires: "patients.read" },
    { label: "Calendrier", icon: "calendar", route: "/calendrier", requires: "appointments.read" },
  ],
};
