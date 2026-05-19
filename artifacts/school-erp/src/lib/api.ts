/* API helper — calls the api-server artifact at /api */

const API_BASE = "/api";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error((err as { message?: string }).message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  studentLogin: (studentId: string, password: string) =>
    apiFetch<StudentProfile>("/auth/student", {
      method: "POST",
      body: JSON.stringify({ studentId, password }),
    }),

  attendanceSummary: (studentId: string) =>
    apiFetch<AttendanceSummary>(`/attendance/student/${studentId}/summary`),

  homework: (className: string) =>
    apiFetch<HomeworkItem[]>(`/homework/class/${className}`),

  results: (className: string, rollNo?: string) =>
    apiFetch<ResultItem[]>(
      `/results/class/${className}${rollNo ? `?rollNo=${encodeURIComponent(rollNo)}` : ""}`
    ),

  notices: (className: string) =>
    apiFetch<NoticeItem[]>(`/notices?className=${encodeURIComponent(className)}`),

  messages: (className: string, studentId: string) =>
    apiFetch<MessageItem[]>(
      `/messages?className=${encodeURIComponent(className)}&studentId=${encodeURIComponent(studentId)}`
    ),

  materials: (className: string) =>
    apiFetch<MaterialItem[]>(`/materials?className=${encodeURIComponent(className)}`),

  timetable: (className: string) =>
    apiFetch<TimetableRow[]>(`/timetable?className=${encodeURIComponent(className)}`),

  events: (className: string) =>
    apiFetch<EventItem[]>(`/events?className=${encodeURIComponent(className)}`),
};

/* ── Types ────────────────────────────────────────────────── */
export interface StudentProfile {
  studentId: string;
  fullName: string;
  className: string;
  section: string;
  rollNo: string;
  photo?: string;
  parents?: Array<{ relation: string; name: string; phone: string }>;
  fees?: {
    currentTermStatus: string;
    currentTermNote: string;
    nextDueAmount: string;
    nextDueLabel: string;
    history: Array<{ period: string; amount: string; status: string }>;
  };
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  total: number;
  pct: number;
  history: Array<{ date: string; status: string; remark: string }>;
}

export interface HomeworkItem {
  id: string;
  className: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  fileName?: string;
  teacherName: string;
  createdAt: string;
}

export interface ResultItem {
  id: string;
  className: string;
  subject: string;
  examType: string;
  unitTestNumber?: number;
  title: string;
  fileName?: string;
  targetRollNo?: string;
  teacherName: string;
  createdAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  audience: string;
  className?: string;
  teacherName?: string;
  createdAt: string;
}

export interface MessageItem {
  id: string;
  subject: string;
  body: string;
  audience: string;
  className?: string;
  studentId?: string;
  studentName?: string;
  teacherName?: string;
  sentAt: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  className: string;
  fileName?: string;
  videoUrl?: string;
  resourceType: string;
  updatedAt: string;
}

export interface TimetableRow {
  id: string;
  className: string;
  period: string;
  subject: string;
  time: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  className: string;
  title: string;
  description?: string;
  eventDate: string;
  teacherName?: string;
  createdAt: string;
}
