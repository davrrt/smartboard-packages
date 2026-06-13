import {
  Box,
  Calendar,
  FileText,
  Home,
  LayoutDashboard,
  Shield,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

// Mapping string (contrat agnostique) -> composant lucide. Étendre au besoin.
const registry: Record<string, LucideIcon> = {
  box: Box,
  calendar: Calendar,
  "file-text": FileText,
  home: Home,
  "layout-dashboard": LayoutDashboard,
  shield: Shield,
  settings: Settings,
  users: Users,
};

export const iconNames = Object.keys(registry);

export function Icon({ name, className }: { name?: string; className?: string }) {
  const Cmp = (name && registry[name]) || Box; // fallback neutre, jamais d'erreur
  return <Cmp className={className} aria-hidden />;
}
