import {
  Bot,
  Box,
  Calendar,
  ChevronDown,
  ClipboardList,
  FileText,
  History,
  Home,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Shield,
  Settings,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

// Mapping string (contrat agnostique) -> composant lucide. Étendre au besoin.
const registry: Record<string, LucideIcon> = {
  bot: Bot,
  box: Box,
  calendar: Calendar,
  "chevron-down": ChevronDown,
  "clipboard-list": ClipboardList,
  "file-text": FileText,
  history: History,
  home: Home,
  "layout-dashboard": LayoutDashboard,
  "message-circle": MessageCircle,
  plus: Plus,
  shield: Shield,
  settings: Settings,
  sparkles: Sparkles,
  users: Users,
};

export const iconNames = Object.keys(registry);

export function Icon({ name, className }: { name?: string; className?: string }) {
  const Cmp = (name && registry[name]) || Box; // fallback neutre, jamais d'erreur
  return <Cmp className={className} aria-hidden />;
}
