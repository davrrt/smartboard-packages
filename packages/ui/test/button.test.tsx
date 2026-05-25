import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../src/button";

describe("Button", () => {
  it("primary brand : fond primaire + texte on-primary", () => {
    render(<Button>OK</Button>);
    const btn = screen.getByRole("button", { name: "OK" });
    expect(btn.className).toContain("bg-primary");
    expect(btn.className).toContain("text-on-primary");
  });
  it("tone danger : fond danger", () => {
    render(<Button tone="danger">Suppr</Button>);
    expect(screen.getByRole("button").className).toContain("bg-danger");
  });
  it("secondary : bordure + surface", () => {
    render(<Button variant="secondary">Annuler</Button>);
    const c = screen.getByRole("button").className;
    expect(c).toContain("border-border-card");
    expect(c).toContain("bg-surface");
  });
  it("ghost : transparent (pas de bg-primary)", () => {
    render(<Button variant="ghost">x</Button>);
    expect(screen.getByRole("button").className).not.toContain("bg-primary");
  });
  it("ghost danger : texte danger", () => {
    render(<Button variant="ghost" tone="danger">x</Button>);
    expect(screen.getByRole("button").className).toContain("text-danger");
  });
  it("loading : disabled", () => {
    render(<Button loading>Go</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
