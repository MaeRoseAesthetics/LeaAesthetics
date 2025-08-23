import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertClientSchema,
  insertStudentSchema, 
  insertTreatmentSchema,
  insertCourseSchema,
  insertBookingSchema,
  insertEnrollmentSchema,
  insertConsentFormSchema,
  insertPaymentSchema,
  insertCourseContentSchema,
  insertAssessmentSchema
} from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Client routes
  app.post("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const clientData = insertClientSchema.parse({
        ...req.body,
        userId: req.user.claims.sub
      });
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error) {
      res.status(400).json({ message: "Failed to create client", error });
    }
  });

  app.get("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clients = await storage.getClientsByUser(userId);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients", error });
    }
  });

  app.get("/api/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client", error });
    }
  });

  // Student routes
  app.post("/api/students", isAuthenticated, async (req: any, res) => {
    try {
      const studentData = insertStudentSchema.parse({
        ...req.body,
        userId: req.user.claims.sub
      });
      const student = await storage.createStudent(studentData);
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: "Failed to create student", error });
    }
  });

  app.get("/api/students", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const students = await storage.getStudentsByUser(userId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students", error });
    }
  });

  // Treatment routes
  app.post("/api/treatments", isAuthenticated, async (req, res) => {
    try {
      const treatmentData = insertTreatmentSchema.parse(req.body);
      const treatment = await storage.createTreatment(treatmentData);
      res.json(treatment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create treatment", error });
    }
  });

  app.get("/api/treatments", async (req, res) => {
    try {
      const treatments = await storage.getAllTreatments();
      res.json(treatments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch treatments", error });
    }
  });

  // Course routes
  app.post("/api/courses", isAuthenticated, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: "Failed to create course", error });
    }
  });

  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses", error });
    }
  });

  // Booking routes
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: "Failed to create booking", error });
    }
  });

  app.get("/api/bookings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Get all clients for this user and their bookings
      const clients = await storage.getClientsByUser(userId);
      let allBookings = [];
      
      for (const client of clients) {
        const bookings = await storage.getBookingsByClient(client.id);
        allBookings.push(...bookings);
      }
      
      res.json(allBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings", error });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", isAuthenticated, async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create enrollment", error });
    }
  });

  app.get("/api/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const students = await storage.getStudentsByUser(userId);
      let allEnrollments = [];
      
      for (const student of students) {
        const enrollments = await storage.getEnrollmentsByStudent(student.id);
        allEnrollments.push(...enrollments);
      }
      
      res.json(allEnrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments", error });
    }
  });

  // Consent form routes
  app.post("/api/consent-forms", isAuthenticated, async (req, res) => {
    try {
      const formData = insertConsentFormSchema.parse(req.body);
      const form = await storage.createConsentForm(formData);
      res.json(form);
    } catch (error) {
      res.status(400).json({ message: "Failed to create consent form", error });
    }
  });

  app.get("/api/consent-forms/:clientId", isAuthenticated, async (req, res) => {
    try {
      const forms = await storage.getConsentFormsByClient(req.params.clientId);
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consent forms", error });
    }
  });

  app.put("/api/consent-forms/:id/sign", isAuthenticated, async (req, res) => {
    try {
      const { signatureData } = req.body;
      const form = await storage.updateConsentForm(req.params.id, {
        signed: true,
        signedDate: new Date(),
        signatureData
      });
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Failed to sign consent form", error });
    }
  });

  // Payment routes - Stripe integration
  app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      const { amount, currency = "gbp", clientId, studentId, bookingId, enrollmentId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to pence
        currency,
        metadata: {
          clientId: clientId || '',
          studentId: studentId || '',
          bookingId: bookingId || '',
          enrollmentId: enrollmentId || ''
        }
      });

      // Create payment record
      const payment = await storage.createPayment({
        clientId,
        studentId,
        bookingId,
        enrollmentId,
        stripePaymentIntentId: paymentIntent.id,
        amount: amount.toString(),
        status: "pending"
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/payments/:id/verify-age", isAuthenticated, async (req, res) => {
    try {
      const payment = await storage.updatePayment(req.params.id, {
        ageVerified: true
      });
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify age", error });
    }
  });

  app.get("/api/payments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clients = await storage.getClientsByUser(userId);
      const students = await storage.getStudentsByUser(userId);
      
      let allPayments = [];
      
      for (const client of clients) {
        const payments = await storage.getPaymentsByClient(client.id);
        allPayments.push(...payments);
      }
      
      for (const student of students) {
        const payments = await storage.getPaymentsByStudent(student.id);
        allPayments.push(...payments);
      }
      
      res.json(allPayments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments", error });
    }
  });

  // Course content routes
  app.post("/api/course-content", isAuthenticated, async (req, res) => {
    try {
      const contentData = insertCourseContentSchema.parse(req.body);
      const content = await storage.createCourseContent(contentData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Failed to create course content", error });
    }
  });

  app.get("/api/course-content/:courseId", isAuthenticated, async (req, res) => {
    try {
      const content = await storage.getCourseContentByCourse(req.params.courseId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course content", error });
    }
  });

  // Assessment routes
  app.post("/api/assessments", isAuthenticated, async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(assessmentData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create assessment", error });
    }
  });

  app.get("/api/assessments/:studentId", isAuthenticated, async (req, res) => {
    try {
      const assessments = await storage.getAssessmentsByStudent(req.params.studentId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments", error });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clients = await storage.getClientsByUser(userId);
      const students = await storage.getStudentsByUser(userId);
      
      // Get today's bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      let todayBookings = 0;
      let monthlyRevenue = 0;
      
      for (const client of clients) {
        const bookings = await storage.getBookingsByClient(client.id);
        const todayClientBookings = bookings.filter(b => {
          const bookingDate = new Date(b.scheduledDate);
          return bookingDate >= today && bookingDate < tomorrow;
        });
        todayBookings += todayClientBookings.length;
        
        const payments = await storage.getPaymentsByClient(client.id);
        const monthlyPayments = payments.filter(p => {
          const paymentDate = new Date(p.createdAt!);
          return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
        });
        monthlyRevenue += monthlyPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      }

      res.json({
        todayAppointments: todayBookings,
        monthlyRevenue: `£${monthlyRevenue.toFixed(2)}`,
        activeStudents: students.length,
        complianceScore: "98%"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
