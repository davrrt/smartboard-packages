import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "../src/icon-registry";

describe("Icon", () => {
  it("rend une icône connue (svg)", () => {
    const { container } = render(<Icon name="box" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
  it("rend un fallback pour une clé inconnue (pas d'erreur)", () => {
    const { container } = render(<Icon name="cle-bidon" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
  it("rend le fallback si name absent", () => {
    const { container } = render(<Icon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
