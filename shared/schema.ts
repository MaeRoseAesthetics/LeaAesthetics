import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profile storage table (extends Supabase auth.users)
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey(), // References auth.users(id)
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("practitioner"), // practitioner, admin, client, student
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients table for treatment recipients
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => userProfiles.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  medicalHistory: text("medical_history"),
  allergies: text("allergies"),
  currentMedications: text("current_medications"),
  ageVerified: boolean("age_verified").default(false),
  consentStatus: varchar("consent_status").default("pending"), // pending, signed, expired
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table for course participants
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => userProfiles.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  qualificationLevel: varchar("qualification_level"),
  priorExperience: text("prior_experience"),
  cpdHours: integer("cpd_hours").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Treatments table
export const treatments = pgTable("treatments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  requiresConsent: boolean("requires_consent").default(true),
  ageRestriction: integer("age_restriction").default(18),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  level: varchar("level"), // Level 4, 5, 6, 7
  duration: integer("duration"), // in days
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxStudents: integer("max_students"),
  ofqualCompliant: boolean("ofqual_compliant").default(true),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table for treatments
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  treatmentId: varchar("treatment_id").references(() => treatments.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  status: varchar("status").default("scheduled"), // scheduled, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course enrollments table
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: varchar("status").default("active"), // active, completed, dropped
  progress: integer("progress").default(0), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Consent forms table
export const consentForms = pgTable("consent_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  treatmentId: varchar("treatment_id").references(() => treatments.id).notNull(),
  formType: varchar("form_type").notNull(), // "treatment", "psychological_screening", "medical_history"
  content: text("content").notNull(),
  signed: boolean("signed").default(false),
  signedDate: timestamp("signed_date"),
  signatureData: text("signature_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id),
  studentId: varchar("student_id").references(() => students.id),
  bookingId: varchar("booking_id").references(() => bookings.id),
  enrollmentId: varchar("enrollment_id").references(() => enrollments.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, completed, failed, refunded
  ageVerified: boolean("age_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course content table
export const courseContent = pgTable("course_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  title: varchar("title").notNull(),
  content: text("content"),
  contentType: varchar("content_type").notNull(), // "text", "video", "pdf", "quiz"
  filePath: varchar("file_path"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assessments table
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  assessmentType: varchar("assessment_type").notNull(), // "quiz", "practical", "portfolio", "osce"
  score: integer("score"),
  maxScore: integer("max_score"),
  passed: boolean("passed").default(false),
  feedback: text("feedback"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  clients: many(clients),
  students: many(students),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(userProfiles, { fields: [clients.userId], references: [userProfiles.id] }),
  bookings: many(bookings),
  consentForms: many(consentForms),
  payments: many(payments),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(userProfiles, { fields: [students.userId], references: [userProfiles.id] }),
  enrollments: many(enrollments),
  assessments: many(assessments),
  payments: many(payments),
}));

export const treatmentsRelations = relations(treatments, ({ many }) => ({
  bookings: many(bookings),
  consentForms: many(consentForms),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  courseContent: many(courseContent),
  assessments: many(assessments),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  client: one(clients, { fields: [bookings.clientId], references: [clients.id] }),
  treatment: one(treatments, { fields: [bookings.treatmentId], references: [treatments.id] }),
  payments: many(payments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  student: one(students, { fields: [enrollments.studentId], references: [students.id] }),
  course: one(courses, { fields: [enrollments.courseId], references: [courses.id] }),
  payments: many(payments),
}));

export const consentFormsRelations = relations(consentForms, ({ one }) => ({
  client: one(clients, { fields: [consentForms.clientId], references: [clients.id] }),
  treatment: one(treatments, { fields: [consentForms.treatmentId], references: [treatments.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  client: one(clients, { fields: [payments.clientId], references: [clients.id] }),
  student: one(students, { fields: [payments.studentId], references: [students.id] }),
  booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
  enrollment: one(enrollments, { fields: [payments.enrollmentId], references: [enrollments.id] }),
}));

export const courseContentRelations = relations(courseContent, ({ one }) => ({
  course: one(courses, { fields: [courseContent.courseId], references: [courses.id] }),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  course: one(courses, { fields: [assessments.courseId], references: [courses.id] }),
  student: one(students, { fields: [assessments.studentId], references: [students.id] }),
}));

// Insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTreatmentSchema = createInsertSchema(treatments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsentFormSchema = createInsertSchema(consentForms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseContentSchema = createInsertSchema(courseContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUserProfile = typeof userProfiles.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertTreatment = z.infer<typeof insertTreatmentSchema>;
export type Treatment = typeof treatments.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertConsentForm = z.infer<typeof insertConsentFormSchema>;
export type ConsentForm = typeof consentForms.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertCourseContent = z.infer<typeof insertCourseContentSchema>;
export type CourseContent = typeof courseContent.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
