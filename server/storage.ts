import {
  users,
  clients,
  students,
  treatments,
  courses,
  bookings,
  enrollments,
  consentForms,
  payments,
  courseContent,
  assessments,
  inventory,
  equipment,
  stockMovements,
  maintenanceRecords,
  inventoryAlerts,
  suppliers,
  purchaseOrders,
  purchaseOrderItems,
  type User,
  type UpsertUser,
  type InsertClient,
  type Client,
  type InsertStudent,
  type Student,
  type InsertTreatment,
  type Treatment,
  type InsertCourse,
  type Course,
  type InsertBooking,
  type Booking,
  type InsertEnrollment,
  type Enrollment,
  type InsertConsentForm,
  type ConsentForm,
  type InsertPayment,
  type Payment,
  type InsertCourseContent,
  type CourseContent,
  type InsertAssessment,
  type Assessment,
  type InsertInventory,
  type Inventory,
  type InsertEquipment,
  type Equipment,
  type InsertStockMovement,
  type StockMovement,
  type InsertMaintenanceRecord,
  type MaintenanceRecord,
  type InsertInventoryAlert,
  type InventoryAlert,
  type InsertSupplier,
  type Supplier,
  type InsertPurchaseOrder,
  type PurchaseOrder,
  type InsertPurchaseOrderItem,
  type PurchaseOrderItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Client operations
  createClient(client: InsertClient): Promise<Client>;
  getClient(id: string): Promise<Client | undefined>;
  getClientsByUser(userId: string): Promise<Client[]>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Student operations
  createStudent(student: InsertStudent): Promise<Student>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudentsByUser(userId: string): Promise<Student[]>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined>;
  
  // Treatment operations
  createTreatment(treatment: InsertTreatment): Promise<Treatment>;
  getTreatment(id: string): Promise<Treatment | undefined>;
  getAllTreatments(): Promise<Treatment[]>;
  updateTreatment(id: string, treatment: Partial<InsertTreatment>): Promise<Treatment | undefined>;
  
  // Course operations
  createCourse(course: InsertCourse): Promise<Course>;
  getCourse(id: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByClient(clientId: string): Promise<Booking[]>;
  getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  
  // Enrollment operations
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollment(id: string): Promise<Enrollment | undefined>;
  getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]>;
  updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  
  // Consent form operations
  createConsentForm(form: InsertConsentForm): Promise<ConsentForm>;
  getConsentForm(id: string): Promise<ConsentForm | undefined>;
  getConsentFormsByClient(clientId: string): Promise<ConsentForm[]>;
  updateConsentForm(id: string, form: Partial<InsertConsentForm>): Promise<ConsentForm | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByClient(clientId: string): Promise<Payment[]>;
  getPaymentsByStudent(studentId: string): Promise<Payment[]>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  
  // Course content operations
  createCourseContent(content: InsertCourseContent): Promise<CourseContent>;
  getCourseContent(id: string): Promise<CourseContent | undefined>;
  getCourseContentByCourse(courseId: string): Promise<CourseContent[]>;
  updateCourseContent(id: string, content: Partial<InsertCourseContent>): Promise<CourseContent | undefined>;
  
  // Assessment operations
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByStudent(studentId: string): Promise<Assessment[]>;
  getAssessmentsByCourse(courseId: string): Promise<Assessment[]>;
  updateAssessment(id: string, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  
  // Inventory operations
  createInventory(inventory: InsertInventory): Promise<Inventory>;
  getInventory(id: string): Promise<Inventory | undefined>;
  getAllInventory(): Promise<Inventory[]>;
  updateInventory(id: string, inventory: Partial<InsertInventory>): Promise<Inventory | undefined>;
  deleteInventory(id: string): Promise<void>;
  
  // Equipment operations
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  getEquipment(id: string): Promise<Equipment | undefined>;
  getAllEquipment(): Promise<Equipment[]>;
  updateEquipment(id: string, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  
  // Stock movement operations
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  getStockMovementsByInventory(inventoryId: string): Promise<StockMovement[]>;
  
  // Maintenance record operations
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  getMaintenanceRecordsByEquipment(equipmentId: string): Promise<MaintenanceRecord[]>;
  getAllMaintenanceRecords(): Promise<MaintenanceRecord[]>;
  updateMaintenanceRecord(id: string, record: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined>;
  
  // Inventory alert operations
  createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert>;
  getAllInventoryAlerts(): Promise<InventoryAlert[]>;
  updateInventoryAlert(id: string, alert: Partial<InsertInventoryAlert>): Promise<InventoryAlert | undefined>;
  
  // Supplier operations
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  getAllSuppliers(): Promise<Supplier[]>;
  
  // Purchase order operations
  createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder>;
  getAllPurchaseOrders(): Promise<PurchaseOrder[]>;
  createPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Client operations
  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClientsByUser(userId: string): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId));
  }

  async updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updated;
  }

  // Student operations
  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentsByUser(userId: string): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.userId, userId));
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const [updated] = await db
      .update(students)
      .set({ ...student, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return updated;
  }

  // Treatment operations
  async createTreatment(treatment: InsertTreatment): Promise<Treatment> {
    const [newTreatment] = await db.insert(treatments).values(treatment).returning();
    return newTreatment;
  }

  async getTreatment(id: string): Promise<Treatment | undefined> {
    const [treatment] = await db.select().from(treatments).where(eq(treatments.id, id));
    return treatment;
  }

  async getAllTreatments(): Promise<Treatment[]> {
    return await db.select().from(treatments).where(eq(treatments.active, true));
  }

  async updateTreatment(id: string, treatment: Partial<InsertTreatment>): Promise<Treatment | undefined> {
    const [updated] = await db
      .update(treatments)
      .set({ ...treatment, updatedAt: new Date() })
      .where(eq(treatments.id, id))
      .returning();
    return updated;
  }

  // Course operations
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.active, true));
  }

  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updated] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updated;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByClient(clientId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.clientId, clientId))
      .orderBy(desc(bookings.scheduledDate));
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.scheduledDate, startDate),
          eq(bookings.scheduledDate, endDate)
        )
      )
      .orderBy(bookings.scheduledDate);
  }

  async updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [updated] = await db
      .update(bookings)
      .set({ ...booking, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updated;
  }

  // Enrollment operations
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return enrollment;
  }

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
  }

  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
  }

  async updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [updated] = await db
      .update(enrollments)
      .set({ ...enrollment, updatedAt: new Date() })
      .where(eq(enrollments.id, id))
      .returning();
    return updated;
  }

  // Consent form operations
  async createConsentForm(form: InsertConsentForm): Promise<ConsentForm> {
    const [newForm] = await db.insert(consentForms).values(form).returning();
    return newForm;
  }

  async getConsentForm(id: string): Promise<ConsentForm | undefined> {
    const [form] = await db.select().from(consentForms).where(eq(consentForms.id, id));
    return form;
  }

  async getConsentFormsByClient(clientId: string): Promise<ConsentForm[]> {
    return await db.select().from(consentForms).where(eq(consentForms.clientId, clientId));
  }

  async updateConsentForm(id: string, form: Partial<InsertConsentForm>): Promise<ConsentForm | undefined> {
    const [updated] = await db
      .update(consentForms)
      .set({ ...form, updatedAt: new Date() })
      .where(eq(consentForms.id, id))
      .returning();
    return updated;
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByClient(clientId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.clientId, clientId));
  }

  async getPaymentsByStudent(studentId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.studentId, studentId));
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updated] = await db
      .update(payments)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updated;
  }

  // Course content operations
  async createCourseContent(content: InsertCourseContent): Promise<CourseContent> {
    const [newContent] = await db.insert(courseContent).values(content).returning();
    return newContent;
  }

  async getCourseContent(id: string): Promise<CourseContent | undefined> {
    const [content] = await db.select().from(courseContent).where(eq(courseContent.id, id));
    return content;
  }

  async getCourseContentByCourse(courseId: string): Promise<CourseContent[]> {
    return await db
      .select()
      .from(courseContent)
      .where(eq(courseContent.courseId, courseId))
      .orderBy(courseContent.orderIndex);
  }

  async updateCourseContent(id: string, content: Partial<InsertCourseContent>): Promise<CourseContent | undefined> {
    const [updated] = await db
      .update(courseContent)
      .set({ ...content, updatedAt: new Date() })
      .where(eq(courseContent.id, id))
      .returning();
    return updated;
  }

  // Assessment operations
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }

  async getAssessmentsByStudent(studentId: string): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.studentId, studentId));
  }

  async getAssessmentsByCourse(courseId: string): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.courseId, courseId));
  }

  async updateAssessment(id: string, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const [updated] = await db
      .update(assessments)
      .set({ ...assessment, updatedAt: new Date() })
      .where(eq(assessments.id, id))
      .returning();
    return updated;
  }

  // Inventory operations
  async createInventory(inventoryData: InsertInventory): Promise<Inventory> {
    const [newInventory] = await db.insert(inventory).values(inventoryData).returning();
    return newInventory;
  }

  async getInventory(id: string): Promise<Inventory | undefined> {
    const [inventoryItem] = await db.select().from(inventory).where(eq(inventory.id, id));
    return inventoryItem;
  }

  async getAllInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory).where(eq(inventory.active, true));
  }

  async updateInventory(id: string, inventoryData: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const [updated] = await db
      .update(inventory)
      .set({ ...inventoryData, updatedAt: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return updated;
  }

  async deleteInventory(id: string): Promise<void> {
    await db.update(inventory).set({ active: false }).where(eq(inventory.id, id));
  }

  // Equipment operations
  async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
    const [newEquipment] = await db.insert(equipment).values(equipmentData).returning();
    return newEquipment;
  }

  async getEquipment(id: string): Promise<Equipment | undefined> {
    const [equipmentItem] = await db.select().from(equipment).where(eq(equipment.id, id));
    return equipmentItem;
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment).where(eq(equipment.active, true));
  }

  async updateEquipment(id: string, equipmentData: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const [updated] = await db
      .update(equipment)
      .set({ ...equipmentData, updatedAt: new Date() })
      .where(eq(equipment.id, id))
      .returning();
    return updated;
  }

  // Stock movement operations
  async createStockMovement(movementData: InsertStockMovement): Promise<StockMovement> {
    const [newMovement] = await db.insert(stockMovements).values(movementData).returning();
    return newMovement;
  }

  async getStockMovementsByInventory(inventoryId: string): Promise<StockMovement[]> {
    return await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.inventoryId, inventoryId))
      .orderBy(desc(stockMovements.createdAt));
  }

  // Maintenance record operations
  async createMaintenanceRecord(recordData: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const [newRecord] = await db.insert(maintenanceRecords).values(recordData).returning();
    return newRecord;
  }

  async getMaintenanceRecordsByEquipment(equipmentId: string): Promise<MaintenanceRecord[]> {
    return await db
      .select()
      .from(maintenanceRecords)
      .where(eq(maintenanceRecords.equipmentId, equipmentId))
      .orderBy(desc(maintenanceRecords.createdAt));
  }

  async getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    return await db.select().from(maintenanceRecords).orderBy(desc(maintenanceRecords.createdAt));
  }

  async updateMaintenanceRecord(id: string, recordData: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const [updated] = await db
      .update(maintenanceRecords)
      .set({ ...recordData, updatedAt: new Date() })
      .where(eq(maintenanceRecords.id, id))
      .returning();
    return updated;
  }

  // Inventory alert operations
  async createInventoryAlert(alertData: InsertInventoryAlert): Promise<InventoryAlert> {
    const [newAlert] = await db.insert(inventoryAlerts).values(alertData).returning();
    return newAlert;
  }

  async getAllInventoryAlerts(): Promise<InventoryAlert[]> {
    return await db
      .select()
      .from(inventoryAlerts)
      .where(eq(inventoryAlerts.isDismissed, false))
      .orderBy(desc(inventoryAlerts.createdAt));
  }

  async updateInventoryAlert(id: string, alertData: Partial<InsertInventoryAlert>): Promise<InventoryAlert | undefined> {
    const [updated] = await db
      .update(inventoryAlerts)
      .set(alertData)
      .where(eq(inventoryAlerts.id, id))
      .returning();
    return updated;
  }

  // Supplier operations
  async createSupplier(supplierData: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplierData).returning();
    return newSupplier;
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.active, true));
  }

  // Purchase order operations
  async createPurchaseOrder(orderData: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const [newOrder] = await db.insert(purchaseOrders).values(orderData).returning();
    return newOrder;
  }

  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    return await db.select().from(purchaseOrders).orderBy(desc(purchaseOrders.createdAt));
  }

  async createPurchaseOrderItem(itemData: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> {
    const [newItem] = await db.insert(purchaseOrderItems).values(itemData).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
