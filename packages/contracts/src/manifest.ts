import { z } from "zod";
import { hasPermission, type PermissionKey } from "./rbac";
import { navItemSchema, type ModuleDescriptor, type NavItem } from "./module";

export interface ManifestUser {
  id: string;
  displayName: string;
}
export interface EnabledModule {
  id: string;
  version: string;
}
export interface Branding {
  appName: string;
  logoUrl?: string;
  theme: Record<string, string>;
}
export interface Manifest {
  user: ManifestUser;
  roles: string[];
  permissions: PermissionKey[];
  modules: EnabledModule[];
  navigation: NavItem[];
  branding: Branding;
}

export interface AssembleManifestInput {
  user: ManifestUser;
  roleKeys: string[];
  permissions: PermissionKey[];
  branding: Branding;
  enabledModules: Array<{ id: string; version: string; descriptor: ModuleDescriptor }>;
}

export function assembleManifest(input: AssembleManifestInput): Manifest {
  const navigation: NavItem[] = [];
  const modules: EnabledModule[] = [];
  for (const m of input.enabledModules) {
    modules.push({ id: m.id, version: m.version });
    for (const item of m.descriptor.navigation) {
      if (hasPermission(input.permissions, item.requires ?? "")) {
        navigation.push(item);
      }
    }
  }
  return {
    user: input.user,
    roles: input.roleKeys,
    permissions: input.permissions,
    modules,
    navigation,
    branding: input.branding,
  };
}

export const brandingSchema = z.object({
  appName: z.string(),
  logoUrl: z.string().optional(),
  theme: z.record(z.string()),
});

export const manifestSchema = z.object({
  user: z.object({ id: z.string(), displayName: z.string() }),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  modules: z.array(z.object({ id: z.string(), version: z.string() })),
  navigation: z.array(navItemSchema),
  branding: brandingSchema,
});
