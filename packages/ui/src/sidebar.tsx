"use client";
import { useState, type ComponentType, type ReactNode } from "react";
import { cn } from "./cn";
import { Icon } from "./icon-registry";

export interface NavEntry {
  label: string;
  route: string;
  icon?: string;
}

// Type de lien permissif : accepte le <Link> de Next comme une simple <a>.
type LinkComponent = ComponentType<{ href: string } & Record<string, any>>;
const DefaultLink: LinkComponent = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>{children}</a>
);

export interface SidebarProps {
  logo: { src?: string; appName: string };
  items: NavEntry[];
  activePath: string;
  linkComponent?: LinkComponent;
  footer?: ReactNode;
  collapsible?: boolean;
}

const STORAGE_KEY = "sb-sidebar-collapsed";

export function Sidebar({ logo, items, activePath, linkComponent, footer, collapsible }: SidebarProps) {
  const Link = linkComponent ?? DefaultLink;
  const [collapsed, setCollapsed] = useState<boolean>(
    () => typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "1",
  );
  const toggle = () =>
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "flex h-screen flex-col border-r border-border-card bg-surface transition-all",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        {logo.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.src} alt="" className="h-8 w-8 object-contain" />
        ) : (
          <div className="h-8 w-8 shrink-0 rounded bg-primary" />
        )}
        {!collapsed && <span className="truncate font-semibold text-fg">{logo.appName}</span>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {items.map((item) => {
          const active = activePath === item.route;
          return (
            <Link
              key={item.route}
              href={item.route}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-surface-hover font-medium text-primary" : "text-fg hover:bg-surface-hover",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon name={item.icon} className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {footer && <div className="border-t border-border-card p-2">{footer}</div>}

      {collapsible && (
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Déplier" : "Replier"}
          className="m-2 flex h-8 items-center justify-center rounded-lg text-muted hover:bg-surface-hover"
        >
          {collapsed ? "»" : "«"}
        </button>
      )}
    </aside>
  );
}
