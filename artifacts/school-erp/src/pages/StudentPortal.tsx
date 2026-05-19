import { useState } from "react";
import { useLocation } from "wouter";
import "./StudentPortal.css";

/* ============================================================
   DEMO CREDENTIALS
============================================================ */
const DEMO_USER = { id: "AN2024-0842", pin: "1234" };
const STUDENT = {
  name: "Arjun Sharma",
  class: "10-A",
  roll: "23",
  admNo: "AN2024-0842",
  dob: "12 March 2010",
  father: "Mr. Rajesh Sharma",
  mother: "Mrs. Sunita Sharma",
  phone: "+91 9928613702",
  email: "arjun.sharma@student.abhaynobles.in",
  address: "Near Ganpat Colony, Takhatgarh, Pali, Rajasthan 306901",
  house: "Vivekananda House",
  transport: "Bus Route 4 · Seat 12",
};

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
  { id: "notices", icon: "📢", label: "Notices", badge: 3 },
  { id: "material", icon: "📚", label: "Study Material" },
  { id: "timetable", icon: "🗓️", label: "Time Table" },
  { id: "events", icon: "🎉", label: "Events" },
  { id: "messages", icon: "✉️", label: "Messages", badge: 2 },
];

/* ============================================================
   LOGIN
============================================================ */
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [, navigate] = useLocation();
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId === DEMO_USER.id && pin === DEMO_USER.pin) {
      onLogin();
    } else {
      setError("Invalid Student ID or PIN. Use demo credentials shown above.");
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
              Access your attendance, results, homework, fees and more — all in one place, anytime, anywhere.
            </p>
          </div>
          <div className="sp-login-features">
            {[
              ["📊","Live Results & Progress","Track your marks, grades and academic growth in real-time."],
              ["📅","Attendance Tracker","View your daily attendance and get alerts for low attendance."],
              ["📝","Homework Manager","Never miss an assignment — all homework in one place."],
              ["💰","Fee Management","Check dues, payment history, and download receipts easily."],
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
            <div className="sp-login-card-sub">Sign in to your student dashboard</div>
            <div className="sp-demo-box">
              <p>
                <strong>Demo Credentials:</strong><br />
                Student ID: <strong>AN2024-0842</strong><br />
                PIN: <strong>1234</strong>
              </p>
            </div>
            {error && <div className="sp-login-error">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="sp-form-group">
                <label>Student ID / Admission Number</label>
                <div className="sp-input-wrap">
                  <span className="sp-input-icon">🎓</span>
                  <input
                    type="text"
                    placeholder="e.g. AN2024-0842"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="sp-form-group">
                <label>PIN / Password</label>
                <div className="sp-input-wrap">
                  <span className="sp-input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Enter your PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <button type="submit" className="sp-login-btn">
                Sign In to Portal →
              </button>
            </form>
            <div className="sp-login-links">
              <a href="#">Forgot PIN?</a> &nbsp;·&nbsp; <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>← Back to School Website</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PANELS
============================================================ */

function DashboardPanel() {
  return (
    <div>
      <div className="sp-stats-row">
        <div className="sp-stat-card gold">
          <div className="sp-stat-label">Attendance</div>
          <div className="sp-stat-value">87%</div>
          <div className="sp-stat-sub">Working days attended</div>
        </div>
        <div className="sp-stat-card green">
          <div className="sp-stat-label">Last Test Score</div>
          <div className="sp-stat-value">91/100</div>
          <div className="sp-stat-sub">Mathematics · Unit 5</div>
        </div>
        <div className="sp-stat-card blue">
          <div className="sp-stat-label">Pending Homework</div>
          <div className="sp-stat-value">3</div>
          <div className="sp-stat-sub">Due this week</div>
        </div>
        <div className="sp-stat-card red">
          <div className="sp-stat-label">Fee Due</div>
          <div className="sp-stat-value">₹4,200</div>
          <div className="sp-stat-sub">Q2 · Due Jun 30</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        {/* Quick actions */}
        <div className="sp-card">
          <div className="sp-card-title">⚡ Quick Actions</div>
          <div className="sp-quick-actions">
            {[["📅","Attendance"],["📝","Homework"],["📊","Results"],["💰","Pay Fee"],["📚","Material"],["🗓️","Timetable"],["📢","Notices"],["✉️","Messages"]].map(([icon, label]) => (
              <button key={String(label)} className="sp-quick-action">
                <span className="sp-quick-action-icon">{icon}</span>
                <span className="sp-quick-action-label">{String(label)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="sp-card">
          <div className="sp-card-title">📢 Recent Notices</div>
          {[
            { imp: true, title: "Summer vacation from May 20 to June 11", date: "May 15, 2026" },
            { imp: true, title: "Fee last date extended to June 30, 2026", date: "May 12, 2026" },
            { imp: false, title: "Annual Sports Day — June 25, registration open", date: "May 10, 2026" },
            { imp: false, title: "Parent-Teacher Meeting on June 18, 2026", date: "May 8, 2026" },
          ].map((n) => (
            <div key={n.title} className="sp-notice-item">
              <div className={`sp-notice-dot ${n.imp ? "imp" : "norm"}`} />
              <div>
                <div className="sp-notice-title">{n.title}</div>
                <div className="sp-notice-date">{n.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming homework */}
      <div className="sp-card">
        <div className="sp-card-title">📝 Upcoming Homework</div>
        {[
          { subject: "Mathematics", title: "Exercise 12.3 — Trigonometry", desc: "Complete all solved examples and practice problems 1–20", due: "Tomorrow", status: "pending" },
          { subject: "Physics", title: "Lab Report — Ohm's Law Experiment", desc: "Write full lab report with observations, calculations and conclusion", due: "25 May", status: "pending" },
          { subject: "English", title: "Essay — Impact of Technology on Education", desc: "500–600 words, include introduction, body and conclusion", due: "28 May", status: "in-progress" },
        ].map((hw) => (
          <div key={hw.title} className="sp-hw-item">
            <div>
              <div className="sp-hw-subject">{hw.subject}</div>
              <div className="sp-hw-title">{hw.title}</div>
              <div className="sp-hw-desc">{hw.desc}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="sp-hw-due" style={{ color: hw.due === "Tomorrow" ? "#ef4444" : "#f59e0b" }}>Due: {hw.due}</div>
              <div style={{ marginTop: "0.5rem" }}>
                <span className={`sp-badge ${hw.status === "in-progress" ? "sp-badge-blue" : "sp-badge-yellow"}`}>
                  {hw.status === "in-progress" ? "In Progress" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePanel() {
  return (
    <div>
      <div className="sp-profile-hero">
        <div className="sp-profile-avatar">A</div>
        <div>
          <div className="sp-profile-name">{STUDENT.name}</div>
          <div className="sp-profile-meta">Class {STUDENT.class} · Roll No. {STUDENT.roll} · {STUDENT.admNo}</div>
          <div className="sp-profile-badges">
            <span className="sp-badge sp-badge-gold">🏠 {STUDENT.house}</span>
            <span className="sp-badge sp-badge-green">✅ Active</span>
            <span className="sp-badge sp-badge-blue">🚌 {STUDENT.transport}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="sp-card">
          <div className="sp-card-title">👤 Personal Details</div>
          <div className="sp-profile-info-grid">
            {[["Full Name", STUDENT.name],["Date of Birth", STUDENT.dob],["Father's Name", STUDENT.father],["Mother's Name", STUDENT.mother],["Phone", STUDENT.phone],["Email", STUDENT.email]].map(([label, val]) => (
              <div key={label} className="sp-info-item"><label>{label}</label><span>{val}</span></div>
            ))}
          </div>
        </div>
        <div className="sp-card">
          <div className="sp-card-title">🏫 Academic Details</div>
          <div className="sp-profile-info-grid">
            {[["Admission No.", STUDENT.admNo],["Class & Section", `Class ${STUDENT.class}`],["Roll Number", STUDENT.roll],["House", STUDENT.house],["Transport", STUDENT.transport],["Address", STUDENT.address]].map(([label, val]) => (
              <div key={label} className="sp-info-item"><label>{label}</label><span>{val}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendancePanel() {
  const subjects = [
    { name: "Mathematics", present: 42, total: 48, pct: 87 },
    { name: "Physics", present: 44, total: 48, pct: 91 },
    { name: "Chemistry", present: 40, total: 48, pct: 83 },
    { name: "English", present: 45, total: 48, pct: 93 },
    { name: "Hindi", present: 38, total: 48, pct: 79 },
    { name: "P.E.", present: 20, total: 22, pct: 90 },
  ];

  return (
    <div>
      <div className="sp-stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="sp-stat-card green"><div className="sp-stat-label">Overall Attendance</div><div className="sp-stat-value">87%</div><div className="sp-stat-sub">229 / 264 classes</div></div>
        <div className="sp-stat-card gold"><div className="sp-stat-label">Present Days</div><div className="sp-stat-value">134</div><div className="sp-stat-sub">Out of 154 working days</div></div>
        <div className="sp-stat-card red"><div className="sp-stat-label">Absent Days</div><div className="sp-stat-value">20</div><div className="sp-stat-sub">Medical: 8 · Other: 12</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.25rem" }}>
        <div className="sp-card" style={{ textAlign: "center" }}>
          <div className="sp-card-title" style={{ justifyContent: "center" }}>📊 Overall</div>
          <div className="sp-attendance-circle">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle cx="70" cy="70" r="58" fill="none" stroke="#C9A84C" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 58 * 0.87} ${2 * Math.PI * 58}`}
                strokeLinecap="round" />
            </svg>
            <div className="sp-attendance-pct">
              <div className="sp-attendance-pct-num">87%</div>
              <div className="sp-attendance-pct-label">Present</div>
            </div>
          </div>
          <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "1rem", lineHeight: 1.6 }}>
            Minimum required attendance is <strong>75%</strong>.<br />
            <span style={{ color: "#22c55e" }}>✅ You are within limit.</span>
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-title">📚 Subject-wise Attendance</div>
          <table className="sp-table">
            <thead><tr><th>Subject</th><th>Classes Attended</th><th>Total Classes</th><th>Percentage</th><th>Status</th></tr></thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.name}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.present}</td>
                  <td>{s.total}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div className="sp-progress-bar" style={{ flex: 1 }}>
                        <div className="sp-progress-fill sp-progress-gold" style={{ width: `${s.pct}%` }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{s.pct}%</span>
                    </div>
                  </td>
                  <td><span className={`sp-badge ${s.pct >= 75 ? "sp-badge-green" : "sp-badge-red"}`}>{s.pct >= 75 ? "✅ OK" : "⚠️ Low"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HomeworkPanel() {
  const homeworks = [
    { subject: "Mathematics", title: "Exercise 12.3 — Trigonometry", desc: "Complete all solved examples and practice problems 1–20. Show all working steps.", due: "21 May 2026", status: "pending", teacher: "Dr. Meena Sharma" },
    { subject: "Physics", title: "Lab Report — Ohm's Law Experiment", desc: "Write full lab report with apparatus, procedure, observations and conclusion.", due: "25 May 2026", status: "pending", teacher: "Mr. Rajesh Patel" },
    { subject: "English", title: "Essay — Impact of Technology", desc: "500–600 words, include introduction, body paragraphs and conclusion. Typed or handwritten.", due: "28 May 2026", status: "in-progress", teacher: "Mrs. Sunita Rao" },
    { subject: "Chemistry", title: "Periodic Table — Group Properties", desc: "Prepare a chart listing properties of all s-block and p-block elements with examples.", due: "30 May 2026", status: "completed", teacher: "Mr. Anil Gupta" },
    { subject: "Hindi", title: "कहानी लेखन — प्रकृति और मानव", desc: "400-500 शब्दों में एक मौलिक कहानी लिखें जो प्रकृति और मानव के संबंध को दर्शाए।", due: "1 Jun 2026", status: "pending", teacher: "Mrs. Preeti Joshi" },
  ];

  const statusMap: Record<string, string> = { pending: "sp-badge-yellow", "in-progress": "sp-badge-blue", completed: "sp-badge-green" };
  const statusLabel: Record<string, string> = { pending: "Pending", "in-progress": "In Progress", completed: "✅ Submitted" };

  return (
    <div>
      <div className="sp-stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="sp-stat-card gold"><div className="sp-stat-label">Total Assigned</div><div className="sp-stat-value">5</div><div className="sp-stat-sub">This week</div></div>
        <div className="sp-stat-card red"><div className="sp-stat-label">Pending</div><div className="sp-stat-value">3</div><div className="sp-stat-sub">To be submitted</div></div>
        <div className="sp-stat-card green"><div className="sp-stat-label">Completed</div><div className="sp-stat-value">1</div><div className="sp-stat-sub">Submitted</div></div>
      </div>
      <div className="sp-card">
        <div className="sp-card-title">📝 Homework Assignments</div>
        {homeworks.map((hw) => (
          <div key={hw.title} className="sp-hw-item">
            <div style={{ flex: 1 }}>
              <div className="sp-hw-subject">{hw.subject}</div>
              <div className="sp-hw-title">{hw.title}</div>
              <div className="sp-hw-desc">{hw.desc}</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.5rem" }}>Assigned by {hw.teacher}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="sp-hw-due" style={{ color: hw.status === "completed" ? "#22c55e" : "#f59e0b" }}>Due: {hw.due}</div>
              <div style={{ marginTop: "0.5rem" }}>
                <span className={`sp-badge ${statusMap[hw.status]}`}>{statusLabel[hw.status]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPanel() {
  const subjects = [
    { name: "Mathematics", marks: "91/100", pct: 91, grade: "A+" },
    { name: "Physics", marks: "84/100", pct: 84, grade: "A" },
    { name: "Chemistry", marks: "78/100", pct: 78, grade: "B+" },
    { name: "English", marks: "88/100", pct: 88, grade: "A" },
    { name: "Hindi", marks: "72/100", pct: 72, grade: "B" },
    { name: "Social Science", marks: "81/100", pct: 81, grade: "A" },
  ];

  const colorMap = (pct: number) =>
    pct >= 90 ? "sp-progress-green" : pct >= 75 ? "sp-progress-gold" : "sp-progress-blue";
  const gradeColor = (g: string) =>
    g === "A+" ? "#15803d" : g === "A" ? "#1d4ed8" : g === "B+" ? "#a16207" : "#64748b";

  return (
    <div>
      <div className="sp-stats-row">
        <div className="sp-stat-card green"><div className="sp-stat-label">Total Marks</div><div className="sp-stat-value">494</div><div className="sp-stat-sub">Out of 600</div></div>
        <div className="sp-stat-card gold"><div className="sp-stat-label">Percentage</div><div className="sp-stat-value">82.3%</div><div className="sp-stat-sub">Class average: 71%</div></div>
        <div className="sp-stat-card blue"><div className="sp-stat-label">Overall Grade</div><div className="sp-stat-value">A</div><div className="sp-stat-sub">Distinction</div></div>
        <div className="sp-stat-card gold"><div className="sp-stat-label">Class Rank</div><div className="sp-stat-value">7th</div><div className="sp-stat-sub">Out of 48 students</div></div>
      </div>
      <div className="sp-card">
        <div className="sp-card-title">📊 Unit Test 5 — Subject-wise Results</div>
        <div>
          {subjects.map((s) => (
            <div key={s.name} className="sp-result-subject-row">
              <div className="sp-result-sub-name">{s.name}</div>
              <div className="sp-result-bar-track">
                <div className={`sp-progress-fill ${colorMap(s.pct)}`} style={{ width: `${s.pct}%`, height: "100%", borderRadius: 50 }} />
              </div>
              <div className="sp-result-marks">{s.marks}</div>
              <div className="sp-result-grade" style={{ color: gradeColor(s.grade), fontWeight: 700 }}>{s.grade}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeesPanel() {
  const history = [
    { date: "Jan 10, 2026", desc: "Q1 Tuition Fee", amount: "₹8,400", status: "Paid", method: "Online (UPI)" },
    { date: "Mar 15, 2026", desc: "Exam Fee — Annual", amount: "₹1,200", status: "Paid", method: "Cash" },
    { date: "Apr 5, 2026", desc: "Sports & Activity Fee", amount: "₹600", status: "Paid", method: "Online (Card)" },
  ];

  return (
    <div>
      <div className="sp-fee-summary">
        <div className="sp-fee-card">
          <div className="sp-fee-card-label">Annual Fee</div>
          <div className="sp-fee-card-amount">₹36,000</div>
          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem" }}>Session 2025–26</div>
        </div>
        <div className="sp-fee-card">
          <div className="sp-fee-card-label">Amount Paid</div>
          <div className="sp-fee-card-amount" style={{ color: "#15803d" }}>₹31,800</div>
          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem" }}>3 transactions</div>
        </div>
        <div className="sp-fee-card">
          <div className="sp-fee-card-label">Balance Due</div>
          <div className="sp-fee-card-amount" style={{ color: "#dc2626" }}>₹4,200</div>
          <div style={{ fontSize: "0.78rem", color: "#dc2626", marginTop: "0.35rem" }}>Due: Jun 30, 2026</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="sp-card">
          <div className="sp-card-title">💳 Pay Fee Online</div>
          <div style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "1.25rem" }}>Pay your pending fee securely via UPI, Net Banking, or Card.</div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", marginBottom: "0.35rem" }}>AMOUNT DUE</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#dc2626", fontFamily: "var(--font-display)" }}>₹4,200</div>
          </div>
          <button className="sp-login-btn" style={{ padding: "0.9rem", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            💳 Pay Now — ₹4,200
          </button>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.75rem", textAlign: "center" }}>
            Secured by SSL · Accepted: UPI · Net Banking · Card
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-title">📋 Payment History</div>
          <table className="sp-table">
            <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.date}>
                  <td style={{ whiteSpace: "nowrap" }}>{h.date}</td>
                  <td>{h.desc}</td>
                  <td style={{ fontWeight: 700 }}>{h.amount}</td>
                  <td><span className="sp-badge sp-badge-green">{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NoticesPanel() {
  const notices = [
    { type: "imp", title: "Admission form last date extended to 30th May 2026", date: "May 15, 2026", cat: "Admissions", body: "Parents are informed that the last date for submission of new admission forms for the session 2026–27 has been extended from 20th May to 30th May 2026. Forms available at the school office and online portal." },
    { type: "imp", title: "Summer vacation schedule — May 20 to June 11", date: "May 12, 2026", cat: "Academic", body: "Summer vacations will be observed from May 20 to June 11, 2026. School will reopen on June 12, 2026. Students are advised to complete their vacation homework during this period." },
    { type: "imp", title: "Q2 Fee payment due — June 30, 2026", date: "May 10, 2026", cat: "Finance", body: "Q2 fee payment deadline is June 30, 2026. Parents may pay via school portal, UPI or at the school cash counter. Late fee of ₹50/day will be charged after the due date." },
    { type: "norm", title: "World Environment Day — Plantation Drive on Campus", date: "May 8, 2026", cat: "Events", body: "All students and parents are invited to participate in our annual plantation drive on June 5, 2026 (World Environment Day) from 9:00 AM. Each student will plant one sapling." },
    { type: "norm", title: "Parent-Teacher Meeting — Classes 9 to 12", date: "May 5, 2026", cat: "Parent Connect", body: "A Parent-Teacher Meeting for students of Classes 9 to 12 is scheduled on June 18, 2026 from 10:00 AM to 1:00 PM. Attendance is compulsory for all parents." },
  ];

  return (
    <div>
      <div className="sp-card">
        <div className="sp-card-title">📢 All Notices & Circulars</div>
        <div>
          {notices.map((n) => (
            <div key={n.title} style={{ padding: "1.25rem", borderRadius: 12, background: "#f8fafc", marginBottom: "0.75rem", borderLeft: `4px solid ${n.type === "imp" ? "#ef4444" : "#C9A84C"}` }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0B1628", marginBottom: "0.25rem" }}>{n.title}</div>
                  <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.75rem" }}>📅 {n.date} · <span style={{ color: "#C9A84C", fontWeight: 600 }}>{n.cat}</span></div>
                  <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.65 }}>{n.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MaterialPanel() {
  const materials = [
    { icon: "📄", color: "#dbeafe", title: "Mathematics — Chapter 12 Notes", meta: "PDF · 2.4 MB · Uploaded May 10", dl: "Download" },
    { icon: "🎬", color: "#dcfce7", title: "Physics — Electrostatics Video Lecture", meta: "MP4 · 45 min · Uploaded May 8", dl: "Watch" },
    { icon: "📝", color: "#fef9c3", title: "Chemistry — Organic Reactions Practice Sheet", meta: "PDF · 1.1 MB · Uploaded May 5", dl: "Download" },
    { icon: "📄", color: "#f3e8ff", title: "English — Grammar Exercise Book (Unit 3)", meta: "PDF · 0.8 MB · Uploaded May 3", dl: "Download" },
    { icon: "🔗", color: "#fee2e2", title: "Hindi — Chapter Summary (Aroh)", meta: "Link · External Resource · May 1", dl: "Open" },
    { icon: "📄", color: "#e0f2fe", title: "Social Science — Map Pointer Notes", meta: "PDF · 3.2 MB · Uploaded Apr 28", dl: "Download" },
  ];

  return (
    <div className="sp-card">
      <div className="sp-card-title">📚 Study Materials</div>
      {materials.map((m) => (
        <div key={m.title} className="sp-material-item">
          <div className="sp-material-icon" style={{ background: m.color }}>{m.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="sp-material-title">{m.title}</div>
            <div className="sp-material-meta">{m.meta}</div>
          </div>
          <button className="sp-material-dl">{m.dl}</button>
        </div>
      ))}
    </div>
  );
}

function TimetablePanel() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = ["8:00", "8:45", "9:30", "10:15", "11:15", "12:00", "12:45"];
  const schedule = [
    ["math","sci","eng","hin","math","pe"],
    ["sci","math","hin","eng","comp","art"],
    ["eng","hin","math","sci","pe","math"],
    ["hin","eng","sci","math","art","sci"],
    ["break","break","break","break","break","break"],
    ["comp","art","pe","sci","hin","eng"],
    ["pe","comp","art","math","sci","hin"],
  ];
  const colorMap: Record<string, string> = { math: "sp-tt-cell math", sci: "sp-tt-cell sci", eng: "sp-tt-cell eng", hin: "sp-tt-cell hin", pe: "sp-tt-cell pe", art: "sp-tt-cell art", comp: "sp-tt-cell comp", break: "sp-tt-cell break" };
  const nameMap: Record<string, string> = { math: "Math", sci: "Physics", eng: "English", hin: "Hindi", pe: "P.E.", art: "Art", comp: "Computer", break: "Break" };

  return (
    <div className="sp-card" style={{ overflowX: "auto" }}>
      <div className="sp-card-title">🗓️ Weekly Time Table — Class 10-A</div>
      <div className="sp-timetable-grid" style={{ minWidth: 600 }}>
        <div className="sp-tt-header">Time</div>
        {days.map(d => <div key={d} className="sp-tt-header">{d}</div>)}
        {times.map((time, ti) =>
          [<div key={`t${ti}`} className="sp-tt-time">{time}</div>,
          ...days.map((_, di) => {
            const sub = schedule[ti][di];
            return <div key={`${ti}-${di}`} className={colorMap[sub] || "sp-tt-cell"}><span className="sp-tt-sub">{nameMap[sub] || sub}</span></div>;
          })]
        )}
      </div>
    </div>
  );
}

function EventsPanel() {
  const events = [
    { day: "05", mon: "Jun", title: "World Environment Day — Plantation Drive", sub: "All students · 9:00 AM · School Campus", type: "green" },
    { day: "12", mon: "Jun", title: "Welcome Assembly — New Academic Session", sub: "All students · 8:00 AM · School Ground", type: "blue" },
    { day: "18", mon: "Jun", title: "Parent-Teacher Meeting (Class 9–12)", sub: "Parents invited · 10:00 AM – 1:00 PM", type: "gold" },
    { day: "25", mon: "Jun", title: "Annual Sports Day — Registration Open", sub: "All sports · Register with PE teacher", type: "red" },
    { day: "15", mon: "Jul", title: "Independence Day Celebration", sub: "All students · 8:00 AM · School Ground", type: "green" },
    { day: "20", mon: "Jul", title: "Science Exhibition & Innovation Fair", sub: "Classes 8–12 · Project submission by Jul 10", type: "blue" },
  ];
  const typeColor: Record<string, string> = { green: "#dcfce7", blue: "#dbeafe", gold: "rgba(201,168,76,0.12)", red: "#fee2e2" };

  return (
    <div className="sp-card">
      <div className="sp-card-title">🎉 Upcoming Events</div>
      {events.map((e) => (
        <div key={e.title} className="sp-event-item">
          <div className="sp-event-date-box" style={{ background: typeColor[e.type] }}>
            <div className="sp-event-date-day">{e.day}</div>
            <div className="sp-event-date-mon">{e.mon}</div>
          </div>
          <div>
            <div className="sp-event-title">{e.title}</div>
            <div className="sp-event-sub">{e.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesPanel() {
  const msgs = [
    { initials: "MS", sender: "Dr. Meena Sharma", preview: "Please complete Exercise 12.3 before Friday's class...", time: "10:30 AM", unread: true },
    { initials: "PR", sender: "Principal Office", preview: "Reminder: Parent-Teacher meeting on June 18, 2026...", time: "Yesterday", unread: true },
    { initials: "RP", sender: "Mr. Rajesh Patel", preview: "Your Physics lab report has been graded. Grade: A...", time: "May 15", unread: false },
    { initials: "SR", sender: "Mrs. Sunita Rao", preview: "The essay topic has been changed to — Digital India...", time: "May 12", unread: false },
    { initials: "FE", sender: "Fee Department", preview: "Your Q2 fee of ₹4,200 is due by June 30, 2026...", time: "May 10", unread: false },
  ];

  return (
    <div className="sp-card">
      <div className="sp-card-title">✉️ Messages</div>
      <div className="sp-msg-list">
        {msgs.map((m) => (
          <div key={m.sender} className={`sp-msg-item${m.unread ? " unread" : ""}`}>
            <div className="sp-msg-avatar">{m.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sp-msg-sender">{m.sender} {m.unread && <span style={{ display: "inline-block", width: 8, height: 8, background: "#3b82f6", borderRadius: "50%", verticalAlign: "middle", marginLeft: 4 }} />}</div>
              <div className="sp-msg-preview">{m.preview}</div>
            </div>
            <div className="sp-msg-time">{m.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD WRAPPER
============================================================ */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const panelTitles: Record<string, string> = {
    dashboard: "Dashboard",
    profile: "My Profile",
    attendance: "Attendance",
    homework: "Homework",
    results: "My Results",
    fees: "Fees & Payments",
    notices: "Notices",
    material: "Study Material",
    timetable: "Time Table",
    events: "Events",
    messages: "Messages",
  };

  const panels: Record<string, JSX.Element> = {
    dashboard: <DashboardPanel />,
    profile: <ProfilePanel />,
    attendance: <AttendancePanel />,
    homework: <HomeworkPanel />,
    results: <ResultsPanel />,
    fees: <FeesPanel />,
    notices: <NoticesPanel />,
    material: <MaterialPanel />,
    timetable: <TimetablePanel />,
    events: <EventsPanel />,
    messages: <MessagesPanel />,
  };

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="student-portal">
      <div className="sp-dashboard">
        {/* Sidebar overlay */}
        <div className={`sp-sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
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
                <span className="sp-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="sp-nav-badge">{item.badge}</span>}
              </button>
            ))}

            <div className="sp-nav-label">Academics</div>
            {NAV.slice(2, 7).map((item) => (
              <button key={item.id} className={`sp-nav-item${activePanel === item.id ? " active" : ""}`}
                onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}>
                <span className="sp-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="sp-nav-badge">{item.badge}</span>}
              </button>
            ))}

            <div className="sp-nav-label">Activities</div>
            {NAV.slice(7).map((item) => (
              <button key={item.id} className={`sp-nav-item${activePanel === item.id ? " active" : ""}`}
                onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}>
                <span className="sp-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="sp-nav-badge">{item.badge}</span>}
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
              <div className="sp-user-avatar">A</div>
              <div>
                <div className="sp-user-name">{STUDENT.name}</div>
                <div className="sp-user-id">Class {STUDENT.class} · {STUDENT.admNo}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="sp-main">
          <header className="sp-topbar">
            <div className="sp-topbar-left">
              <button className="sp-burger" onClick={() => setSidebarOpen((v) => !v)}>☰</button>
              <div className="sp-topbar-title">{panelTitles[activePanel] || "Dashboard"}</div>
            </div>
            <div className="sp-topbar-right">
              <div className="sp-topbar-date">{today}</div>
              <button className="sp-topbar-notif">
                🔔 <span className="sp-notif-dot" />
              </button>
            </div>
          </header>

          <main className="sp-panel">
            {panels[activePanel] || <DashboardPanel />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN EXPORT — handles login ↔ dashboard routing
============================================================ */
export default function StudentPortal() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return <Dashboard onLogout={() => setLoggedIn(false)} />;
}
