import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  api,
  type StudentProfile,
  type AttendanceSummary,
  type HomeworkItem,
  type ResultItem,
  type NoticeItem,
  type MessageItem,
  type MaterialItem,
  type TimetableRow,
  type EventItem,
} from "@/lib/api";
import "./StudentPortal.css";

/* ============================================================
   NAV ITEMS
============================================================ */
const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "profile", icon: "👤", label: "My Profile" },
  { id: "attendance", icon: "📅", label: "Attendance" },
  { id: "homework", icon: "📝", label: "Homework" },
  { id: "results", icon: "📊", label: "My Results" },
  { id: "fees", icon: "💰", label: "Fees & Payments" },
  { id: "notices", icon: "📢", label: "Notices" },
  { id: "material", icon: "📚", label: "Study Material" },
  { id: "timetable", icon: "🗓️", label: "Time Table" },
  { id: "events", icon: "🎉", label: "Events" },
  { id: "messages", icon: "✉️", label: "Messages" },
];

/* ============================================================
   HELPERS
============================================================ */
function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--slate)" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{icon}</div>
      <div style={{ fontSize: "0.95rem" }}>{message}</div>
    </div>
  );
}

function DbBanner() {
  return (
    <div style={{ background: "#fef3cd", border: "1px solid #fcd34d", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.25rem", fontSize: "0.88rem", color: "#92600a" }}>
      ⚠️ <strong>Database not connected.</strong> Please set your <code>MONGODB_URI</code> secret in the Replit environment, then restart the server. Data shown here is unavailable until the database is connected.
    </div>
  );
}

function LoadingCard() {
  return (
    <div style={{ textAlign: "center", padding: "3rem", color: "var(--slate-light)" }}>
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
      <div style={{ fontSize: "0.9rem" }}>Loading…</div>
    </div>
  );
}

function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}

function isDbError(e: unknown) {
  return e instanceof Error && (e.message.includes("503") || e.message.toLowerCase().includes("unavailable") || e.message.toLowerCase().includes("database"));
}

/* ============================================================
   LOGIN PAGE
============================================================ */
function LoginPage({ onLogin }: { onLogin: (s: StudentProfile) => void }) {
  const [, navigate] = useLocation();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await api.studentLogin(studentId.trim(), password);
      onLogin(profile);
    } catch (err) {
      if (err instanceof Error) {
        if (isDbError(err)) {
          setError("Database not connected. Please ask your administrator to set up MONGODB_URI.");
        } else {
          setError(err.message || "Invalid credentials. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-portal">
      <div className="sp-login-page">
        {/* Left panel */}
        <div className="sp-login-left">
          <div className="sp-login-brand">
            <div className="sp-login-logo-box">
              <div className="sp-login-logo-icon">AN</div>
              <div>
                <div className="sp-login-logo-name">Abhay Nobles</div>
                <div className="sp-login-logo-tag">Senior Secondary School</div>
              </div>
            </div>
            <h2 className="sp-login-headline">
              Your Gateway to<br /><em>Academic Success</em>
            </h2>
            <p className="sp-login-sub">
              Access your attendance, results, homework, fees and more — all in one place, updated in real-time by your teachers and school administration.
            </p>
          </div>
          <div className="sp-login-features">
            {[
              ["📊", "Live Results & Progress", "Track your marks, grades and academic growth updated by teachers."],
              ["📅", "Attendance Tracker", "View your daily attendance marked by your class teacher."],
              ["📝", "Homework Manager", "All assignments uploaded by teachers appear here instantly."],
              ["💰", "Fee Management", "Check dues, payment history, and status updated by admin."],
            ].map(([icon, title, desc]) => (
              <div key={String(title)} className="sp-login-feature">
                <div className="sp-login-feature-icon">{icon}</div>
                <div>
                  <div className="sp-login-feature-title">{String(title)}</div>
                  <div className="sp-login-feature-desc">{String(desc)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="sp-login-footer-note">
            © 2025 Abhay Nobles School · Secure Student Portal
          </div>
        </div>

        {/* Right panel */}
        <div className="sp-login-right">
          <div className="sp-login-card">
            <div className="sp-login-card-title">Student Login</div>
            <div className="sp-login-card-sub">Sign in with your Student ID and password set by the school</div>

            {error && <div className="sp-login-error">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="sp-form-group">
                <label>Student ID / Admission Number</label>
                <div className="sp-input-wrap">
                  <span className="sp-input-icon">🎓</span>
                  <input
                    type="text"
                    placeholder="e.g. AN2024-0001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              <div className="sp-form-group">
                <label>Password</label>
                <div className="sp-input-wrap">
                  <span className="sp-input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="sp-login-btn" disabled={loading}>
                {loading ? "Signing in…" : "Sign In to Portal →"}
              </button>
            </form>

            <div style={{ marginTop: "1.25rem", background: "#f8fafc", borderRadius: 10, padding: "0.85rem 1rem", fontSize: "0.82rem", color: "var(--slate)" }}>
              <strong>Note:</strong> Your Student ID and password are set by the school admin. Contact your school office if you haven't received your login credentials.
            </div>

            <div className="sp-login-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>← Back to School Website</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PANEL
============================================================ */
function DashboardPanel({ student }: { student: StudentProfile }) {
  const attQ = useQuery({ queryKey: ["attendance", student.studentId], queryFn: () => api.attendanceSummary(student.studentId), retry: false });
  const hwQ = useQuery({ queryKey: ["homework", student.className], queryFn: () => api.homework(student.className), retry: false });
  const noticeQ = useQuery({ queryKey: ["notices", student.className], queryFn: () => api.notices(student.className), retry: false });

  const att = attQ.data;
  const pending = (hwQ.data ?? []).length;
  const feeStatus = student.fees?.currentTermStatus ?? "—";
  const feeDue = student.fees?.nextDueAmount ?? "0";
  const feeLabel = student.fees?.nextDueLabel ?? "";
  const dbErr = isDbError(attQ.error) || isDbError(hwQ.error);

  return (
    <div>
      {dbErr && <DbBanner />}
      <div className="sp-stats-row">
        <div className="sp-stat-card gold">
          <div className="sp-stat-label">Attendance</div>
          <div className="sp-stat-value">{att ? `${att.pct}%` : attQ.isLoading ? "…" : "—"}</div>
          <div className="sp-stat-sub">{att ? `${att.present}/${att.total} classes` : "No data yet"}</div>
        </div>
        <div className="sp-stat-card blue">
          <div className="sp-stat-label">Homework Assigned</div>
          <div className="sp-stat-value">{hwQ.isLoading ? "…" : pending}</div>
          <div className="sp-stat-sub">{hwQ.data ? "Recent assignments" : "No data yet"}</div>
        </div>
        <div className={`sp-stat-card ${feeStatus === "Paid" ? "green" : "red"}`}>
          <div className="sp-stat-label">Fee Status</div>
          <div className="sp-stat-value">₹{feeDue}</div>
          <div className="sp-stat-sub">{feeStatus} · {feeLabel || "No pending fee"}</div>
        </div>
        <div className="sp-stat-card gold">
          <div className="sp-stat-label">Class</div>
          <div className="sp-stat-value" style={{ fontSize: "1.5rem" }}>{student.className}</div>
          <div className="sp-stat-sub">Roll No. {student.rollNo} · {student.section}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        {/* Recent Notices */}
        <div className="sp-card">
          <div className="sp-card-title">📢 Recent Notices</div>
          {noticeQ.isLoading ? <LoadingCard /> :
            (noticeQ.data ?? []).length === 0 ? <EmptyState icon="📢" message="No notices published yet." /> :
              (noticeQ.data ?? []).slice(0, 5).map((n) => (
                <div key={n.id} className="sp-notice-item">
                  <div className={`sp-notice-dot ${n.audience === "All Classes" || !n.className ? "norm" : "imp"}`} />
                  <div>
                    <div className="sp-notice-title">{n.title}</div>
                    <div className="sp-notice-date">{fmtDate(n.createdAt)} {n.teacherName ? `· ${n.teacherName}` : ""}</div>
                  </div>
                </div>
              ))}
        </div>

        {/* Recent Homework */}
        <div className="sp-card">
          <div className="sp-card-title">📝 Recent Homework</div>
          {hwQ.isLoading ? <LoadingCard /> :
            (hwQ.data ?? []).length === 0 ? <EmptyState icon="📝" message="No homework assigned yet." /> :
              (hwQ.data ?? []).slice(0, 4).map((hw) => (
                <div key={hw.id} className="sp-hw-item">
                  <div>
                    <div className="sp-hw-subject">{hw.subject}</div>
                    <div className="sp-hw-title">{hw.title}</div>
                    <div className="sp-hw-desc" style={{ fontSize: "0.78rem", color: "#94a3b8" }}>By {hw.teacherName}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="sp-hw-due" style={{ color: "#f59e0b", fontSize: "0.8rem" }}>Due: {fmtDate(hw.dueDate)}</div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE PANEL
============================================================ */
function ProfilePanel({ student }: { student: StudentProfile }) {
  return (
    <div>
      <div className="sp-profile-hero">
        <div className="sp-profile-avatar">{student.fullName.charAt(0).toUpperCase()}</div>
        <div>
          <div className="sp-profile-name">{student.fullName}</div>
          <div className="sp-profile-meta">Class {student.className} · Section {student.section} · Roll No. {student.rollNo} · {student.studentId}</div>
          <div className="sp-profile-badges">
            <span className="sp-badge sp-badge-green">✅ Active Student</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="sp-card">
          <div className="sp-card-title">👤 Academic Details</div>
          <div className="sp-profile-info-grid">
            {[
              ["Student ID", student.studentId],
              ["Full Name", student.fullName],
              ["Class", student.className],
              ["Section", student.section],
              ["Roll Number", student.rollNo],
            ].map(([label, val]) => (
              <div key={label} className="sp-info-item"><label>{label}</label><span>{val}</span></div>
            ))}
          </div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">👨‍👩‍👦 Parent / Guardian Details</div>
          {(student.parents ?? []).length === 0 ? (
            <EmptyState icon="👨‍👩‍👦" message="No parent details on record yet." />
          ) : (
            <div className="sp-profile-info-grid">
              {(student.parents ?? []).flatMap((p) => [
                [`${p.relation} Name`, p.name],
                [`${p.relation} Phone`, p.phone],
              ]).map(([label, val]) => (
                <div key={label} className="sp-info-item"><label>{label}</label><span>{val}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ATTENDANCE PANEL
============================================================ */
function AttendancePanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<AttendanceSummary>({
    queryKey: ["attendance", student.studentId],
    queryFn: () => api.attendanceSummary(student.studentId),
    retry: false,
  });

  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /><EmptyState icon="📅" message="Connect the database to see attendance." /></div>;

  const att = data ?? { present: 0, absent: 0, total: 0, pct: 0, history: [] };
  const minReq = 75;
  const isOk = att.pct >= minReq || att.total === 0;

  return (
    <div>
      <div className="sp-stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="sp-stat-card green"><div className="sp-stat-label">Overall Attendance</div><div className="sp-stat-value">{att.pct}%</div><div className="sp-stat-sub">{att.present}/{att.total} classes</div></div>
        <div className="sp-stat-card gold"><div className="sp-stat-label">Days Present</div><div className="sp-stat-value">{att.present}</div><div className="sp-stat-sub">Out of {att.total} recorded days</div></div>
        <div className="sp-stat-card red"><div className="sp-stat-label">Days Absent</div><div className="sp-stat-value">{att.absent}</div><div className="sp-stat-sub">Out of {att.total} recorded days</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.25rem" }}>
        <div className="sp-card" style={{ textAlign: "center" }}>
          <div className="sp-card-title" style={{ justifyContent: "center" }}>📊 Overall</div>
          <div className="sp-attendance-circle">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle cx="70" cy="70" r="58" fill="none"
                stroke={att.pct >= 75 ? "#C9A84C" : "#ef4444"} strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 58 * (att.pct / 100)} ${2 * Math.PI * 58}`}
                strokeLinecap="round" />
            </svg>
            <div className="sp-attendance-pct">
              <div className="sp-attendance-pct-num">{att.pct}%</div>
              <div className="sp-attendance-pct-label">Present</div>
            </div>
          </div>
          <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.75rem", lineHeight: 1.6 }}>
            Required minimum: <strong>{minReq}%</strong><br />
            {att.total === 0 ? "No attendance recorded yet." : isOk
              ? <span style={{ color: "#22c55e" }}>✅ You are within limit.</span>
              : <span style={{ color: "#ef4444" }}>⚠️ Below minimum — please improve.</span>}
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-title">📋 Recent Attendance History</div>
          {att.history.length === 0 ? (
            <EmptyState icon="📅" message="No attendance records found. Attendance will appear here once your teacher marks it." />
          ) : (
            <table className="sp-table">
              <thead><tr><th>Date</th><th>Status</th><th>Remark</th></tr></thead>
              <tbody>
                {att.history.map((h) => (
                  <tr key={h.date}>
                    <td style={{ whiteSpace: "nowrap" }}>{fmtDate(h.date)}</td>
                    <td>
                      <span className={`sp-badge ${h.status === "present" ? "sp-badge-green" : "sp-badge-red"}`}>
                        {h.status === "present" ? "✅ Present" : "❌ Absent"}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.85rem" }}>{h.remark || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HOMEWORK PANEL
============================================================ */
function HomeworkPanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<HomeworkItem[]>({
    queryKey: ["homework", student.className],
    queryFn: () => api.homework(student.className),
    retry: false,
  });

  const hwList = data ?? [];
  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /></div>;

  return (
    <div>
      <div className="sp-stats-row" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="sp-stat-card blue"><div className="sp-stat-label">Total Assignments</div><div className="sp-stat-value">{hwList.length}</div><div className="sp-stat-sub">Assigned to your class</div></div>
        <div className="sp-stat-card gold"><div className="sp-stat-label">Subjects</div><div className="sp-stat-value">{new Set(hwList.map(h => h.subject)).size}</div><div className="sp-stat-sub">Unique subjects with HW</div></div>
      </div>
      <div className="sp-card">
        <div className="sp-card-title">📝 Homework Assignments</div>
        {hwList.length === 0 ? (
          <EmptyState icon="📝" message="No homework assigned yet. Check back after your teachers upload assignments." />
        ) : (
          hwList.map((hw) => (
            <div key={hw.id} className="sp-hw-item">
              <div style={{ flex: 1 }}>
                <div className="sp-hw-subject">{hw.subject}</div>
                <div className="sp-hw-title">{hw.title}</div>
                {hw.description && <div className="sp-hw-desc">{hw.description}</div>}
                {hw.fileName && (
                  <div style={{ marginTop: "0.35rem", fontSize: "0.78rem", color: "#3b82f6" }}>📎 {hw.fileName}</div>
                )}
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.4rem" }}>Assigned by {hw.teacherName} · {fmtDate(hw.createdAt)}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="sp-hw-due" style={{ color: "#f59e0b", fontSize: "0.82rem" }}>Due: {fmtDate(hw.dueDate)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ============================================================
   RESULTS PANEL
============================================================ */
function ResultsPanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<ResultItem[]>({
    queryKey: ["results", student.className, student.rollNo],
    queryFn: () => api.results(student.className, student.rollNo),
    retry: false,
  });

  const list = data ?? [];
  const examTypes = { "yearly": "Annual Exam", "half-yearly": "Half Yearly", "unit-test": "Unit Test" };

  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /></div>;

  return (
    <div>
      <div className="sp-card">
        <div className="sp-card-title">📊 Result Publications</div>
        {list.length === 0 ? (
          <EmptyState icon="📊" message="No results published yet. Results will appear here after your teacher uploads them." />
        ) : (
          list.map((r) => (
            <div key={r.id} style={{ padding: "1.25rem", borderRadius: 12, background: "#f8fafc", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0B1628", marginBottom: "0.3rem" }}>{r.title}</div>
                  <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.5rem" }}>
                    <span className="sp-badge sp-badge-blue" style={{ marginRight: "0.5rem" }}>
                      {examTypes[r.examType as keyof typeof examTypes] || r.examType}
                      {r.unitTestNumber ? ` ${r.unitTestNumber}` : ""}
                    </span>
                    {r.subject} · By {r.teacherName}
                  </div>
                  {r.fileName && <div style={{ fontSize: "0.78rem", color: "#3b82f6" }}>📎 {r.fileName}</div>}
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{fmtDate(r.createdAt)}</div>
                  {r.targetRollNo && <div style={{ marginTop: "0.35rem" }}><span className="sp-badge sp-badge-gold">Roll {r.targetRollNo}</span></div>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ============================================================
   FEES PANEL
============================================================ */
function FeesPanel({ student }: { student: StudentProfile }) {
  const fees = student.fees;

  return (
    <div>
      <div className="sp-fee-summary">
        <div className="sp-fee-card">
          <div className="sp-fee-card-label">Term Status</div>
          <div className="sp-fee-card-amount" style={{ fontSize: "1.5rem", color: fees?.currentTermStatus === "Paid" ? "#15803d" : "#dc2626" }}>
            {fees?.currentTermStatus ?? "—"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem" }}>{fees?.currentTermNote ?? "No note"}</div>
        </div>
        <div className="sp-fee-card">
          <div className="sp-fee-card-label">Amount Due</div>
          <div className="sp-fee-card-amount" style={{ color: "#dc2626" }}>₹{fees?.nextDueAmount ?? "0"}</div>
          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem" }}>{fees?.nextDueLabel ?? "No pending fee"}</div>
        </div>
        <div className="sp-fee-card">
          <div className="sp-fee-card-label">Transactions</div>
          <div className="sp-fee-card-amount">{fees?.history?.length ?? 0}</div>
          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem" }}>Recorded payments</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {fees?.nextDueAmount && fees.nextDueAmount !== "0" && (
          <div className="sp-card">
            <div className="sp-card-title">💳 Pay Fee Online</div>
            <div style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "1.25rem" }}>Pay your pending fee securely via UPI, Net Banking, or Card.</div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", marginBottom: "0.35rem" }}>AMOUNT DUE</div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#dc2626", fontFamily: "var(--font-display)" }}>₹{fees.nextDueAmount}</div>
              {fees.nextDueLabel && <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.25rem" }}>{fees.nextDueLabel}</div>}
            </div>
            <button className="sp-login-btn" style={{ padding: "0.9rem", fontSize: "0.95rem" }}>
              💳 Pay Now — ₹{fees.nextDueAmount}
            </button>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.75rem", textAlign: "center" }}>
              Secured · Accepted: UPI · Net Banking · Card
            </div>
          </div>
        )}

        <div className="sp-card">
          <div className="sp-card-title">📋 Payment History</div>
          {(fees?.history ?? []).length === 0 ? (
            <EmptyState icon="💰" message="No payment history recorded yet." />
          ) : (
            <table className="sp-table">
              <thead><tr><th>Period</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {(fees?.history ?? []).map((h, i) => (
                  <tr key={i}>
                    <td>{h.period}</td>
                    <td style={{ fontWeight: 700 }}>₹{h.amount}</td>
                    <td><span className={`sp-badge ${h.status === "Paid" ? "sp-badge-green" : "sp-badge-red"}`}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NOTICES PANEL
============================================================ */
function NoticesPanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<NoticeItem[]>({
    queryKey: ["notices", student.className],
    queryFn: () => api.notices(student.className),
    retry: false,
  });

  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /></div>;

  const list = data ?? [];

  return (
    <div className="sp-card">
      <div className="sp-card-title">📢 All Notices & Circulars</div>
      {list.length === 0 ? (
        <EmptyState icon="📢" message="No notices published yet. Notices from your teachers and school office will appear here." />
      ) : (
        list.map((n) => (
          <div key={n.id} style={{ padding: "1.25rem", borderRadius: 12, background: "#f8fafc", marginBottom: "0.75rem", borderLeft: `4px solid ${n.audience === "All Classes" ? "#C9A84C" : "#3b82f6"}` }}>
            <div style={{ fontWeight: 700, color: "#0B1628", marginBottom: "0.3rem" }}>{n.title}</div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "0.75rem" }}>
              📅 {fmtDate(n.createdAt)}
              {n.teacherName ? ` · ${n.teacherName}` : ""}
              <span className="sp-badge sp-badge-gold" style={{ marginLeft: "0.5rem" }}>{n.audience}</span>
            </div>
            <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.65 }}>{n.description}</div>
          </div>
        ))
      )}
    </div>
  );
}

/* ============================================================
   STUDY MATERIAL PANEL
============================================================ */
function MaterialPanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<MaterialItem[]>({
    queryKey: ["materials", student.className],
    queryFn: () => api.materials(student.className),
    retry: false,
  });

  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /></div>;

  const list = data ?? [];
  const iconFor = (type: string) => type === "Video" ? "🎬" : "📄";
  const bgFor = (type: string) => type === "Video" ? "#dcfce7" : "#dbeafe";

  return (
    <div className="sp-card">
      <div className="sp-card-title">📚 Study Materials</div>
      {list.length === 0 ? (
        <EmptyState icon="📚" message="No study materials uploaded yet. Materials shared by your teachers will appear here." />
      ) : (
        list.map((m) => (
          <div key={m.id} className="sp-material-item">
            <div className="sp-material-icon" style={{ background: bgFor(m.resourceType) }}>{iconFor(m.resourceType)}</div>
            <div style={{ flex: 1 }}>
              <div className="sp-material-title">{m.title}</div>
              <div className="sp-material-meta">
                {m.resourceType} · {m.fileName || m.videoUrl || "—"} · Updated {fmtDate(m.updatedAt)}
              </div>
            </div>
            {(m.fileName || m.videoUrl) && (
              <button className="sp-material-dl"
                onClick={() => {
                  const url = m.videoUrl || m.fileName;
                  if (url) window.open(url, "_blank");
                }}>
                {m.resourceType === "Video" ? "Watch" : "Download"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ============================================================
   TIMETABLE PANEL
============================================================ */
function TimetablePanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<TimetableRow[]>({
    queryKey: ["timetable", student.className],
    queryFn: () => api.timetable(student.className),
    retry: false,
  });

  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /></div>;

  const list = data ?? [];

  return (
    <div className="sp-card">
      <div className="sp-card-title">🗓️ Class Time Table — {student.className}</div>
      {list.length === 0 ? (
        <EmptyState icon="🗓️" message="Timetable not uploaded yet. Your class schedule will appear here once set up by the admin." />
      ) : (
        <table className="sp-table">
          <thead>
            <tr><th>Period</th><th>Time</th><th>Subject</th></tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600 }}>{row.period}</td>
                <td style={{ color: "#64748b" }}>{row.time}</td>
                <td><span className="sp-badge sp-badge-blue">{row.subject}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ============================================================
   EVENTS PANEL
============================================================ */
function EventsPanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<EventItem[]>({
    queryKey: ["events", student.className],
    queryFn: () => api.events(student.className),
    retry: false,
  });

  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /></div>;

  const list = data ?? [];

  return (
    <div className="sp-card">
      <div className="sp-card-title">🎉 Upcoming Events</div>
      {list.length === 0 ? (
        <EmptyState icon="🎉" message="No events scheduled yet. Events added by your school will appear here." />
      ) : (
        list.map((ev) => {
          const d = new Date(ev.eventDate);
          const day = isNaN(d.getTime()) ? ev.eventDate : d.getDate().toString().padStart(2, "0");
          const mon = isNaN(d.getTime()) ? "" : d.toLocaleString("en-IN", { month: "short" });
          return (
            <div key={ev.id} className="sp-event-item">
              <div className="sp-event-date-box">
                <div className="sp-event-date-day">{day}</div>
                <div className="sp-event-date-mon">{mon}</div>
              </div>
              <div>
                <div className="sp-event-title">{ev.title}</div>
                <div className="sp-event-sub">
                  {ev.description ? ev.description : ""}
                  {ev.className && ev.className !== "All Classes" ? ` · Class ${ev.className}` : " · All Classes"}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* ============================================================
   MESSAGES PANEL
============================================================ */
function MessagesPanel({ student }: { student: StudentProfile }) {
  const { data, isLoading, error } = useQuery<MessageItem[]>({
    queryKey: ["messages", student.className, student.studentId],
    queryFn: () => api.messages(student.className, student.studentId),
    retry: false,
  });

  if (isLoading) return <div className="sp-card"><LoadingCard /></div>;
  if (isDbError(error)) return <div className="sp-card"><DbBanner /></div>;

  const list = data ?? [];

  return (
    <div className="sp-card">
      <div className="sp-card-title">✉️ Messages from School</div>
      {list.length === 0 ? (
        <EmptyState icon="✉️" message="No messages yet. Messages sent by your teachers or school office will appear here." />
      ) : (
        <div className="sp-msg-list">
          {list.map((m) => {
            const initials = (m.teacherName ?? "S").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "S";
            return (
              <div key={m.id} className="sp-msg-item">
                <div className="sp-msg-avatar">{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sp-msg-sender">{m.teacherName || "School Office"}</div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0B1628", margin: "0.15rem 0" }}>{m.subject}</div>
                  <div className="sp-msg-preview">{m.body}</div>
                </div>
                <div className="sp-msg-time">{fmtDate(m.sentAt)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DASHBOARD WRAPPER
============================================================ */
function Dashboard({ student, onLogout }: { student: StudentProfile; onLogout: () => void }) {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const panelTitles: Record<string, string> = {
    dashboard: "Dashboard", profile: "My Profile", attendance: "Attendance",
    homework: "Homework", results: "My Results", fees: "Fees & Payments",
    notices: "Notices", material: "Study Material", timetable: "Time Table",
    events: "Events", messages: "Messages",
  };

  const panels: Record<string, ReactNode> = {
    dashboard: <DashboardPanel student={student} />,
    profile: <ProfilePanel student={student} />,
    attendance: <AttendancePanel student={student} />,
    homework: <HomeworkPanel student={student} />,
    results: <ResultsPanel student={student} />,
    fees: <FeesPanel student={student} />,
    notices: <NoticesPanel student={student} />,
    material: <MaterialPanel student={student} />,
    timetable: <TimetablePanel student={student} />,
    events: <EventsPanel student={student} />,
    messages: <MessagesPanel student={student} />,
  };

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="student-portal">
      <div className="sp-dashboard">
        <div className={`sp-sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

        <aside className={`sp-sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sp-sidebar-top">
            <div className="sp-sidebar-logo">
              <div className="sp-sidebar-logo-icon">AN</div>
              <div>
                <div className="sp-sidebar-logo-name">Abhay Nobles</div>
                <div className="sp-sidebar-logo-tag">Student Portal</div>
              </div>
            </div>
          </div>

          <nav className="sp-sidebar-nav">
            <div className="sp-nav-label">Main</div>
            {NAV.slice(0, 2).map((item) => (
              <button key={item.id} className={`sp-nav-item${activePanel === item.id ? " active" : ""}`}
                onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}>
                <span className="sp-nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
            <div className="sp-nav-label">Academics</div>
            {NAV.slice(2, 7).map((item) => (
              <button key={item.id} className={`sp-nav-item${activePanel === item.id ? " active" : ""}`}
                onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}>
                <span className="sp-nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
            <div className="sp-nav-label">Activities</div>
            {NAV.slice(7).map((item) => (
              <button key={item.id} className={`sp-nav-item${activePanel === item.id ? " active" : ""}`}
                onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}>
                <span className="sp-nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
            <div className="sp-nav-label">System</div>
            <button className="sp-nav-item" onClick={() => navigate("/")}>
              <span className="sp-nav-icon">🏠</span>School Website
            </button>
            <button className="sp-nav-item" onClick={onLogout}>
              <span className="sp-nav-icon">🚪</span>Logout
            </button>
          </nav>

          <div className="sp-sidebar-footer">
            <div className="sp-sidebar-user">
              <div className="sp-user-avatar">{student.fullName.charAt(0).toUpperCase()}</div>
              <div>
                <div className="sp-user-name">{student.fullName}</div>
                <div className="sp-user-id">Class {student.className} · {student.studentId}</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="sp-main">
          <header className="sp-topbar">
            <div className="sp-topbar-left">
              <button className="sp-burger" onClick={() => setSidebarOpen((v) => !v)}>☰</button>
              <div className="sp-topbar-title">{panelTitles[activePanel] || "Dashboard"}</div>
            </div>
            <div className="sp-topbar-right">
              <div className="sp-topbar-date">{today}</div>
            </div>
          </header>
          <main className="sp-panel">
            {panels[activePanel] || <DashboardPanel student={student} />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN EXPORT
============================================================ */
export default function StudentPortal() {
  const [student, setStudent] = useState<StudentProfile | null>(null);

  if (!student) {
    return <LoginPage onLogin={(s) => setStudent(s)} />;
  }

  return <Dashboard student={student} onLogout={() => setStudent(null)} />;
}
