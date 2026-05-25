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

  it("listUsers GET /v1/admin/users", async () => {
    const data = [{ id: "u1", email: "a@b.co", displayName: "A", roles: ["admin"], level: 5 }];
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => data });
    vi.stubGlobal("fetch", fetchMock);
    const c = createSmartboardClient({ baseUrl: "http://x", getToken: () => "admin" });
    expect(await c.listUsers()).toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith("http://x/v1/admin/users", { headers: { Authorization: "Bearer admin" } });
  });

  it("listRoles GET /v1/admin/roles", async () => {
    const data = [{ key: "admin", label: "Administrateur", level: 5 }];
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => data });
    vi.stubGlobal("fetch", fetchMock);
    const c = createSmartboardClient({ baseUrl: "http://x", getToken: () => "admin" });
    expect(await c.listRoles()).toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith("http://x/v1/admin/roles", { headers: { Authorization: "Bearer admin" } });
  });

  it("assignRole POST .../roles avec body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    const c = createSmartboardClient({ baseUrl: "http://x", getToken: () => "admin" });
    await c.assignRole("u1", "lecteur");
    expect(fetchMock).toHaveBeenCalledWith("http://x/v1/admin/users/u1/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer admin" },
      body: JSON.stringify({ roleKey: "lecteur" }),
    });
  });

  it("removeRole DELETE .../roles/:key", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    const c = createSmartboardClient({ baseUrl: "http://x", getToken: () => "admin" });
    await c.removeRole("u1", "admin");
    expect(fetchMock).toHaveBeenCalledWith("http://x/v1/admin/users/u1/roles/admin", {
      method: "DELETE",
      headers: { Authorization: "Bearer admin" },
    });
  });
});
