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

// Inventory and Equipment tables
export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  sku: varchar("sku").unique(),
  category: varchar("category").notNull(), // "consumable", "equipment", "product"
  quantity: integer("quantity").default(0),
  minStockLevel: integer("min_stock_level").default(0),
  maxStockLevel: integer("max_stock_level"),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  sellPrice: decimal("sell_price", { precision: 10, scale: 2 }),
  supplier: varchar("supplier"),
  expiryDate: timestamp("expiry_date"),
  batchNumber: varchar("batch_number"),
  location: varchar("location"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  model: varchar("model"),
  serialNumber: varchar("serial_number"),
  manufacturer: varchar("manufacturer"),
  purchaseDate: timestamp("purchase_date"),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
  warrantyExpiry: timestamp("warranty_expiry"),
  lastServiceDate: timestamp("last_service_date"),
  nextServiceDate: timestamp("next_service_date"),
  serviceInterval: integer("service_interval"), // days between services
  status: varchar("status").default("operational"), // operational, maintenance, repair, retired
  location: varchar("location"),
  roomId: varchar("room_id"),
  calibrationDate: timestamp("calibration_date"),
  nextCalibrationDate: timestamp("next_calibration_date"),
  complianceCertificates: jsonb("compliance_certificates"),
  maintenanceCost: decimal("maintenance_cost", { precision: 10, scale: 2 }).default('0'),
  notes: text("notes"),
  qrCode: varchar("qr_code"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stock movements tracking
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inventoryId: varchar("inventory_id").references(() => inventory.id).notNull(),
  movementType: varchar("movement_type").notNull(), // "in", "out", "adjustment", "expired", "damaged"
  quantity: integer("quantity").notNull(),
  previousQuantity: integer("previous_quantity").notNull(),
  newQuantity: integer("new_quantity").notNull(),
  reason: varchar("reason"), // "purchase", "sale", "treatment_used", "wastage", "return", "transfer"
  reference: varchar("reference"), // PO number, booking ID, etc.
  userId: varchar("user_id").references(() => userProfiles.id),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Equipment maintenance records
export const maintenanceRecords = pgTable("maintenance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").references(() => equipment.id).notNull(),
  maintenanceType: varchar("maintenance_type").notNull(), // "routine", "repair", "calibration", "inspection"
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  performedBy: varchar("performed_by"),
  externalProvider: varchar("external_provider"),
  description: text("description").notNull(),
  issuesFound: text("issues_found"),
  actionsPerformed: text("actions_performed"),
  partsReplaced: jsonb("parts_replaced"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  nextServiceDate: timestamp("next_service_date"),
  status: varchar("status").default("scheduled"), // scheduled, in_progress, completed, cancelled
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory alerts and notifications
export const inventoryAlerts = pgTable("inventory_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inventoryId: varchar("inventory_id").references(() => inventory.id),
  equipmentId: varchar("equipment_id").references(() => equipment.id),
  alertType: varchar("alert_type").notNull(), // "low_stock", "expired", "maintenance_due", "warranty_expiring"
  severity: varchar("severity").default("medium"), // "low", "medium", "high", "critical"
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isDismissed: boolean("is_dismissed").default(false),
  expiresAt: timestamp("expires_at"),
  actionRequired: varchar("action_required"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Suppliers management
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  contactName: varchar("contact_name"),
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  website: varchar("website"),
  taxNumber: varchar("tax_number"),
  paymentTerms: varchar("payment_terms"),
  deliveryTime: integer("delivery_time"), // average delivery days
  minimumOrder: decimal("minimum_order", { precision: 10, scale: 2 }),
  discount: decimal("discount", { precision: 5, scale: 2 }),
  rating: integer("rating"), // 1-5 stars
  notes: text("notes"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchase orders
export const purchaseOrders = pgTable("purchase_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").unique().notNull(),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  status: varchar("status").default("draft"), // draft, sent, confirmed, delivered, cancelled
  orderDate: timestamp("order_date").defaultNow(),
  expectedDelivery: timestamp("expected_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => userProfiles.id),
  approvedBy: varchar("approved_by").references(() => userProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchase order items
export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseOrderId: varchar("purchase_order_id").references(() => purchaseOrders.id).notNull(),
  inventoryId: varchar("inventory_id").references(() => inventory.id),
  itemName: varchar("item_name").notNull(),
  sku: varchar("sku"),
  quantity: integer("quantity").notNull(),
  receivedQuantity: integer("received_quantity").default(0),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Certifications and Compliance
export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  courseId: varchar("course_id").references(() => courses.id),
  certificationType: varchar("certification_type").notNull(), // "completion", "competency", "cpd"
  certificateNumber: varchar("certificate_number"),
  issuedDate: timestamp("issued_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  awardingBody: varchar("awarding_body"),
  level: varchar("level"),
  credits: integer("credits"),
  status: varchar("status").default("active"), // active, expired, revoked
  digitalSignature: text("digital_signature"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit Trail
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => userProfiles.id),
  action: varchar("action").notNull(), // CREATE, UPDATE, DELETE, LOGIN, etc.
  tableName: varchar("table_name"),
  recordId: varchar("record_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Communication
export const communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => userProfiles.id),
  recipientId: varchar("recipient_id").references(() => userProfiles.id),
  type: varchar("type").notNull(), // "email", "sms", "internal_message", "appointment_reminder"
  subject: varchar("subject"),
  content: text("content").notNull(),
  status: varchar("status").default("sent"), // sent, delivered, read, failed
  scheduledDate: timestamp("scheduled_date"),
  sentDate: timestamp("sent_date"),
  readDate: timestamp("read_date"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Templates for communications
export const communicationTemplates = pgTable("communication_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "email", "sms", "appointment_reminder"
  subject: varchar("subject"),
  content: text("content").notNull(),
  variables: jsonb("variables"), // Available template variables
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Staff and Schedules
export const staff = pgTable("staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => userProfiles.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  role: varchar("role").notNull(), // "practitioner", "therapist", "admin", "receptionist"
  specialties: jsonb("specialties"),
  workingHours: jsonb("working_hours"), // Weekly schedule
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: varchar("staff_id").references(() => staff.id),
  equipmentId: varchar("equipment_id").references(() => equipment.id),
  roomId: varchar("room_id"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  type: varchar("type").notNull(), // "available", "booked", "blocked", "maintenance"
  bookingId: varchar("booking_id").references(() => bookings.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced Booking Features
export const bookingWaitlist = pgTable("booking_waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  treatmentId: varchar("treatment_id").references(() => treatments.id).notNull(),
  preferredDate: timestamp("preferred_date"),
  preferredTime: varchar("preferred_time"),
  alternativeDates: jsonb("alternative_dates"),
  priority: integer("priority").default(0),
  status: varchar("status").default("waiting"), // waiting, contacted, booked, expired
  notifiedDate: timestamp("notified_date"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Treatment Notes and Documentation
export const treatmentNotes = pgTable("treatment_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id).notNull(),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  practitionerId: varchar("practitioner_id").references(() => userProfiles.id).notNull(),
  preNotes: text("pre_notes"),
  treatmentNotes: text("treatment_notes"),
  aftercareNotes: text("aftercare_notes"),
  productsUsed: jsonb("products_used"),
  equipmentUsed: jsonb("equipment_used"),
  complications: text("complications"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  clientSatisfaction: integer("client_satisfaction"), // 1-5 rating
  photos: jsonb("photos"), // Array of photo URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client Files and Documents
export const clientDocuments = pgTable("client_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type").notNull(), // "photo", "consent", "medical", "other"
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  uploadedBy: varchar("uploaded_by").references(() => userProfiles.id),
  description: text("description"),
  tags: jsonb("tags"),
  treatmentId: varchar("treatment_id").references(() => treatments.id),
  bookingId: varchar("booking_id").references(() => bookings.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Analytics and Reports
export const businessMetrics = pgTable("business_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  metricType: varchar("metric_type").notNull(), // "revenue", "bookings", "clients", "retention"
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
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

// New table relations
export const inventoryRelations = relations(inventory, ({ many }) => ({
  treatmentNotes: many(treatmentNotes),
}));

export const equipmentRelations = relations(equipment, ({ many }) => ({
  schedules: many(schedules),
  treatmentNotes: many(treatmentNotes),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
  student: one(students, { fields: [certifications.studentId], references: [students.id] }),
  course: one(courses, { fields: [certifications.courseId], references: [courses.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(userProfiles, { fields: [auditLogs.userId], references: [userProfiles.id] }),
}));

export const communicationsRelations = relations(communications, ({ one }) => ({
  sender: one(userProfiles, { fields: [communications.senderId], references: [userProfiles.id] }),
  recipient: one(userProfiles, { fields: [communications.recipientId], references: [userProfiles.id] }),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  user: one(userProfiles, { fields: [staff.userId], references: [userProfiles.id] }),
  schedules: many(schedules),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  staff: one(staff, { fields: [schedules.staffId], references: [staff.id] }),
  equipment: one(equipment, { fields: [schedules.equipmentId], references: [equipment.id] }),
  booking: one(bookings, { fields: [schedules.bookingId], references: [bookings.id] }),
}));

export const bookingWaitlistRelations = relations(bookingWaitlist, ({ one }) => ({
  client: one(clients, { fields: [bookingWaitlist.clientId], references: [clients.id] }),
  treatment: one(treatments, { fields: [bookingWaitlist.treatmentId], references: [treatments.id] }),
}));

export const treatmentNotesRelations = relations(treatmentNotes, ({ one }) => ({
  booking: one(bookings, { fields: [treatmentNotes.bookingId], references: [bookings.id] }),
  client: one(clients, { fields: [treatmentNotes.clientId], references: [clients.id] }),
  practitioner: one(userProfiles, { fields: [treatmentNotes.practitionerId], references: [userProfiles.id] }),
}));

export const clientDocumentsRelations = relations(clientDocuments, ({ one }) => ({
  client: one(clients, { fields: [clientDocuments.clientId], references: [clients.id] }),
  uploadedByUser: one(userProfiles, { fields: [clientDocuments.uploadedBy], references: [userProfiles.id] }),
  treatment: one(treatments, { fields: [clientDocuments.treatmentId], references: [treatments.id] }),
  booking: one(bookings, { fields: [clientDocuments.bookingId], references: [bookings.id] }),
}));

// Additional insert schemas for new tables
export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunicationTemplateSchema = createInsertSchema(communicationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingWaitlistSchema = createInsertSchema(bookingWaitlist).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTreatmentNotesSchema = createInsertSchema(treatmentNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientDocumentsSchema = createInsertSchema(clientDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessMetricsSchema = createInsertSchema(businessMetrics).omit({
  id: true,
  createdAt: true,
});

// Insert schemas for new inventory tables
export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryAlertSchema = createInsertSchema(inventoryAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems).omit({
  id: true,
  createdAt: true,
});

// Additional Types
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Inventory = typeof inventory.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type InsertInventoryAlert = z.infer<typeof insertInventoryAlertSchema>;
export type InventoryAlert = typeof inventoryAlerts.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrderItem = z.infer<typeof insertPurchaseOrderItemSchema>;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
export type Communication = typeof communications.$inferSelect;
export type InsertCommunicationTemplate = z.infer<typeof insertCommunicationTemplateSchema>;
export type CommunicationTemplate = typeof communicationTemplates.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staff.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertBookingWaitlist = z.infer<typeof insertBookingWaitlistSchema>;
export type BookingWaitlist = typeof bookingWaitlist.$inferSelect;
export type InsertTreatmentNotes = z.infer<typeof insertTreatmentNotesSchema>;
export type TreatmentNotes = typeof treatmentNotes.$inferSelect;
export type InsertClientDocuments = z.infer<typeof insertClientDocumentsSchema>;
export type ClientDocuments = typeof clientDocuments.$inferSelect;
export type InsertBusinessMetrics = z.infer<typeof insertBusinessMetricsSchema>;
export type BusinessMetrics = typeof businessMetrics.$inferSelect;

// LMS Enhancement Tables

// Course Modules for structured learning
export const courseModules = pgTable("course_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0),
  duration: integer("duration"), // in hours
  contentType: varchar("content_type").notNull(), // "video", "document", "interactive", "quiz"
  contentUrl: varchar("content_url"),
  isRequired: boolean("is_required").default(true),
  prerequisites: jsonb("prerequisites"), // Array of module IDs
  learningObjectives: jsonb("learning_objectives"),
  resources: jsonb("resources"), // Additional resources and materials
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student module completion tracking
export const moduleProgress = pgTable("module_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  moduleId: varchar("module_id").references(() => courseModules.id).notNull(),
  status: varchar("status").default("not_started"), // not_started, in_progress, completed, failed
  progress: integer("progress").default(0), // percentage
  timeSpent: integer("time_spent").default(0), // minutes
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  score: integer("score"),
  maxScore: integer("max_score"),
  attempts: integer("attempts").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assessment Questions and Quizzes
export const assessmentQuestions = pgTable("assessment_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull(), // Reference to assessment
  moduleId: varchar("module_id").references(() => courseModules.id),
  type: varchar("type").notNull(), // "multiple_choice", "true_false", "short_answer", "essay", "practical"
  question: text("question").notNull(),
  options: jsonb("options"), // For multiple choice questions
  correctAnswer: text("correct_answer"),
  explanation: text("explanation"),
  points: integer("points").default(1),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  tags: jsonb("tags"), // For categorization
  mediaUrl: varchar("media_url"), // Images, videos, etc.
  orderIndex: integer("order_index").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Assessment Responses
export const assessmentResponses = pgTable("assessment_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull(),
  questionId: varchar("question_id").references(() => assessmentQuestions.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  response: text("response"), // Student's answer
  isCorrect: boolean("is_correct"),
  pointsEarned: integer("points_earned").default(0),
  feedback: text("feedback"), // Instructor feedback
  timeSpent: integer("time_spent").default(0), // seconds
  submittedAt: timestamp("submitted_at").defaultNow(),
  gradedAt: timestamp("graded_at"),
  gradedBy: varchar("graded_by").references(() => userProfiles.id),
});

// CPD (Continuing Professional Development) Records
export const cpdRecords = pgTable("cpd_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  activityType: varchar("activity_type").notNull(), // "course", "workshop", "conference", "webinar", "self_study", "mentoring"
  title: varchar("title").notNull(),
  description: text("description"),
  provider: varchar("provider"), // Training provider or institution
  hours: decimal("hours", { precision: 5, scale: 2 }).notNull(),
  dateCompleted: timestamp("date_completed").notNull(),
  certificateNumber: varchar("certificate_number"),
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, rejected
  verifiedBy: varchar("verified_by").references(() => userProfiles.id),
  verifiedAt: timestamp("verified_at"),
  evidenceUrl: varchar("evidence_url"), // Certificate or proof document
  category: varchar("category"), // "clinical", "business", "regulatory", "safety"
  relevanceRating: integer("relevance_rating"), // 1-5 scale
  notes: text("notes"),
  expiryDate: timestamp("expiry_date"),
  renewalRequired: boolean("renewal_required").default(false),
  cpdYear: integer("cpd_year").notNull(), // CPD reporting year
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Digital Certificates
export const digitalCertificates = pgTable("digital_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id),
  certificateNumber: varchar("certificate_number").unique().notNull(),
  certificateType: varchar("certificate_type").notNull(), // "completion", "achievement", "competency", "cpd"
  title: varchar("title").notNull(),
  description: text("description"),
  issuedDate: timestamp("issued_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  awardingBody: varchar("awarding_body").notNull(),
  qualificationLevel: varchar("qualification_level"), // Level 3, 4, 5, 6, 7
  credits: integer("credits"),
  gradingScale: varchar("grading_scale"), // "Pass/Fail", "A-F", "Percentage"
  finalGrade: varchar("final_grade"),
  finalScore: decimal("final_score", { precision: 5, scale: 2 }),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }),
  hoursCompleted: decimal("hours_completed", { precision: 6, scale: 2 }),
  instructorName: varchar("instructor_name"),
  instructorSignature: text("instructor_signature"),
  institutionSeal: text("institution_seal"),
  digitalSignature: text("digital_signature"),
  verificationCode: varchar("verification_code").unique(),
  blockchain_hash: varchar("blockchain_hash"), // For blockchain verification
  status: varchar("status").default("active"), // active, revoked, expired
  metadata: jsonb("metadata"), // Additional certificate data
  templateId: varchar("template_id"), // Certificate template used
  pdfUrl: varchar("pdf_url"), // Generated PDF URL
  shareable_url: varchar("shareable_url"), // Public verification URL
  downloadCount: integer("download_count").default(0),
  lastDownloaded: timestamp("last_downloaded"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Certificate Verification Log
export const certificateVerifications = pgTable("certificate_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateId: varchar("certificate_id").references(() => digitalCertificates.id).notNull(),
  verifierName: varchar("verifier_name"),
  verifierEmail: varchar("verifier_email"),
  verifierOrganization: varchar("verifier_organization"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  verificationResult: varchar("verification_result").notNull(), // "valid", "invalid", "expired", "revoked"
  verifiedAt: timestamp("verified_at").defaultNow(),
});

// Learning Paths - Structured learning sequences
export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  level: varchar("level"), // "Beginner", "Intermediate", "Advanced"
  duration: integer("duration"), // estimated weeks to complete
  courses: jsonb("courses").notNull(), // Ordered array of course IDs
  prerequisites: jsonb("prerequisites"),
  learningObjectives: jsonb("learning_objectives"),
  targetAudience: text("target_audience"),
  price: decimal("price", { precision: 10, scale: 2 }),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  imageUrl: varchar("image_url"),
  tags: jsonb("tags"),
  difficulty: varchar("difficulty").default("intermediate"),
  popularity: integer("popularity").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  enrollmentCount: integer("enrollment_count").default(0),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }),
  active: boolean("active").default(true),
  featured: boolean("featured").default(false),
  createdBy: varchar("created_by").references(() => userProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Learning Path Progress
export const learningPathProgress = pgTable("learning_path_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  learningPathId: varchar("learning_path_id").references(() => learningPaths.id).notNull(),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: varchar("status").default("active"), // active, paused, completed, dropped
  progress: integer("progress").default(0), // percentage
  currentCourseId: varchar("current_course_id").references(() => courses.id),
  completedCourses: jsonb("completed_courses").default('[]'),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  targetCompletionDate: timestamp("target_completion_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Instructor Profiles
export const instructors = pgTable("instructors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => userProfiles.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone"),
  bio: text("bio"),
  qualifications: jsonb("qualifications"),
  specializations: jsonb("specializations"),
  experience: text("experience"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  coursesCount: integer("courses_count").default(0),
  studentsCount: integer("students_count").default(0),
  profileImageUrl: varchar("profile_image_url"),
  linkedinUrl: varchar("linkedin_url"),
  websiteUrl: varchar("website_url"),
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  availability: jsonb("availability"), // Available time slots
  languages: jsonb("languages"),
  certifications: jsonb("certifications"),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course-Instructor Assignments
export const courseInstructors = pgTable("course_instructors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  instructorId: varchar("instructor_id").references(() => instructors.id).notNull(),
  role: varchar("role").default("primary"), // primary, assistant, guest
  assignedAt: timestamp("assigned_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student Feedback and Reviews
export const courseReviews = pgTable("course_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  instructorId: varchar("instructor_id").references(() => instructors.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title"),
  comment: text("comment"),
  wouldRecommend: boolean("would_recommend"),
  tags: jsonb("tags"), // "helpful", "clear", "engaging", etc.
  isAnonymous: boolean("is_anonymous").default(false),
  isVerified: boolean("is_verified").default(false), // Verified completion
  helpfulVotes: integer("helpful_votes").default(0),
  reportedCount: integer("reported_count").default(0),
  status: varchar("status").default("active"), // active, hidden, reported
  moderatedBy: varchar("moderated_by").references(() => userProfiles.id),
  moderatedAt: timestamp("moderated_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for LMS Enhancement Tables
export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, { fields: [courseModules.courseId], references: [courses.id] }),
  moduleProgress: many(moduleProgress),
  assessmentQuestions: many(assessmentQuestions),
}));

export const moduleProgressRelations = relations(moduleProgress, ({ one }) => ({
  student: one(students, { fields: [moduleProgress.studentId], references: [students.id] }),
  course: one(courses, { fields: [moduleProgress.courseId], references: [courses.id] }),
  module: one(courseModules, { fields: [moduleProgress.moduleId], references: [courseModules.id] }),
}));

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ one, many }) => ({
  module: one(courseModules, { fields: [assessmentQuestions.moduleId], references: [courseModules.id] }),
  responses: many(assessmentResponses),
}));

export const assessmentResponsesRelations = relations(assessmentResponses, ({ one }) => ({
  question: one(assessmentQuestions, { fields: [assessmentResponses.questionId], references: [assessmentQuestions.id] }),
  student: one(students, { fields: [assessmentResponses.studentId], references: [students.id] }),
  gradedByUser: one(userProfiles, { fields: [assessmentResponses.gradedBy], references: [userProfiles.id] }),
}));

export const cpdRecordsRelations = relations(cpdRecords, ({ one }) => ({
  student: one(students, { fields: [cpdRecords.studentId], references: [students.id] }),
  verifiedByUser: one(userProfiles, { fields: [cpdRecords.verifiedBy], references: [userProfiles.id] }),
}));

export const digitalCertificatesRelations = relations(digitalCertificates, ({ one, many }) => ({
  student: one(students, { fields: [digitalCertificates.studentId], references: [students.id] }),
  course: one(courses, { fields: [digitalCertificates.courseId], references: [courses.id] }),
  verifications: many(certificateVerifications),
}));

export const certificateVerificationsRelations = relations(certificateVerifications, ({ one }) => ({
  certificate: one(digitalCertificates, { fields: [certificateVerifications.certificateId], references: [digitalCertificates.id] }),
}));

export const learningPathsRelations = relations(learningPaths, ({ one, many }) => ({
  createdByUser: one(userProfiles, { fields: [learningPaths.createdBy], references: [userProfiles.id] }),
  progress: many(learningPathProgress),
}));

export const learningPathProgressRelations = relations(learningPathProgress, ({ one }) => ({
  student: one(students, { fields: [learningPathProgress.studentId], references: [students.id] }),
  learningPath: one(learningPaths, { fields: [learningPathProgress.learningPathId], references: [learningPaths.id] }),
  currentCourse: one(courses, { fields: [learningPathProgress.currentCourseId], references: [courses.id] }),
}));

export const instructorsRelations = relations(instructors, ({ one, many }) => ({
  user: one(userProfiles, { fields: [instructors.userId], references: [userProfiles.id] }),
  courseAssignments: many(courseInstructors),
  reviews: many(courseReviews),
}));

export const courseInstructorsRelations = relations(courseInstructors, ({ one }) => ({
  course: one(courses, { fields: [courseInstructors.courseId], references: [courses.id] }),
  instructor: one(instructors, { fields: [courseInstructors.instructorId], references: [instructors.id] }),
}));

export const courseReviewsRelations = relations(courseReviews, ({ one }) => ({
  course: one(courses, { fields: [courseReviews.courseId], references: [courses.id] }),
  student: one(students, { fields: [courseReviews.studentId], references: [students.id] }),
  instructor: one(instructors, { fields: [courseReviews.instructorId], references: [instructors.id] }),
  moderatedByUser: one(userProfiles, { fields: [courseReviews.moderatedBy], references: [userProfiles.id] }),
}));

// Insert schemas for LMS enhancement tables
export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModuleProgressSchema = createInsertSchema(moduleProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentQuestionSchema = createInsertSchema(assessmentQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  submittedAt: true,
});

export const insertCpdRecordSchema = createInsertSchema(cpdRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDigitalCertificateSchema = createInsertSchema(digitalCertificates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCertificateVerificationSchema = createInsertSchema(certificateVerifications).omit({
  id: true,
  verifiedAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningPathProgressSchema = createInsertSchema(learningPathProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInstructorSchema = createInsertSchema(instructors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseInstructorSchema = createInsertSchema(courseInstructors).omit({
  id: true,
  assignedAt: true,
  createdAt: true,
});

export const insertCourseReviewSchema = createInsertSchema(courseReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Additional Types for LMS Enhancement
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type CourseModule = typeof courseModules.$inferSelect;
export type InsertModuleProgress = z.infer<typeof insertModuleProgressSchema>;
export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type InsertAssessmentQuestion = z.infer<typeof insertAssessmentQuestionSchema>;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type InsertAssessmentResponse = z.infer<typeof insertAssessmentResponseSchema>;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertCpdRecord = z.infer<typeof insertCpdRecordSchema>;
export type CpdRecord = typeof cpdRecords.$inferSelect;
export type InsertDigitalCertificate = z.infer<typeof insertDigitalCertificateSchema>;
export type DigitalCertificate = typeof digitalCertificates.$inferSelect;
export type InsertCertificateVerification = z.infer<typeof insertCertificateVerificationSchema>;
export type CertificateVerification = typeof certificateVerifications.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPathProgress = z.infer<typeof insertLearningPathProgressSchema>;
export type LearningPathProgress = typeof learningPathProgress.$inferSelect;
export type InsertInstructor = z.infer<typeof insertInstructorSchema>;
export type Instructor = typeof instructors.$inferSelect;
export type InsertCourseInstructor = z.infer<typeof insertCourseInstructorSchema>;
export type CourseInstructor = typeof courseInstructors.$inferSelect;
export type InsertCourseReview = z.infer<typeof insertCourseReviewSchema>;
export type CourseReview = typeof courseReviews.$inferSelect;
