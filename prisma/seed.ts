import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // 1. Create a Super Admin
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@smshotel.com' },
    update: {},
    create: {
      email: 'admin@smshotel.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log(`Created Super Admin: ${superAdmin.email}`)

  // 2. Create a demo Tenant (Hotel)
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Grand Taj Hotel',
      subdomain: 'demo',
      status: 'ACTIVE',
    },
  })
  console.log(`Created Demo Hotel: ${tenant.name}`)

  // 3. Create a Hotel Manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@demo.com' },
    update: {},
    create: {
      email: 'manager@demo.com',
      name: 'Hotel Manager',
      password: hashedPassword,
      role: 'HOTEL_OWNER',
      tenantId: tenant.id,
    },
  })
  console.log(`Created Hotel Manager: ${manager.email}`)

  // 4. Create some Room Types
  const deluxeType = await prisma.roomType.create({
    data: {
      tenantId: tenant.id,
      name: 'Deluxe Room',
      basePrice: 4000,
      capacity: 2,
    }
  })

  // 5. Create some Rooms
  await prisma.room.createMany({
    data: [
      { tenantId: tenant.id, roomNumber: '101', roomTypeId: deluxeType.id, floor: '1st' },
      { tenantId: tenant.id, roomNumber: '105', roomTypeId: deluxeType.id, floor: '1st' },
      { tenantId: tenant.id, roomNumber: '106', roomTypeId: deluxeType.id, floor: '1st' },
    ]
  })
  console.log("Created Rooms and Room Types")

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
