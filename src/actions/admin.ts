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

export async function getTenants() {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: tenants };
  } catch (error: any) {
    console.error("Failed to fetch tenants:", error);
    return { error: "Failed to fetch tenants." };
  }
}

export async function getLicenses() {
  try {
    const licenses = await prisma.licenseKey.findMany({
      include: { tenant: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: licenses };
  } catch (error: any) {
    console.error("Failed to fetch licenses:", error);
    return { error: "Failed to fetch licenses." };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: { tenant: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: users };
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    return { error: "Failed to fetch users." };
  }
}

// -----------------------------------------------------------------------------
// SYSTEM CONFIGURATION (SUPER ADMIN)
// -----------------------------------------------------------------------------

import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "src/data/system-settings.json");

export async function getSystemSettings() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      const defaultSettings = {
        smsProvider: "Fast2SMS",
        smsApiKey: "",
        smsSenderId: "SMSHTL",
        emailProvider: "SendGrid",
        emailApiKey: ""
      };
      const dir = path.dirname(SETTINGS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
      return { success: true, data: defaultSettings };
    }
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return { success: true, data: JSON.parse(raw) };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch settings." };
  }
}

export async function saveSystemSettings(data: any) {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
    revalidatePath("/admin/settings");
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to save settings." };
  }
}
