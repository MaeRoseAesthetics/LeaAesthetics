import type { Express } from "express";
import { isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { 
  insertInventorySchema,
  insertEquipmentSchema,
  insertStockMovementSchema,
  insertMaintenanceRecordSchema,
  insertInventoryAlertSchema,
  insertSupplierSchema,
  insertPurchaseOrderSchema,
  insertPurchaseOrderItemSchema,
  type Inventory,
  type Equipment,
  type StockMovement,
  type MaintenanceRecord,
  type InventoryAlert,
  type Supplier,
  type PurchaseOrder
} from "@shared/schema";

export function registerInventoryRoutes(app: Express) {
  // ============ INVENTORY MANAGEMENT ROUTES ============

  // Create inventory item
  app.post("/api/inventory", isAuthenticated, async (req, res) => {
    try {
      const inventoryData = insertInventorySchema.parse(req.body);
      const inventory = await storage.createInventory(inventoryData);
      
      // Create initial stock movement if quantity > 0
      if (inventoryData.quantity && inventoryData.quantity > 0) {
        await storage.createStockMovement({
          inventoryId: inventory.id,
          movementType: "in",
          quantity: inventoryData.quantity,
          previousQuantity: 0,
          newQuantity: inventoryData.quantity,
          reason: "initial_stock",
          userId: (req as any).user.claims.sub,
          cost: inventoryData.unitCost ? Number(inventoryData.unitCost) * inventoryData.quantity : undefined,
          notes: "Initial stock entry"
        });
      }

      res.json(inventory);
    } catch (error) {
      res.status(400).json({ message: "Failed to create inventory item", error });
    }
  });

  // Get all inventory items with stock alerts
  app.get("/api/inventory", isAuthenticated, async (req, res) => {
    try {
      const { category, location, lowStock, expired } = req.query;
      
      let inventory = await storage.getAllInventory();
      
      // Filter by category
      if (category && category !== 'all') {
        inventory = inventory.filter(item => item.category === category);
      }
      
      // Filter by location
      if (location && location !== 'all') {
        inventory = inventory.filter(item => item.location === location);
      }
      
      // Filter by low stock
      if (lowStock === 'true') {
        inventory = inventory.filter(item => 
          item.quantity <= (item.minStockLevel || 0)
        );
      }
      
      // Filter by expired items
      if (expired === 'true') {
        const now = new Date();
        inventory = inventory.filter(item => 
          item.expiryDate && new Date(item.expiryDate) <= now
        );
      }
      
      // Add stock status to each item
      const inventoryWithStatus = inventory.map(item => ({
        ...item,
        stockStatus: item.quantity <= (item.minStockLevel || 0) ? 'low' : 
                    item.quantity === 0 ? 'out' : 'normal',
        isExpired: item.expiryDate ? new Date(item.expiryDate) <= new Date() : false,
        daysToExpiry: item.expiryDate ? Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
      }));
      
      res.json(inventoryWithStatus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory", error });
    }
  });

  // Get single inventory item with stock history
  app.get("/api/inventory/:id", isAuthenticated, async (req, res) => {
    try {
      const inventory = await storage.getInventory(req.params.id);
      if (!inventory) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      const stockMovements = await storage.getStockMovementsByInventory(req.params.id);
      
      res.json({
        ...inventory,
        stockHistory: stockMovements,
        stockStatus: inventory.quantity <= (inventory.minStockLevel || 0) ? 'low' : 
                    inventory.quantity === 0 ? 'out' : 'normal',
        isExpired: inventory.expiryDate ? new Date(inventory.expiryDate) <= new Date() : false
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory item", error });
    }
  });

  // Update inventory item
  app.put("/api/inventory/:id", isAuthenticated, async (req, res) => {
    try {
      const currentInventory = await storage.getInventory(req.params.id);
      if (!currentInventory) {
        return res.status(404).json({ message: "Inventory item not found" });
      }

      const updateData = insertInventorySchema.partial().parse(req.body);
      const updatedInventory = await storage.updateInventory(req.params.id, updateData);
      
      // If quantity changed, record stock movement
      if (updateData.quantity !== undefined && updateData.quantity !== currentInventory.quantity) {
        const movementType = updateData.quantity > currentInventory.quantity ? 'in' : 'out';
        const quantityChange = Math.abs(updateData.quantity - currentInventory.quantity);
        
        await storage.createStockMovement({
          inventoryId: req.params.id,
          movementType: movementType === 'in' ? 'adjustment' : 'adjustment',
          quantity: quantityChange,
          previousQuantity: currentInventory.quantity,
          newQuantity: updateData.quantity,
          reason: 'manual_adjustment',
          userId: (req as any).user.claims.sub,
          notes: req.body.adjustmentNote || 'Manual quantity adjustment'
        });
      }

      res.json(updatedInventory);
    } catch (error) {
      res.status(400).json({ message: "Failed to update inventory item", error });
    }
  });

  // Delete inventory item
  app.delete("/api/inventory/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteInventory(req.params.id);
      res.json({ message: "Inventory item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item", error });
    }
  });

  // ============ STOCK MOVEMENT ROUTES ============

  // Record stock movement (used for treatments, sales, etc.)
  app.post("/api/inventory/:id/movement", isAuthenticated, async (req, res) => {
    try {
      const inventory = await storage.getInventory(req.params.id);
      if (!inventory) {
        return res.status(404).json({ message: "Inventory item not found" });
      }

      const { movementType, quantity, reason, reference, notes } = req.body;
      
      if (!movementType || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Movement type and positive quantity are required" });
      }

      const newQuantity = movementType === 'in' ? 
        inventory.quantity + quantity : 
        inventory.quantity - quantity;

      if (newQuantity < 0) {
        return res.status(400).json({ message: "Insufficient stock quantity" });
      }

      // Create stock movement record
      const stockMovement = await storage.createStockMovement({
        inventoryId: req.params.id,
        movementType,
        quantity,
        previousQuantity: inventory.quantity,
        newQuantity,
        reason,
        reference,
        userId: (req as any).user.claims.sub,
        notes
      });

      // Update inventory quantity
      await storage.updateInventory(req.params.id, { quantity: newQuantity });

      // Check for low stock alert
      if (newQuantity <= (inventory.minStockLevel || 0)) {
        await storage.createInventoryAlert({
          inventoryId: req.params.id,
          alertType: 'low_stock',
          severity: newQuantity === 0 ? 'critical' : 'high',
          message: `${inventory.name} is ${newQuantity === 0 ? 'out of stock' : 'running low'} (${newQuantity} remaining)`,
          actionRequired: 'reorder'
        });
      }

      res.json(stockMovement);
    } catch (error) {
      res.status(400).json({ message: "Failed to record stock movement", error });
    }
  });

  // Get stock movements for an inventory item
  app.get("/api/inventory/:id/movements", isAuthenticated, async (req, res) => {
    try {
      const movements = await storage.getStockMovementsByInventory(req.params.id);
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock movements", error });
    }
  });

  // ============ EQUIPMENT MANAGEMENT ROUTES ============

  // Create equipment
  app.post("/api/equipment", isAuthenticated, async (req, res) => {
    try {
      const equipmentData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(equipmentData);
      res.json(equipment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create equipment", error });
    }
  });

  // Get all equipment with maintenance status
  app.get("/api/equipment", isAuthenticated, async (req, res) => {
    try {
      const { status, location, maintenanceDue } = req.query;
      
      let equipment = await storage.getAllEquipment();
      
      // Filter by status
      if (status && status !== 'all') {
        equipment = equipment.filter(item => item.status === status);
      }
      
      // Filter by location
      if (location && location !== 'all') {
        equipment = equipment.filter(item => item.location === location);
      }
      
      // Filter by maintenance due
      if (maintenanceDue === 'true') {
        const now = new Date();
        equipment = equipment.filter(item => 
          item.nextServiceDate && new Date(item.nextServiceDate) <= now
        );
      }
      
      // Add maintenance status to each item
      const equipmentWithStatus = equipment.map(item => {
        const now = new Date();
        const maintenanceOverdue = item.nextServiceDate && new Date(item.nextServiceDate) < now;
        const maintenanceDueSoon = item.nextServiceDate && 
          new Date(item.nextServiceDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return {
          ...item,
          maintenanceStatus: maintenanceOverdue ? 'overdue' : 
                           maintenanceDueSoon ? 'due_soon' : 'up_to_date',
          daysToMaintenance: item.nextServiceDate ? 
            Math.ceil((new Date(item.nextServiceDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
        };
      });
      
      res.json(equipmentWithStatus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment", error });
    }
  });

  // Get single equipment with maintenance history
  app.get("/api/equipment/:id", isAuthenticated, async (req, res) => {
    try {
      const equipment = await storage.getEquipment(req.params.id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      const maintenanceHistory = await storage.getMaintenanceRecordsByEquipment(req.params.id);
      
      res.json({
        ...equipment,
        maintenanceHistory
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment", error });
    }
  });

  // Update equipment
  app.put("/api/equipment/:id", isAuthenticated, async (req, res) => {
    try {
      const updateData = insertEquipmentSchema.partial().parse(req.body);
      const updatedEquipment = await storage.updateEquipment(req.params.id, updateData);
      
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.json(updatedEquipment);
    } catch (error) {
      res.status(400).json({ message: "Failed to update equipment", error });
    }
  });

  // ============ MAINTENANCE ROUTES ============

  // Schedule maintenance
  app.post("/api/equipment/:id/maintenance", isAuthenticated, async (req, res) => {
    try {
      const equipment = await storage.getEquipment(req.params.id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      const maintenanceData = insertMaintenanceRecordSchema.parse({
        ...req.body,
        equipmentId: req.params.id
      });
      
      const maintenance = await storage.createMaintenanceRecord(maintenanceData);
      
      // Create alert for scheduled maintenance
      await storage.createInventoryAlert({
        equipmentId: req.params.id,
        alertType: 'maintenance_due',
        severity: 'medium',
        message: `${equipment.name} has scheduled ${maintenanceData.maintenanceType} maintenance`,
        actionRequired: 'schedule_maintenance'
      });
      
      res.json(maintenance);
    } catch (error) {
      res.status(400).json({ message: "Failed to schedule maintenance", error });
    }
  });

  // Complete maintenance
  app.put("/api/maintenance/:id/complete", isAuthenticated, async (req, res) => {
    try {
      const { completedDate, issuesFound, actionsPerformed, cost, nextServiceDate } = req.body;
      
      const maintenance = await storage.updateMaintenanceRecord(req.params.id, {
        status: 'completed',
        completedDate: new Date(completedDate),
        issuesFound,
        actionsPerformed,
        cost,
        nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined
      });

      if (!maintenance) {
        return res.status(404).json({ message: "Maintenance record not found" });
      }

      // Update equipment maintenance dates
      if (maintenance.equipmentId) {
        await storage.updateEquipment(maintenance.equipmentId, {
          lastServiceDate: new Date(completedDate),
          nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
          status: 'operational'
        });
      }

      res.json(maintenance);
    } catch (error) {
      res.status(400).json({ message: "Failed to complete maintenance", error });
    }
  });

  // Get maintenance records
  app.get("/api/maintenance", isAuthenticated, async (req, res) => {
    try {
      const { status, equipmentId, maintenanceType } = req.query;
      
      let maintenance = await storage.getAllMaintenanceRecords();
      
      if (status && status !== 'all') {
        maintenance = maintenance.filter(record => record.status === status);
      }
      
      if (equipmentId) {
        maintenance = maintenance.filter(record => record.equipmentId === equipmentId);
      }
      
      if (maintenanceType && maintenanceType !== 'all') {
        maintenance = maintenance.filter(record => record.maintenanceType === maintenanceType);
      }
      
      res.json(maintenance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance records", error });
    }
  });

  // ============ ALERTS AND NOTIFICATIONS ============

  // Get all alerts
  app.get("/api/alerts", isAuthenticated, async (req, res) => {
    try {
      const { alertType, severity, unreadOnly } = req.query;
      
      let alerts = await storage.getAllInventoryAlerts();
      
      if (alertType && alertType !== 'all') {
        alerts = alerts.filter(alert => alert.alertType === alertType);
      }
      
      if (severity && severity !== 'all') {
        alerts = alerts.filter(alert => alert.severity === severity);
      }
      
      if (unreadOnly === 'true') {
        alerts = alerts.filter(alert => !alert.isRead);
      }
      
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts", error });
    }
  });

  // Mark alert as read
  app.put("/api/alerts/:id/read", isAuthenticated, async (req, res) => {
    try {
      const alert = await storage.updateInventoryAlert(req.params.id, { isRead: true });
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Failed to mark alert as read", error });
    }
  });

  // Dismiss alert
  app.put("/api/alerts/:id/dismiss", isAuthenticated, async (req, res) => {
    try {
      const alert = await storage.updateInventoryAlert(req.params.id, { isDismissed: true });
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Failed to dismiss alert", error });
    }
  });

  // ============ SUPPLIERS AND PURCHASING ============

  // Create supplier
  app.post("/api/suppliers", isAuthenticated, async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Failed to create supplier", error });
    }
  });

  // Get all suppliers
  app.get("/api/suppliers", isAuthenticated, async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers", error });
    }
  });

  // Create purchase order
  app.post("/api/purchase-orders", isAuthenticated, async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      
      // Generate order number
      const orderNumber = `PO-${Date.now()}`;
      
      const purchaseOrderData = insertPurchaseOrderSchema.parse({
        ...orderData,
        orderNumber,
        createdBy: (req as any).user.claims.sub
      });
      
      const purchaseOrder = await storage.createPurchaseOrder(purchaseOrderData);
      
      // Add items to purchase order
      if (items && items.length > 0) {
        for (const item of items) {
          await storage.createPurchaseOrderItem({
            ...item,
            purchaseOrderId: purchaseOrder.id
          });
        }
      }
      
      res.json(purchaseOrder);
    } catch (error) {
      res.status(400).json({ message: "Failed to create purchase order", error });
    }
  });

  // Get purchase orders
  app.get("/api/purchase-orders", isAuthenticated, async (req, res) => {
    try {
      const { status, supplierId } = req.query;
      
      let orders = await storage.getAllPurchaseOrders();
      
      if (status && status !== 'all') {
        orders = orders.filter(order => order.status === status);
      }
      
      if (supplierId) {
        orders = orders.filter(order => order.supplierId === supplierId);
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchase orders", error });
    }
  });

  // ============ REPORTING AND ANALYTICS ============

  // Get inventory summary
  app.get("/api/inventory/summary", isAuthenticated, async (req, res) => {
    try {
      const inventory = await storage.getAllInventory();
      
      const summary = {
        totalItems: inventory.length,
        totalValue: inventory.reduce((sum, item) => sum + (Number(item.unitCost || 0) * item.quantity), 0),
        lowStockItems: inventory.filter(item => item.quantity <= (item.minStockLevel || 0)).length,
        expiredItems: inventory.filter(item => 
          item.expiryDate && new Date(item.expiryDate) <= new Date()
        ).length,
        categorySummary: inventory.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        locationSummary: inventory.reduce((acc, item) => {
          const location = item.location || 'Unknown';
          acc[location] = (acc[location] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate inventory summary", error });
    }
  });

  // Get equipment summary
  app.get("/api/equipment/summary", isAuthenticated, async (req, res) => {
    try {
      const equipment = await storage.getAllEquipment();
      const now = new Date();
      
      const summary = {
        totalEquipment: equipment.length,
        operationalCount: equipment.filter(item => item.status === 'operational').length,
        maintenanceCount: equipment.filter(item => item.status === 'maintenance').length,
        repairCount: equipment.filter(item => item.status === 'repair').length,
        maintenanceDueCount: equipment.filter(item => 
          item.nextServiceDate && new Date(item.nextServiceDate) <= now
        ).length,
        statusSummary: equipment.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        locationSummary: equipment.reduce((acc, item) => {
          const location = item.location || 'Unknown';
          acc[location] = (acc[location] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate equipment summary", error });
    }
  });
}
