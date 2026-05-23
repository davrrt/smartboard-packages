import "reflect-metadata";

export const REQUIRE_PERMISSIONS_KEY = "smartboard:requirePermissions";

// Décorateur framework-agnostique : pose la metadata via Reflect.
// Équivalent fonctionnel de SetMetadata de NestJS (même cible : descriptor.value),
// pour que le Reflector du backend la relise via context.getHandler().
export function RequirePermissions(...perms: string[]): MethodDecorator & ClassDecorator {
  return (target: any, _propertyKey?: string | symbol, descriptor?: any) => {
    const ref = descriptor?.value ?? target;
    Reflect.defineMetadata(REQUIRE_PERMISSIONS_KEY, perms, ref);
    return descriptor ?? target;
  };
}
