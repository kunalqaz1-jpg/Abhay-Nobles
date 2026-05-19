import mongoose from "mongoose";
import { logger } from "./logger";

let connected = false;

export function isMongoConnected(): boolean {
  return connected;
}

export async function connectMongo(): Promise<void> {
  if (connected) return;

  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    logger.warn("MONGODB_URI not set — MongoDB routes will be unavailable");
    return;
  }

  await mongoose.connect(uri);
  connected = true;
  logger.info("MongoDB connected");
}

const feeHistorySchema = new mongoose.Schema(
  {
    period: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, required: true },
  },
  { _id: false },
);

const parentSchema = new mongoose.Schema(
  {
    relation: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    className: { type: String, required: true, index: true },
    section: { type: String, required: true },
    rollNo: { type: String, required: true, index: true },
    photo: { type: String, default: "" },
    parents: { type: [parentSchema], default: [] },
    fees: {
      currentTermStatus: { type: String, default: "Pending" },
      currentTermNote: { type: String, default: "" },
      nextDueAmount: { type: String, default: "0" },
      nextDueLabel: { type: String, default: "" },
      history: { type: [feeHistorySchema], default: [] },
    },
  },
  { timestamps: true },
);

const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    qualification: { type: String, default: "" },
    joinDate: { type: String, default: "" },
    phone: { type: String, default: "" },
    assignedClasses: { type: [String], default: [] },
  },
  { timestamps: true },
);

const attendanceEntrySchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
    remark: { type: String, default: "" },
  },
  { _id: false },
);

const classAttendanceSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    teacherName: { type: String, required: true },
    updatedAt: { type: String, required: true },
    entries: { type: [attendanceEntrySchema], default: [] },
  },
  { timestamps: true },
);
classAttendanceSchema.index({ className: 1, date: 1 }, { unique: true });

const homeworkSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    className: { type: String, required: true, index: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dueDate: { type: String, required: true },
    fileName: { type: String, default: "" },
    teacherName: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

const resultSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    className: { type: String, required: true, index: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    examType: { type: String, enum: ["yearly", "half-yearly", "unit-test"], required: true },
    unitTestNumber: { type: Number },
    title: { type: String, required: true },
    fileName: { type: String, default: "" },
    targetRollNo: { type: String, index: true },
    teacherName: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

const noticeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    audience: { type: String, default: "All Classes" },
    className: { type: String, default: "" },
    teacherName: { type: String, default: "" },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    audience: { type: String, required: true },
    className: { type: String, default: "All Classes", index: true },
    studentId: { type: String, default: "" },
    studentName: { type: String, default: "" },
    teacherName: { type: String, default: "" },
    sentAt: { type: String, required: true },
  },
  { timestamps: true },
);

const studyMaterialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    className: { type: String, required: true, index: true },
    fileName: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    resourceType: { type: String, default: "File" },
    updatedAt: { type: String, required: true },
  },
  { timestamps: true },
);

const timetableRowSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    className: { type: String, required: true, index: true },
    period: { type: String, required: true },
    subject: { type: String, required: true },
    time: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { timestamps: true },
);

const eventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    className: { type: String, default: "All Classes", index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    eventDate: { type: String, required: true },
    teacherName: { type: String, default: "" },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

export const Student = mongoose.models["Student"] ?? mongoose.model("Student", studentSchema);
export const Teacher = mongoose.models["Teacher"] ?? mongoose.model("Teacher", teacherSchema);
export const ClassAttendance = mongoose.models["ClassAttendance"] ?? mongoose.model("ClassAttendance", classAttendanceSchema);
export const Homework = mongoose.models["Homework"] ?? mongoose.model("Homework", homeworkSchema);
export const Result = mongoose.models["Result"] ?? mongoose.model("Result", resultSchema);
export const Notice = mongoose.models["Notice"] ?? mongoose.model("Notice", noticeSchema);
export const Message = mongoose.models["Message"] ?? mongoose.model("Message", messageSchema);
export const StudyMaterial = mongoose.models["StudyMaterial"] ?? mongoose.model("StudyMaterial", studyMaterialSchema);
export const TimetableRow = mongoose.models["TimetableRow"] ?? mongoose.model("TimetableRow", timetableRowSchema);
export const Event = mongoose.models["Event"] ?? mongoose.model("Event", eventSchema);
