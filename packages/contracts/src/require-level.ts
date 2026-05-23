import "reflect-metadata";

export const REQUIRE_LEVEL_KEY = "smartboard:requireLevel";

// Décorateur framework-agnostique : pose le niveau minimum requis via Reflect.
export function RequireLevel(level: number): MethodDecorator & ClassDecorator {
  return (target: any, _propertyKey?: string | symbol, descriptor?: any) => {
    const ref = descriptor?.value ?? target;
    Reflect.defineMetadata(REQUIRE_LEVEL_KEY, level, ref);
    return descriptor ?? target;
  };
}
