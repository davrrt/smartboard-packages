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

export interface Homework {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: HomeworkStatus;
  createdAt: string;
}

export interface CreateHomeworkInput {
  title: string;
  description?: string;
  dueDate?: string;
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
  };
}
