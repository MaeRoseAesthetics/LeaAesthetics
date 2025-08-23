import { eq, desc, and, or } from 'drizzle-orm';
import { db } from './supabase';
import {
  userProfiles,
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
  type UserProfile,
  type UpsertUserProfile,
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
} from '../shared/schema';

export class Storage {
  // User operations
  async getUser(id: string): Promise<UserProfile | undefined> {
    const [user] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUserProfile): Promise<UserProfile> {
    const [user] = await db
      .insert(userProfiles)
      .values(userData)
      .onConflictDoUpdate({
        target: userProfiles.id,
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
    return await db.select().from(bookings).where(eq(bookings.clientId, clientId));
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
    return await db.select().from(courseContent)
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
}

export const storage = new Storage();
