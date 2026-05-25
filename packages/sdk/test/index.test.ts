import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSmartboardClient, UnauthorizedError, SmartboardApiError } from "../src/index";

describe("createSmartboardClient", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("getManifest frappe /v1/me/manifest avec le token en Bearer et parse le manifeste", async () => {
    const manifest = { user: { id: "u1", displayName: "A" }, navigation: [] };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => manifest });
    vi.stubGlobal("fetch", fetchMock);
    const client = createSmartboardClient({ baseUrl: "http://x", getToken: () => "admin" });
    const res = await client.getManifest();
    expect(fetchMock).toHaveBeenCalledWith("http://x/v1/me/manifest", {
      headers: { Authorization: "Bearer admin" },
    });
    expect(res).toEqual(manifest);
  });

  it("mappe 401 → UnauthorizedError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    const client = createSmartboardClient({ baseUrl: "http://x", getToken: () => undefined });
    await expect(client.getManifest()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("mappe un statut non-2xx → SmartboardApiError(status)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    const client = createSmartboardClient({ baseUrl: "http://x", getToken: () => "admin" });
    await expect(client.getManifest()).rejects.toBeInstanceOf(SmartboardApiError);
  });

  it("updateBranding fait un PATCH /v1/admin/branding avec body + Bearer", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    const client = createSmartboardClient({ baseUrl: "http://x", getToken: () => "admin" });
    await client.updateBranding({ appName: "ACME", primaryColor: "#123456" });
    expect(fetchMock).toHaveBeenCalledWith("http://x/v1/admin/branding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer admin" },
      body: JSON.stringify({ appName: "ACME", primaryColor: "#123456" }),
    });
  });
});
