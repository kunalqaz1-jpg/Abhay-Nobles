import { Router } from "express";
import {
  Student,
  Teacher,
  ClassAttendance,
  Homework,
  Result,
  Notice,
  Message,
  StudyMaterial,
  TimetableRow,
  Event,
} from "../lib/mongoose";

const router = Router();

function sanitizeStudent(s: Record<string, unknown>) {
  const { password: _pw, ...safe } = s;
  return safe;
}

router.get("/students", async (_req, res) => {
  const students = await Student.find().sort({ className: 1, rollNo: 1 }).lean();
  res.json(students.map((s) => sanitizeStudent(s as Record<string, unknown>)));
});

router.get("/students/:studentId", async (req, res) => {
  const student = await Student.findOne({ studentId: req.params["studentId"] }).lean();
  if (!student) return res.status(404).json({ message: "Student not found." });
  return res.json(sanitizeStudent(student as Record<string, unknown>));
});

router.post("/students", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.studentId || !body?.fullName || !body?.className) {
    return res.status(400).json({ message: "studentId, fullName, and className are required." });
  }
  const saved = await Student.findOneAndUpdate(
    { studentId: body.studentId },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(sanitizeStudent(saved as Record<string, unknown>));
});

router.post("/students/:studentId/fees", async (req, res) => {
  const { fees } = req.body as { fees: unknown };
  const student = await Student.findOneAndUpdate(
    { studentId: req.params["studentId"] },
    { $set: { fees } },
    { new: true },
  ).lean();
  if (!student) return res.status(404).json({ message: "Student not found." });
  return res.json(sanitizeStudent(student as Record<string, unknown>));
});

router.get("/teachers", async (_req, res) => {
  const teachers = await Teacher.find().sort({ name: 1 }).lean();
  res.json(teachers);
});

router.post("/teachers", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.teacherId || !body?.name || !body?.subject) {
    return res.status(400).json({ message: "teacherId, name, and subject are required." });
  }
  const saved = await Teacher.findOneAndUpdate(
    { teacherId: body.teacherId },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.post("/attendance/class", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.className || !body?.date || !body?.teacherName) {
    return res.status(400).json({ message: "className, date, and teacherName are required." });
  }
  const saved = await ClassAttendance.findOneAndUpdate(
    { className: body.className, date: body.date },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.get("/attendance/class", async (req, res) => {
  const { className, date } = req.query as Record<string, string>;
  if (!className || !date) return res.status(400).json({ message: "className and date are required." });
  const record = await ClassAttendance.findOne({ className, date }).lean();
  return res.json(record || null);
});

router.get("/attendance/student/:studentId/latest", async (req, res) => {
  const student = await Student.findOne({ studentId: req.params["studentId"] }).lean();
  if (!student) return res.json(null);
  const record = await ClassAttendance.findOne({
    className: (student as Record<string, unknown>)["className"],
    "entries.studentId": req.params["studentId"],
  })
    .sort({ date: -1 })
    .lean();
  if (!record) return res.json(null);
  const entry = (record as unknown as { entries: Array<{ studentId: string }> }).entries.find(
    (e) => e.studentId === req.params["studentId"],
  );
  return res.json(entry ? { record, entry } : null);
});

router.post("/homework", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.id || !body?.className || !body?.title) {
    return res.status(400).json({ message: "id, className, and title are required." });
  }
  const saved = await Homework.findOneAndUpdate(
    { id: body.id },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.get("/homework/latest/:className", async (req, res) => {
  const record = await Homework.findOne({ className: req.params["className"] })
    .sort({ createdAt: -1 })
    .lean();
  return res.json(record || null);
});

router.post("/results", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.id || !body?.className || !body?.title) {
    return res.status(400).json({ message: "id, className, and title are required." });
  }
  const saved = await Result.findOneAndUpdate(
    { id: body.id },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.get("/results/latest", async (req, res) => {
  const { className, rollNo } = req.query as Record<string, string>;
  if (!className) return res.status(400).json({ message: "className is required." });
  const record = await Result.findOne({
    className,
    ...(rollNo ? { $or: [{ targetRollNo: { $exists: false } }, { targetRollNo: rollNo }] } : {}),
  })
    .sort({ createdAt: -1 })
    .lean();
  return res.json(record || null);
});

router.get("/notices", async (req, res) => {
  const { className } = req.query as Record<string, string>;
  const query = className
    ? { $or: [{ audience: "All Classes" }, { audience: className }, { className }] }
    : {};
  const notices = await Notice.find(query).sort({ createdAt: -1 }).lean();
  res.json(notices);
});

router.post("/notices", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.id || !body?.title || !body?.description) {
    return res.status(400).json({ message: "id, title, and description are required." });
  }
  const saved = await Notice.findOneAndUpdate(
    { id: body.id },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.get("/messages", async (req, res) => {
  const { className, studentId } = req.query as Record<string, string>;
  const or: object[] = [{ audience: "all-students" }];
  if (className) or.push({ className });
  if (studentId) or.push({ studentId });
  const messages = await Message.find({ $or: or }).sort({ sentAt: -1 }).lean();
  res.json(messages);
});

router.post("/messages", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.id || !body?.subject || !body?.body) {
    return res.status(400).json({ message: "id, subject, and body are required." });
  }
  const saved = await Message.findOneAndUpdate(
    { id: body.id },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.get("/materials", async (req, res) => {
  const { className } = req.query as Record<string, string>;
  const query = className ? { className } : {};
  const materials = await StudyMaterial.find(query).sort({ updatedAt: -1 }).lean();
  res.json(materials);
});

router.post("/materials", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.id || !body?.title || !body?.className) {
    return res.status(400).json({ message: "id, title, and className are required." });
  }
  const saved = await StudyMaterial.findOneAndUpdate(
    { id: body.id },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.get("/timetable", async (req, res) => {
  const { className } = req.query as Record<string, string>;
  const query = className ? { className } : {};
  const rows = await TimetableRow.find(query).sort({ period: 1 }).lean();
  res.json(rows);
});

router.post("/timetable", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.id || !body?.className || !body?.period) {
    return res.status(400).json({ message: "id, className, and period are required." });
  }
  const saved = await TimetableRow.findOneAndUpdate(
    { id: body.id },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

router.get("/events", async (req, res) => {
  const { className } = req.query as Record<string, string>;
  const query = className ? { $or: [{ className: "All Classes" }, { className }] } : {};
  const events = await Event.find(query).sort({ eventDate: 1 }).lean();
  res.json(events);
});

router.post("/events", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body?.id || !body?.title || !body?.eventDate) {
    return res.status(400).json({ message: "id, title, and eventDate are required." });
  }
  const saved = await Event.findOneAndUpdate(
    { id: body.id },
    body,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return res.json(saved);
});

export default router;
