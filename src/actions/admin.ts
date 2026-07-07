"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function createTenant(data: FormData) {
  try {
    const name = data.get("name") as string;
    const domain = data.get("domain") as string;
    const adminEmail = data.get("adminEmail") as string;

    if (!name || !adminEmail) {
      return { error: "Name and Admin Email are required." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name,
          domain: domain || null,
        },
      });

      // 2. Create Default Hotel Owner for this Tenant
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = await tx.user.create({
        data: {
          name: "Hotel Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "HOTEL_OWNER",
          tenantId: tenant.id,
        },
      });

      return { tenant, user };
    });

    revalidatePath("/admin/hotels");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to create hotel:", error);
    return { error: error.message || "Failed to create hotel." };
  }
}

export async function generateLicense(data: FormData) {
  try {
    const tenantId = data.get("tenantId") as string;
    const validity = data.get("validity") as string;

    if (!tenantId || !validity) {
      return { error: "Tenant and Validity are required." };
    }

    // Generate random key segments
    const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const key = `${segment()}-${segment()}-${segment()}-${segment()}`;

    // Calculate expiry date
    let expiresAt = new Date();
    if (validity === "MONTHLY") expiresAt.setMonth(expiresAt.getMonth() + 1);
    if (validity === "QUARTERLY") expiresAt.setMonth(expiresAt.getMonth() + 3);
    if (validity === "HALF_YEARLY") expiresAt.setMonth(expiresAt.getMonth() + 6);
    if (validity === "YEARLY") expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    if (validity === "LIFETIME") expiresAt.setFullYear(expiresAt.getFullYear() + 100);

    const license = await prisma.licenseKey.create({
      data: {
        key,
        tenantId,
        validity: validity as any,
        expiresAt,
      },
    });

    revalidatePath("/admin/licenses");
    return { success: true, data: license };
  } catch (error: any) {
    console.error("Failed to generate license:", error);
    return { error: error.message || "Failed to generate license." };
  }
}

export async function createUser(data: FormData) {
  try {
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const email = data.get("email") as string;
    const role = data.get("role") as Role;
    const tenantId = data.get("tenantId") as string;

    if (!email || !role) {
      return { error: "Email and Role are required." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists with this email." };
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password: hashedPassword,
        role,
        tenantId: tenantId || null,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return { error: error.message || "Failed to create user." };
  }
}
