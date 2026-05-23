export type PermissionKey = string; // ex: "demo.read", "demo.*", "*"

export function hasPermission(granted: string[], required: string): boolean {
  if (!required) return true;
  if (granted.includes("*")) return true;
  if (granted.includes(required)) return true;
  const namespace = required.split(".")[0];
  return granted.includes(`${namespace}.*`);
}
