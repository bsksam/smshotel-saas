"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Get available rooms for a given tenant
 */
export async function getAvailableRooms(tenantId: string) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        tenantId,
        status: "AVAILABLE",
        isClean: true,
      },
      include: {
        roomType: true,
      },
    });
    return { success: true, data: rooms };
  } catch (error: any) {
    console.error("Failed to fetch available rooms:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle Guest Check-in
 */
export async function createCheckIn(data: {
  tenantId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  roomId: string;
  checkInDate: string;
  expectedCheckOut: string;
  adults: number;
  children: number;
  advancePayment: number;
}) {
  try {
    // We use a transaction because we need to:
    // 1. Create/Find the Guest
    // 2. Create the Reservation
    // 3. Update the Room status to OCCUPIED

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find or create guest
      let guest = await tx.guest.findFirst({
        where: {
          tenantId: data.tenantId,
          phone: data.guestPhone,
        },
      });

      if (!guest) {
        guest = await tx.guest.create({
          data: {
            tenantId: data.tenantId,
            fullName: data.guestName,
            phone: data.guestPhone,
            email: data.guestEmail,
          },
        });
      }

      // 2. Create Reservation
      const reservation = await tx.reservation.create({
        data: {
          tenantId: data.tenantId,
          guestId: guest.id,
          roomId: data.roomId,
          checkInDate: new Date(data.checkInDate),
          expectedCheckOut: new Date(data.expectedCheckOut),
          status: "CHECKED_IN",
          adults: data.adults,
          children: data.children,
          advancePayment: data.advancePayment,
        },
      });

      // 3. Update Room
      await tx.room.update({
        where: { id: data.roomId },
        data: { status: "OCCUPIED" },
      });

      return reservation;
    });

    revalidatePath("/dashboard");
    revalidatePath("/rooms");
    revalidatePath("/reservations");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Check-in failed:", error);
    return { success: false, error: error.message };
  }
}
