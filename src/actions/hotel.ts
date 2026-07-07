"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// Helper to get the current user's tenantId securely on the server
async function getTenantId() {
  const session = await auth();
  // @ts-ignore
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("Unauthorized: No tenant ID found in session");
  return tenantId;
}

// -----------------------------------------------------------------------------
// ROOM TYPES
// -----------------------------------------------------------------------------

export async function getRoomTypes() {
  try {
    const tenantId = await getTenantId();
    const roomTypes = await prisma.roomType.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: roomTypes };
  } catch (error: any) {
    console.error("Failed to fetch room types:", error);
    return { error: error.message || "Failed to fetch room types." };
  }
}

export async function createRoomType(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const basePrice = parseFloat(data.get("basePrice") as string);
    const capacity = parseInt(data.get("capacity") as string, 10);
    const amenities = data.get("amenities") as string;

    if (!name || isNaN(basePrice) || isNaN(capacity)) {
      return { error: "Name, Base Price, and Capacity are required." };
    }

    const roomType = await prisma.roomType.create({
      data: {
        name,
        description,
        basePrice,
        capacity,
        amenities,
        tenantId,
      },
    });

    revalidatePath("/rooms");
    return { success: true, data: roomType };
  } catch (error: any) {
    console.error("Failed to create room type:", error);
    return { error: error.message || "Failed to create room type." };
  }
}

// -----------------------------------------------------------------------------
// ROOMS
// -----------------------------------------------------------------------------

export async function getRooms() {
  try {
    const tenantId = await getTenantId();
    const rooms = await prisma.room.findMany({
      where: { tenantId },
      include: { roomType: true },
      orderBy: { number: "asc" },
    });
    return { success: true, data: rooms };
  } catch (error: any) {
    console.error("Failed to fetch rooms:", error);
    return { error: error.message || "Failed to fetch rooms." };
  }
}

export async function createRoom(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const number = data.get("number") as string;
    const roomTypeId = data.get("roomTypeId") as string;
    const floor = data.get("floor") as string;
    const status = data.get("status") as any;

    if (!number || !roomTypeId) {
      return { error: "Room Number and Room Type are required." };
    }

    const room = await prisma.room.create({
      data: {
        number,
        roomTypeId,
        floor,
        status,
        tenantId,
      },
    });

    revalidatePath("/rooms");
    return { success: true, data: room };
  } catch (error: any) {
    console.error("Failed to create room:", error);
    return { error: error.message || "Failed to create room." };
  }
}

// -----------------------------------------------------------------------------
// GUESTS
// -----------------------------------------------------------------------------

export async function getGuests() {
  try {
    const tenantId = await getTenantId();
    const guests = await prisma.guest.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: guests };
  } catch (error: any) {
    console.error("Failed to fetch guests:", error);
    return { error: error.message || "Failed to fetch guests." };
  }
}

export async function createGuest(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const mobile = data.get("mobile") as string;
    const email = data.get("email") as string;
    const idProofType = data.get("idProofType") as string;
    const idProofNumber = data.get("idProofNumber") as string;

    if (!firstName || !lastName || !mobile) {
      return { error: "First Name, Last Name, and Mobile are required." };
    }

    const guest = await prisma.guest.create({
      data: {
        firstName,
        lastName,
        mobile,
        email,
        idProofType,
        idProofNumber,
        tenantId,
      },
    });

    revalidatePath("/guests");
    return { success: true, data: guest };
  } catch (error: any) {
    console.error("Failed to create guest:", error);
    return { error: error.message || "Failed to create guest." };
  }
}

// -----------------------------------------------------------------------------
// RESERVATIONS
// -----------------------------------------------------------------------------

export async function getReservations() {
  try {
    const tenantId = await getTenantId();
    const reservations = await prisma.reservation.findMany({
      where: { tenantId },
      include: { guest: true, room: { include: { roomType: true } } },
      orderBy: { checkInDate: "desc" },
    });
    return { success: true, data: reservations };
  } catch (error: any) {
    console.error("Failed to fetch reservations:", error);
    return { error: error.message || "Failed to fetch reservations." };
  }
}

export async function createReservation(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const guestId = data.get("guestId") as string;
    const roomId = data.get("roomId") as string;
    const checkInDateStr = data.get("checkInDate") as string;
    const expectedCheckOutStr = data.get("expectedCheckOut") as string;
    const advancePayment = parseFloat(data.get("advancePayment") as string) || 0;
    const adults = parseInt(data.get("adults") as string) || 1;

    if (!guestId || !roomId || !checkInDateStr || !expectedCheckOutStr) {
      return { error: "Guest, Room, and Dates are required." };
    }

    const checkInDate = new Date(checkInDateStr);
    const expectedCheckOut = new Date(expectedCheckOutStr);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Reservation
      const reservation = await tx.reservation.create({
        data: {
          guestId,
          roomId,
          checkInDate,
          expectedCheckOut,
          advancePayment,
          adults,
          tenantId,
          status: "RESERVED",
        },
      });

      // 2. Mark room as RESERVED
      await tx.room.update({
        where: { id: roomId },
        data: { status: "RESERVED" },
      });

      return reservation;
    });

    revalidatePath("/reservations");
    revalidatePath("/rooms");
    revalidatePath("/front-desk/check-in");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to create reservation:", error);
    return { error: error.message || "Failed to create reservation." };
  }
}

// -----------------------------------------------------------------------------
// FRONT DESK OPERATIONS
// -----------------------------------------------------------------------------

export async function checkInGuest(reservationId: string) {
  try {
    const tenantId = await getTenantId();
    
    // Ensure reservation belongs to this tenant
    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId, tenantId },
      include: { room: true }
    });

    if (!reservation) {
      return { error: "Reservation not found." };
    }

    if (reservation.status !== "RESERVED") {
      return { error: "Only reservations in RESERVED status can be checked in." };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Reservation
      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: { status: "CHECKED_IN" }
      });

      // 2. Update Room status
      await tx.room.update({
        where: { id: reservation.roomId },
        data: { status: "OCCUPIED" }
      });

      return updatedReservation;
    });

    revalidatePath("/front-desk/check-in");
    revalidatePath("/reservations");
    revalidatePath("/rooms");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to check in guest:", error);
    return { error: error.message || "Failed to check in guest." };
  }
}

// -----------------------------------------------------------------------------
// DASHBOARD ANALYTICS
// -----------------------------------------------------------------------------

export async function getDashboardStats() {
  try {
    const tenantId = await getTenantId();

    const [totalRooms, availableRooms, activeGuests, recentBookings, todayCheckins] = await Promise.all([
      prisma.room.count({ where: { tenantId } }),
      prisma.room.count({ where: { tenantId, status: "AVAILABLE" } }),
      prisma.reservation.count({ where: { tenantId, status: "CHECKED_IN" } }),
      prisma.reservation.findMany({
        where: { tenantId },
        include: { guest: true, room: true },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      // Simple today check-ins count (ignoring complex timezone logic for MVP)
      prisma.reservation.count({ 
        where: { 
          tenantId, 
          checkInDate: {
            gte: new Date(new Date().setHours(0,0,0,0)),
            lt: new Date(new Date().setHours(23,59,59,999))
          }
        } 
      })
    ]);

    const occupancyRate = totalRooms === 0 ? 0 : Math.round(((totalRooms - availableRooms) / totalRooms) * 100);

    return {
      success: true,
      data: {
        totalRooms,
        availableRooms,
        activeGuests,
        todayCheckins,
        occupancyRate,
        recentBookings
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard stats:", error);
    return { error: error.message || "Failed to fetch dashboard stats." };
  }
}

// -----------------------------------------------------------------------------
// BILLING & INVOICING
// -----------------------------------------------------------------------------

export async function getCheckedInGuests() {
  try {
    const tenantId = await getTenantId();
    const reservations = await prisma.reservation.findMany({
      where: { tenantId, status: "CHECKED_IN" },
      include: { 
        guest: true, 
        room: { include: { roomType: true } } 
      },
      orderBy: { checkInDate: "asc" },
    });
    return { success: true, data: reservations };
  } catch (error: any) {
    console.error("Failed to fetch checked-in guests:", error);
    return { error: error.message || "Failed to fetch guests." };
  }
}

export async function generateInvoice(reservationId: string) {
  try {
    const tenantId = await getTenantId();
    
    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId, tenantId, status: "CHECKED_IN" },
      include: { guest: true, room: { include: { roomType: true } } }
    });

    if (!reservation) {
      return { error: "Valid checked-in reservation not found." };
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findFirst({
      where: { reservationId }
    });
    if (existingInvoice) {
      return { success: true, data: existingInvoice };
    }

    // Calculate nights stayed
    const checkIn = new Date(reservation.checkInDate);
    // Assume checkout is today for calculation if expectedCheckOut is in the past/future
    const checkOut = new Date(); 
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (nights === 0) nights = 1; // Minimum 1 night charge

    const basePrice = reservation.room.roomType.basePrice;
    const roomCharge = basePrice * nights;
    
    // Fixed 18% GST as per Phase 3 MVP assumption
    const subTotal = roomCharge;
    const gstAmount = subTotal * 0.18;
    const discount = reservation.advancePayment; // We treat advance as a credit/discount to remaining balance for simplicity, or we can just subtract it from total. Actually let's just make totalAmount = subtotal + gst. We will record advancePayment as an already paid amount.
    
    const totalAmount = subTotal + gstAmount;
    
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await prisma.invoice.create({
      data: {
        tenantId,
        invoiceNumber,
        reservationId: reservation.id,
        guestName: `${reservation.guest.firstName} ${reservation.guest.lastName}`,
        subTotal,
        gstAmount,
        discount: 0,
        totalAmount,
        paidAmount: reservation.advancePayment,
        status: reservation.advancePayment >= totalAmount ? "PAID" : "UNPAID",
      }
    });

    revalidatePath("/billing");
    return { success: true, data: invoice };
  } catch (error: any) {
    console.error("Failed to generate invoice:", error);
    return { error: error.message || "Failed to generate invoice." };
  }
}

export async function recordPayment(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const invoiceId = data.get("invoiceId") as string;
    const amount = parseFloat(data.get("amount") as string);
    const method = data.get("method") as any; // e.g. "CARD", "CASH", "UPI"

    if (!invoiceId || isNaN(amount) || !method) {
      return { error: "Invoice ID, Amount, and Method are required." };
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: { payments: true }
    });

    if (!invoice) return { error: "Invoice not found." };

    const result = await prisma.$transaction(async (tx) => {
      // Create payment
      await tx.payment.create({
        data: {
          invoiceId,
          amount,
          method
        }
      });

      // Update invoice
      const newPaidAmount = invoice.paidAmount + amount;
      const newStatus = newPaidAmount >= invoice.totalAmount ? "PAID" : "PARTIAL";

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: { 
          paidAmount: newPaidAmount,
          status: newStatus
        }
      });

      // If fully paid, check out the guest
      if (newStatus === "PAID" && invoice.reservationId) {
        const res = await tx.reservation.findUnique({ where: { id: invoice.reservationId } });
        if (res && res.status === "CHECKED_IN") {
          await tx.reservation.update({
            where: { id: res.id },
            data: { status: "CHECKED_OUT", actualCheckOut: new Date() }
          });
          
          await tx.room.update({
            where: { id: res.roomId },
            data: { status: "CLEANING" }
          });
        }
      }

      return updatedInvoice;
    });

    revalidatePath("/billing");
    revalidatePath("/front-desk/check-in");
    revalidatePath("/rooms");
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to record payment:", error);
    return { error: error.message || "Failed to record payment." };
  }
}

// -----------------------------------------------------------------------------
// HOUSEKEEPING
// -----------------------------------------------------------------------------

export async function getHousekeepingTasks() {
  try {
    const tenantId = await getTenantId();
    const tasks = await prisma.housekeepingTask.findMany({
      where: { tenantId },
      include: { room: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: tasks };
  } catch (error: any) {
    console.error("Failed to fetch tasks:", error);
    return { error: error.message || "Failed to fetch tasks." };
  }
}

export async function createHousekeepingTask(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const roomId = data.get("roomId") as string;
    const taskType = data.get("taskType") as string;
    const notes = data.get("notes") as string;

    if (!roomId || !taskType) {
      return { error: "Room ID and Task Type are required." };
    }

    const task = await prisma.housekeepingTask.create({
      data: {
        tenantId,
        roomId,
        taskType,
        notes,
        status: "PENDING"
      }
    });

    revalidatePath("/housekeeping");
    return { success: true, data: task };
  } catch (error: any) {
    console.error("Failed to create task:", error);
    return { error: error.message || "Failed to create task." };
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    const tenantId = await getTenantId();
    const updated = await prisma.housekeepingTask.update({
      where: { id: taskId, tenantId },
      data: { status: newStatus as any }
    });

    // If task is completed and it's a cleaning task, update the room to AVAILABLE
    if (newStatus === "COMPLETED" && updated.taskType === "CLEANING") {
      await prisma.room.update({
        where: { id: updated.roomId },
        data: { status: "AVAILABLE" }
      });
      revalidatePath("/rooms");
    }

    revalidatePath("/housekeeping");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Failed to update task:", error);
    return { error: error.message || "Failed to update task." };
  }
}

// -----------------------------------------------------------------------------
// EXPENSES
// -----------------------------------------------------------------------------

export async function getExpenses() {
  try {
    const tenantId = await getTenantId();
    const expenses = await prisma.expense.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { date: "desc" },
    });
    return { success: true, data: expenses };
  } catch (error: any) {
    console.error("Failed to fetch expenses:", error);
    return { error: error.message || "Failed to fetch expenses." };
  }
}

export async function getExpenseCategories() {
  try {
    const tenantId = await getTenantId();
    const categories = await prisma.expenseCategory.findMany({
      where: { tenantId },
      orderBy: { name: "asc" }
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch categories." };
  }
}

export async function addExpenseCategory(name: string) {
  try {
    const tenantId = await getTenantId();
    const category = await prisma.expenseCategory.create({
      data: { tenantId, name }
    });
    revalidatePath("/expenses");
    return { success: true, data: category };
  } catch (error: any) {
    return { error: error.message || "Failed to add category." };
  }
}

export async function addExpense(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const categoryId = data.get("categoryId") as string;
    const amount = parseFloat(data.get("amount") as string);
    const description = data.get("description") as string;
    const paymentMode = data.get("paymentMode") as any;

    if (!categoryId || isNaN(amount) || !paymentMode) {
      return { error: "Category, Amount, and Payment Mode are required." };
    }

    const expense = await prisma.expense.create({
      data: {
        tenantId,
        categoryId,
        amount,
        description,
        paymentMode
      }
    });

    revalidatePath("/expenses");
    return { success: true, data: expense };
  } catch (error: any) {
    console.error("Failed to add expense:", error);
    return { error: error.message || "Failed to add expense." };
  }
}

// -----------------------------------------------------------------------------
// RESTAURANT POS
// -----------------------------------------------------------------------------

export async function getMenuCategories() {
  try {
    const tenantId = await getTenantId();
    const categories = await prisma.menuCategory.findMany({
      where: { tenantId },
      include: { items: true },
      orderBy: { name: "asc" }
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch menu." };
  }
}

export async function addMenuCategory(name: string) {
  try {
    const tenantId = await getTenantId();
    const category = await prisma.menuCategory.create({
      data: { tenantId, name }
    });
    revalidatePath("/restaurant");
    return { success: true, data: category };
  } catch (error: any) {
    return { error: error.message || "Failed to add menu category." };
  }
}

export async function addMenuItem(data: FormData) {
  try {
    const tenantId = await getTenantId();
    const categoryId = data.get("categoryId") as string;
    const name = data.get("name") as string;
    const price = parseFloat(data.get("price") as string);
    const isVeg = data.get("isVeg") === "true";

    if (!categoryId || !name || isNaN(price)) {
      return { error: "Category, Name, and Price are required." };
    }

    const item = await prisma.menuItem.create({
      data: {
        tenantId,
        categoryId,
        name,
        price,
        isVeg
      }
    });

    revalidatePath("/restaurant");
    return { success: true, data: item };
  } catch (error: any) {
    return { error: error.message || "Failed to add menu item." };
  }
}

export async function getTables() {
  try {
    const tenantId = await getTenantId();
    const tables = await prisma.diningTable.findMany({
      where: { tenantId },
      orderBy: { name: "asc" }
    });
    return { success: true, data: tables };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch tables." };
  }
}

export async function addTable(name: string) {
  try {
    const tenantId = await getTenantId();
    const table = await prisma.diningTable.create({
      data: { tenantId, name }
    });
    revalidatePath("/restaurant");
    return { success: true, data: table };
  } catch (error: any) {
    return { error: error.message || "Failed to add table." };
  }
}

export async function createRestOrder(tableId: string) {
  try {
    const tenantId = await getTenantId();
    
    // Check if table is available
    const table = await prisma.diningTable.findFirst({
      where: { id: tableId, tenantId }
    });

    if (!table) return { error: "Table not found." };
    if (table.status !== "AVAILABLE") return { error: "Table is not available." };

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.restOrder.create({
        data: {
          tenantId,
          tableId,
          orderType: "DINE_IN",
          status: "KOT_PENDING"
        }
      });

      await tx.diningTable.update({
        where: { id: tableId },
        data: { status: "OCCUPIED" }
      });

      return order;
    });

    revalidatePath("/restaurant");
    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to create order." };
  }
}

export async function getActiveOrders() {
  try {
    const tenantId = await getTenantId();
    const orders = await prisma.restOrder.findMany({
      where: { tenantId, status: { not: "BILLED" } },
      include: { table: true, items: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: orders };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch active orders." };
  }
}

export async function addItemToOrder(orderId: string, menuItemId: string, quantity: number, price: number) {
  try {
    const tenantId = await getTenantId();
    
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.restOrderItem.create({
        data: {
          orderId,
          menuItemId,
          quantity,
          price,
          status: "PENDING"
        }
      });

      // Update order total
      const order = await tx.restOrder.findUnique({ where: { id: orderId } });
      if (order) {
        await tx.restOrder.update({
          where: { id: orderId },
          data: { totalAmount: order.totalAmount + (price * quantity) }
        });
      }
      return item;
    });

    revalidatePath("/restaurant");
    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to add item." };
  }
}

export async function billOrder(orderId: string) {
  try {
    const tenantId = await getTenantId();
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.restOrder.update({
        where: { id: orderId, tenantId },
        data: { status: "BILLED" }
      });
      
      if (order.tableId) {
        await tx.diningTable.update({
          where: { id: order.tableId },
          data: { status: "AVAILABLE" }
        });
      }
      return order;
    });

    revalidatePath("/restaurant");
    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to bill order." };
  }
}
