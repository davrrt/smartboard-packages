#!/usr/bin/env node
// Générateur de module Smartboard.
// Usage : pnpm gen:module <nom-en-kebab-case>   (ex: notes, patient-suivi)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error("Usage : pnpm gen:module <nom-en-kebab-case>   (ex: notes, patient-suivi)");
  process.exit(1);
}

const parts = name.split("-");
const camel = parts.map((s, i) => (i === 0 ? s : s[0].toUpperCase() + s.slice(1))).join("");
const Pascal = parts.map((s) => s[0].toUpperCase() + s.slice(1)).join("");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "packages", `module-${name}`);

// Estampille la version de contrat courante (M1) : le module nait en ciblant le
// contrat du socle au moment de sa génération.
const contractVersion =
  (readFileSync(join(root, "packages/contracts/src/version.ts"), "utf8").match(
    /CONTRACT_VERSION\s*=\s*"([^"]+)"/,
  ) || [])[1] || "1.0.0";
if (existsSync(dir)) {
  console.error(`Le module existe déjà : ${dir}`);
  process.exit(1);
}

const files = {
  "package.json":
    JSON.stringify(
      {
        name: `@smartboard/module-${name}`,
        version: "0.1.0",
        exports: {
          "./backend": {
            types: "./dist/backend/index.d.ts",
            default: "./dist/backend/index.js",
          },
        },
        typesVersions: { "*": { backend: ["dist/backend/index.d.ts"] } },
        scripts: { build: "tsc -p tsconfig.json", test: "vitest run" },
        peerDependencies: { "@nestjs/common": "^10.0.0", "@smartboard/contracts": "*" },
        devDependencies: {
          "@nestjs/common": "^10.3.0",
          "@smartboard/contracts": "workspace:*",
          "reflect-metadata": "^0.2.2",
          rxjs: "^7.8.1",
          vitest: "^1.6.0",
          typescript: "^5.4.5",
        },
      },
      null,
      2,
    ) + "\n",

  "tsconfig.json":
    JSON.stringify(
      {
        extends: "../../tsconfig.base.json",
        compilerOptions: {
          outDir: "dist",
          rootDir: "src",
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
        include: ["src"],
      },
      null,
      2,
    ) + "\n",

  "src/backend/descriptor.ts": `import type { ModuleDescriptor } from "@smartboard/contracts";

export const ${camel}Descriptor: ModuleDescriptor = {
  id: "${name}",
  version: "0.1.0",
  contractVersion: "${contractVersion}", // version du contrat @smartboard ciblée — vérifiée au boot (M1)
  minLevel: 1, // niveau minimum requis pour voir/utiliser ce module
  permissions: ["${name}.read"],
  navigation: [
    { label: "${Pascal}", icon: "box", route: "/${name}", requires: "${name}.read" },
  ],
  // requiredTier: "pro", // hook payant (réservé, non appliqué pour l'instant)
};
`,

  [`src/backend/${name}.service.ts`]: `import { Injectable } from "@nestjs/common";

@Injectable()
export class ${Pascal}Service {
  list() {
    return [{ id: "1", name: "Exemple ${name}" }];
  }
}
`,

  [`src/backend/${name}.controller.ts`]: `import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "@smartboard/contracts";
import { ${Pascal}Service } from "./${name}.service";

@Controller("${name}")
export class ${Pascal}Controller {
  constructor(private readonly service: ${Pascal}Service) {}

  @Get()
  @RequirePermissions("${name}.read")
  list() {
    return this.service.list();
  }
}
`,

  [`src/backend/${name}.module.ts`]: `import { Module } from "@nestjs/common";
import { ${Pascal}Controller } from "./${name}.controller";
import { ${Pascal}Service } from "./${name}.service";

@Module({
  controllers: [${Pascal}Controller],
  providers: [${Pascal}Service],
})
export class ${Pascal}BackendModule {}
`,

  "src/backend/index.ts": `export { ${Pascal}BackendModule } from "./${name}.module";
export { ${camel}Descriptor } from "./descriptor";
`,

  "test/descriptor.test.ts": `import { describe, it, expect } from "vitest";
import { moduleDescriptorSchema } from "@smartboard/contracts";
import { ${camel}Descriptor } from "../src/backend/descriptor";

describe("${camel}Descriptor", () => {
  it("est un descripteur valide", () => {
    expect(() => moduleDescriptorSchema.parse(${camel}Descriptor)).not.toThrow();
  });
});
`,
};

for (const [rel, content] of Object.entries(files)) {
  const p = join(dir, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

console.log(`✅ Module @smartboard/module-${name} créé dans packages/module-${name}`);
console.log(`
Prochaines étapes :
  1. pnpm install
  2. pnpm --filter @smartboard/module-${name} build
  3. Dans smartboard-backend, ajouter la dépendance liée :
       "@smartboard/module-${name}": "link:../smartboard-packages/packages/module-${name}"
  4. L'enregistrer dans src/modules/modules.module.ts :
       import { ${Pascal}BackendModule, ${camel}Descriptor } from "@smartboard/module-${name}/backend";
       -> ajouter ${Pascal}BackendModule aux imports et ${camel}Descriptor au tableau MODULE_REGISTRY
  5. L'activer (seed ModuleConfig { key: "${name}", enabled: true } ou futur endpoint admin)
`);
