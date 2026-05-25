export type { Manifest } from "@smartboard/contracts";
import type { Manifest } from "@smartboard/contracts";

export interface SmartboardClientOptions {
  baseUrl: string;
  getToken: () => string | undefined | Promise<string | undefined>;
}

export interface BrandingUpdate {
  appName?: string;
  logoUrl?: string;
  primaryColor?: string;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class SmartboardApiError extends Error {
  constructor(public readonly status: number) {
    super(`Smartboard API error ${status}`);
    this.name = "SmartboardApiError";
  }
}

export interface SmartboardClient {
  getManifest(): Promise<Manifest>;
  updateBranding(input: BrandingUpdate): Promise<void>;
}

export function createSmartboardClient(opts: SmartboardClientOptions): SmartboardClient {
  return {
    async getManifest(): Promise<Manifest> {
      const token = await opts.getToken();
      const res = await fetch(`${opts.baseUrl}/v1/me/manifest`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new SmartboardApiError(res.status);
      return (await res.json()) as Manifest;
    },
    async updateBranding(input: BrandingUpdate): Promise<void> {
      const token = await opts.getToken();
      const res = await fetch(`${opts.baseUrl}/v1/admin/branding`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(input),
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new SmartboardApiError(res.status);
    },
  };
}
