import { z } from "zod";
import type { PermissionKey } from "./rbac";

export interface NavItem {
  label: string;
  icon?: string;
  route: string;
  requires?: PermissionKey;
  minLevel?: number;
}

export interface ModuleDescriptor {
  id: string;
  version: string;
  contractVersion?: string; // version semver du contrat ciblée — vérifiée au boot (M1)
  permissions: PermissionKey[];
  navigation: NavItem[];
  minLevel?: number;
  requiredTier?: string; // hook payant — réservé, NON appliqué (phase billing)
}

export const navItemSchema = z.object({
  label: z.string(),
  icon: z.string().optional(),
  route: z.string(),
  requires: z.string().optional(),
  minLevel: z.number().optional(),
});

export const moduleDescriptorSchema = z.object({
  id: z.string(),
  version: z.string(),
  contractVersion: z.string().optional(),
  permissions: z.array(z.string()),
  navigation: z.array(navItemSchema),
  minLevel: z.number().optional(),
  requiredTier: z.string().optional(),
});
