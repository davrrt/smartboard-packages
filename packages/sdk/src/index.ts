export type { Manifest } from "@smartboard/contracts";
import type { Manifest } from "@smartboard/contracts";

export interface SmartboardClientOptions {
  baseUrl: string;
  getToken: () => string | undefined | Promise<string | undefined>;
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export type PatientStatus = "ACTIVE" | "ARCHIVED";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  status: PatientStatus;
  lastSessionDate: string | null;
  nextAppointmentDate: string | null;
  createdAt: string;
}

export interface PatientDetail extends Patient {
  sessionCount: number;
  activeTreatmentCount: number;
  pendingHomeworkCount: number;
  lastSessionNotePreview: string | null;
  lastSessionNoteDate: string | null;
}

export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  birthDate?: string;
  phone?: string;
  email?: string;
}

export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  status?: PatientStatus;
}

// ─── Anamnèse ─────────────────────────────────────────────────────────────────

export interface Anamnesis {
  consultationReason: string | null;
  familyContext: string | null;
  medicalHistory: string | null;
  currentSymptoms: string | null;
}

export interface UpsertAnamnesisInput {
  consultationReason?: string;
  familyContext?: string;
  medicalHistory?: string;
  currentSymptoms?: string;
}

// ─── Rendez-vous & séances ────────────────────────────────────────────────────

export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface SessionNote {
  id: string;
  content: string;
  mood: number | null;
  themes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  date: string;
  duration: number;
  type: string;
  status: AppointmentStatus;
  note: SessionNote | null;
}

export interface CreateAppointmentInput {
  date: string;
  duration?: number;
  type?: string;
}

export interface UpsertSessionNoteInput {
  content: string;
  mood?: number;
  themes?: string[];
}

export interface CalendarAppointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  duration: number;
  type: string;
  status: AppointmentStatus;
}

// ─── Traitements ──────────────────────────────────────────────────────────────

export interface Treatment {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  startDate: string;
  endDate: string | null;
  active: boolean;
}

export interface CreateTreatmentInput {
  name: string;
  dosage?: string;
  frequency?: string;
  startDate: string;
  endDate?: string;
}

// ─── Devoirs ──────────────────────────────────────────────────────────────────

export type HomeworkStatus = "PENDING" | "DONE" | "SKIPPED";

export type HomeworkContentType = 'url' | 'video' | 'image' | 'fichier' | 'texte';

export interface Homework {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: HomeworkStatus;
  createdAt: string;
  contentType: HomeworkContentType | null;
  contentUrl: string | null;
}

export interface CreateHomeworkInput {
  title: string;
  description?: string;
  dueDate?: string;
  notifyAt?: string;
  contentType?: HomeworkContentType;
  contentUrl?: string;
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

export interface TelegramLinkToken {
  token: string;
  expiresAt: string;
}

export interface TelegramStatus {
  linked: boolean;
  linkedAt: string | null;
}

// ─── Évolution ────────────────────────────────────────────────────────────────

export interface Evolution {
  id: string;
  content: string;
  score: number | null;
  createdAt: string;
}

export interface CreateEvolutionInput {
  content: string;
  score?: number;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface BrandingUpdate {
  appName?: string;
  logoUrl?: string;
  primaryColor?: string;
}

export interface AdminUser {
  id: string;
  email: string | null;
  displayName: string | null;
  roles: string[];
  level: number;
}

export interface AdminRole {
  key: string;
  label: string;
  level: number;
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

// ─── Agent IA ─────────────────────────────────────────────────────────────────

export interface AgentSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Array<{ role: string; content: string }>;
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  attachments: Array<{ name: string; type: string; mimeType: string }>;
  createdAt: string;
}

export interface SendMessageInput {
  content: string;
  attachments?: Array<{ name: string; type: "pdf" | "text" | "image"; data: string; mimeType: string }>;
}

export interface SendMessageResult {
  userMessage: AgentMessage;
  assistantMessage: AgentMessage;
}

export interface QuotaStatus {
  plan: string;
  monthlyBudgetUsd: number;
  hardLimitUsd: number;
  spentUsd: number;
  remainingUsd: number;
  percentUsed: number;
  status: "ok" | "warning" | "exceeded";
}

export type RagDocumentStatus = "UPLOADED" | "PROCESSING" | "INDEXED" | "FAILED";

export interface RagDocument {
  id: string;
  title: string;
  mimeType: string;
  status: RagDocumentStatus;
  confidentialityLevel: string;
  patientId: string | null;
  createdAt: string;
  _count?: { chunks: number };
}

// ─── Client interface ─────────────────────────────────────────────────────────

export interface SmartboardClient {
  getManifest(): Promise<Manifest>;
  updateBranding(input: BrandingUpdate): Promise<void>;
  listUsers(): Promise<AdminUser[]>;
  listRoles(): Promise<AdminRole[]>;
  assignRole(userId: string, roleKey: string): Promise<void>;
  removeRole(userId: string, roleKey: string): Promise<void>;
  // Patients
  listPatients(search?: string): Promise<Patient[]>;
  createPatient(input: CreatePatientInput): Promise<Patient>;
  updatePatient(id: string, input: UpdatePatientInput): Promise<Patient>;
  getPatient(id: string): Promise<PatientDetail>;
  // Anamnèse
  getAnamnesis(patientId: string): Promise<Anamnesis | null>;
  upsertAnamnesis(patientId: string, input: UpsertAnamnesisInput): Promise<Anamnesis>;
  // Rendez-vous & séances
  listAllAppointments(from?: string, to?: string): Promise<CalendarAppointment[]>;
  listAppointments(patientId: string): Promise<Appointment[]>;
  createAppointment(patientId: string, input: CreateAppointmentInput): Promise<Appointment>;
  cancelAppointment(patientId: string, appointmentId: string): Promise<Appointment>;
  upsertSessionNote(patientId: string, appointmentId: string, input: UpsertSessionNoteInput): Promise<SessionNote>;
  // Traitements
  listTreatments(patientId: string): Promise<Treatment[]>;
  createTreatment(patientId: string, input: CreateTreatmentInput): Promise<Treatment>;
  toggleTreatment(patientId: string, treatmentId: string): Promise<Treatment>;
  // Devoirs
  listHomework(patientId: string): Promise<Homework[]>;
  createHomework(patientId: string, input: CreateHomeworkInput): Promise<Homework>;
  updateHomeworkStatus(patientId: string, homeworkId: string, status: HomeworkStatus): Promise<Homework>;
  // Évolution
  listEvolution(patientId: string): Promise<Evolution[]>;
  createEvolution(patientId: string, input: CreateEvolutionInput): Promise<Evolution>;
  // Telegram
  generateTelegramToken(patientId: string): Promise<TelegramLinkToken>;
  getTelegramStatus(patientId: string): Promise<TelegramStatus>;
  // Agent IA
  createAgentSession(title?: string): Promise<AgentSession>;
  listAgentSessions(limit?: number): Promise<AgentSession[]>;
  getAgentSession(sessionId: string): Promise<AgentSession & { messages: AgentMessage[] }>;
  sendAgentMessage(sessionId: string, input: SendMessageInput): Promise<SendMessageResult>;
  getQuota(): Promise<QuotaStatus>;
  // Documents RAG
  listDocuments(patientId?: string): Promise<RagDocument[]>;
  deleteDocument(id: string): Promise<{ deleted: boolean }>;
  reindexDocument(id: string): Promise<{ status: string }>;
}

// ─── Client implementation ────────────────────────────────────────────────────

async function request<T>(
  opts: SmartboardClientOptions,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = await opts.getToken();
  const res = await fetch(`${opts.baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) throw new SmartboardApiError(res.status);
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function createSmartboardClient(opts: SmartboardClientOptions): SmartboardClient {
  const r = <T>(path: string, init?: RequestInit) => request<T>(opts, path, init);
  const json = (body: unknown) => ({ body: JSON.stringify(body) });

  return {
    getManifest: () => r<Manifest>("/v1/me/manifest"),

    updateBranding: (input) => r<void>("/v1/admin/branding", { method: "PATCH", ...json(input) }),

    listUsers: () => r<AdminUser[]>("/v1/admin/users"),
    listRoles: () => r<AdminRole[]>("/v1/admin/roles"),
    assignRole: (userId, roleKey) => r<void>(`/v1/admin/users/${userId}/roles`, { method: "POST", ...json({ roleKey }) }),
    removeRole: (userId, roleKey) => r<void>(`/v1/admin/users/${userId}/roles/${roleKey}`, { method: "DELETE" }),

    listPatients: (search) => {
      const url = search ? `/v1/patients?search=${encodeURIComponent(search)}` : "/v1/patients";
      return r<Patient[]>(url);
    },
    createPatient: (input) => r<Patient>("/v1/patients", { method: "POST", ...json(input) }),
    updatePatient: (id, input) => r<Patient>(`/v1/patients/${id}`, { method: "PATCH", ...json(input) }),
    getPatient: (id) => r<PatientDetail>(`/v1/patients/${id}`),

    getAnamnesis: (patientId) => r<Anamnesis | null>(`/v1/patients/${patientId}/anamnesis`),
    upsertAnamnesis: (patientId, input) =>
      r<Anamnesis>(`/v1/patients/${patientId}/anamnesis`, { method: "PUT", ...json(input) }),

    listAllAppointments: (from, to) => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const qs = params.toString();
      return r<CalendarAppointment[]>(`/v1/patients/appointments${qs ? `?${qs}` : ""}`);
    },
    listAppointments: (patientId) => r<Appointment[]>(`/v1/patients/${patientId}/appointments`),
    cancelAppointment: (patientId, appointmentId) =>
      r<Appointment>(`/v1/patients/${patientId}/appointments/${appointmentId}/cancel`, { method: "PATCH" }),
    createAppointment: (patientId, input) =>
      r<Appointment>(`/v1/patients/${patientId}/appointments`, { method: "POST", ...json(input) }),
    upsertSessionNote: (patientId, appointmentId, input) =>
      r<SessionNote>(`/v1/patients/${patientId}/appointments/${appointmentId}/note`, { method: "PUT", ...json(input) }),

    listTreatments: (patientId) => r<Treatment[]>(`/v1/patients/${patientId}/treatments`),
    createTreatment: (patientId, input) =>
      r<Treatment>(`/v1/patients/${patientId}/treatments`, { method: "POST", ...json(input) }),
    toggleTreatment: (patientId, treatmentId) =>
      r<Treatment>(`/v1/patients/${patientId}/treatments/${treatmentId}/toggle`, { method: "PATCH" }),

    listHomework: (patientId) => r<Homework[]>(`/v1/patients/${patientId}/homework`),
    createHomework: (patientId, input) =>
      r<Homework>(`/v1/patients/${patientId}/homework`, { method: "POST", ...json(input) }),
    updateHomeworkStatus: (patientId, homeworkId, status) =>
      r<Homework>(`/v1/patients/${patientId}/homework/${homeworkId}/status`, { method: "PATCH", ...json({ status }) }),

    listEvolution: (patientId) => r<Evolution[]>(`/v1/patients/${patientId}/evolution`),
    createEvolution: (patientId, input) =>
      r<Evolution>(`/v1/patients/${patientId}/evolution`, { method: "POST", ...json(input) }),

    generateTelegramToken: (patientId) =>
      r<TelegramLinkToken>(`/v1/telegram/patients/${patientId}/token`, { method: "POST" }),
    getTelegramStatus: (patientId) =>
      r<TelegramStatus>(`/v1/telegram/patients/${patientId}/status`),

    createAgentSession: (title?) =>
      r<AgentSession>("/v1/agent/sessions", { method: "POST", ...json({ title }) }),
    listAgentSessions: (limit = 5) =>
      r<AgentSession[]>(`/v1/agent/sessions?limit=${limit}`),
    getAgentSession: (sessionId) =>
      r<AgentSession & { messages: AgentMessage[] }>(`/v1/agent/sessions/${sessionId}`),
    sendAgentMessage: (sessionId, input) =>
      r<SendMessageResult>(`/v1/agent/sessions/${sessionId}/messages`, { method: "POST", ...json(input) }),
    getQuota: () => r<QuotaStatus>("/v1/quota/me"),
    listDocuments: (patientId?) => {
      const qs = patientId ? `?patientId=${encodeURIComponent(patientId)}` : "";
      return r<RagDocument[]>(`/v1/documents${qs}`);
    },
    deleteDocument: (id) => r<{ deleted: boolean }>(`/v1/documents/${id}`, { method: "DELETE" }),
    reindexDocument: (id) => r<{ status: string }>(`/v1/documents/${id}/reindex`, { method: "POST" }),
  };
}
