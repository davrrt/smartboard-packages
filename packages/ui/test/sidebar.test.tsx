import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar, type NavEntry } from "../src/sidebar";

const items: NavEntry[] = [
  { label: "Démo", route: "/demo", icon: "box" },
  { label: "Notes", route: "/notes", icon: "file-text" },
];

beforeEach(() => window.localStorage.clear());

describe("Sidebar", () => {
  it("déplié : rend le nom de marque + les labels + liens", () => {
    render(<Sidebar logo={{ appName: "ACME" }} items={items} activePath="/demo" />);
    expect(screen.getByText("ACME")).toBeInTheDocument();
    expect(screen.getByText("Démo")).toBeInTheDocument();
    const links = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/demo", "/notes"]);
  });

  it("item actif surligné (classe text-primary)", () => {
    render(<Sidebar logo={{ appName: "ACME" }} items={items} activePath="/notes" />);
    const active = screen.getByRole("link", { name: /Notes/ });
    expect(active.className).toContain("text-primary");
  });

  it("replié (toggle) : labels masqués, tooltip via title", () => {
    render(<Sidebar collapsible logo={{ appName: "ACME" }} items={items} activePath="/demo" />);
    fireEvent.click(screen.getByRole("button", { name: "Replier" }));
    expect(screen.queryByText("Démo")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")[0]).toHaveAttribute("title", "Démo");
  });

  it("footer rendu", () => {
    render(<Sidebar logo={{ appName: "ACME" }} items={items} activePath="/demo" footer={<div>FOOT</div>} />);
    expect(screen.getByText("FOOT")).toBeInTheDocument();
  });

  it("utilise le linkComponent injecté", () => {
    const CustomLink = ({ href, children }: any) => (
      <a href={href} data-custom="1">{children}</a>
    );
    render(<Sidebar logo={{ appName: "ACME" }} items={items} activePath="/demo" linkComponent={CustomLink} />);
    expect(screen.getAllByRole("link")[0]).toHaveAttribute("data-custom", "1");
  });
});
