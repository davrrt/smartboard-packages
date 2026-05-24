import type { ModuleDescriptor } from "./module";
import { CONTRACT_VERSION } from "./version";

function majorOf(version: string): number {
  const major = Number.parseInt(version.split(".")[0] ?? "", 10);
  if (Number.isNaN(major)) {
    throw new Error(`[smartboard] version de contrat invalide : "${version}".`);
  }
  return major;
}

/**
 * Valide le registre de modules au démarrage du socle (M1 + M2). Fail-fast : un
 * registre invalide doit empêcher le boot avec un message clair.
 *
 * M1 — compatibilité du contrat : un module qui déclare `contractVersion` est refusé
 * si son MAJEUR diffère de celui du contrat fourni par le socle (changement cassant).
 * Une montée MINEURE (même majeur) reste compatible. `contractVersion` absent = toléré.
 *
 * M2 — anti-collision : deux modules ne peuvent partager ni `id` ni route de nav, et
 * chaque permission doit être namespacée sous l'`id` de son module (`<id>` ou `<id>.xxx`).
 */
export function validateModuleRegistry(
  modules: ModuleDescriptor[],
  contractVersion: string = CONTRACT_VERSION,
): void {
  const socleMajor = majorOf(contractVersion);
  const seenIds = new Set<string>();
  const routeOwner = new Map<string, string>();

  for (const m of modules) {
    // M2 — id unique entre modules.
    if (seenIds.has(m.id)) {
      throw new Error(`[smartboard] collision : deux modules déclarent l'id "${m.id}".`);
    }
    seenIds.add(m.id);

    // M1 — compatibilité du contrat ciblé.
    if (m.contractVersion !== undefined) {
      const modMajor = majorOf(m.contractVersion);
      if (modMajor !== socleMajor) {
        throw new Error(
          `[smartboard] module "${m.id}" incompatible : il cible le contrat ${m.contractVersion} ` +
            `mais le socle fournit ${contractVersion} (majeur ${modMajor} ≠ ${socleMajor}).`,
        );
      }
    }

    // M2 — permissions namespacées sous l'id du module.
    for (const perm of m.permissions) {
      if (perm !== m.id && !perm.startsWith(`${m.id}.`)) {
        throw new Error(
          `[smartboard] module "${m.id}" : permission "${perm}" non namespacée sous "${m.id}." ` +
            `(namespacing imposé — M2).`,
        );
      }
    }

    // M2 — route de nav unique entre modules.
    for (const nav of m.navigation) {
      const owner = routeOwner.get(nav.route);
      if (owner !== undefined) {
        throw new Error(
          `[smartboard] collision : la route "${nav.route}" est déclarée par "${owner}" et "${m.id}".`,
        );
      }
      routeOwner.set(nav.route, m.id);
    }
  }
}
