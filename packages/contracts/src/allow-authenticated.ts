import "reflect-metadata";

export const ALLOW_AUTHENTICATED_KEY = "smartboard:allowAuthenticated";

// Marque une route comme accessible à TOUT utilisateur authentifié (aucune permission
// ni niveau requis). Rend la posture d'accès EXPLICITE : sans l'un des décorateurs
// d'accès (@RequirePermissions / @RequireLevel / @AllowAuthenticated), la route est
// refusée par défaut (secure-by-default).
export function AllowAuthenticated(): MethodDecorator & ClassDecorator {
  return (target: any, _propertyKey?: string | symbol, descriptor?: any) => {
    const ref = descriptor?.value ?? target;
    Reflect.defineMetadata(ALLOW_AUTHENTICATED_KEY, true, ref);
    return descriptor ?? target;
  };
}
