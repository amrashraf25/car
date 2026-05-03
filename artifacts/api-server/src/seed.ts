import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  usersTable,
  carsTable,
  packagesTable,
  ordersTable,
  workersTable,
} from "@workspace/db";
import { logger } from "./lib/logger.js";

export async function runSeed() {
  try {
    const existing = await db.select().from(usersTable).limit(1);
    if (existing.length > 0) return;

    logger.info("Running database seed...");

    const hash = await bcrypt.hash("password123", 10);

    const [customer1] = await db
      .insert(usersTable)
      .values({
        name: "Alex Carter",
        email: "customer@demo.com",
        passwordHash: hash,
        role: "customer",
      })
      .returning();

    const [customer2] = await db
      .insert(usersTable)
      .values({
        name: "Jordan Lee",
        email: "customer2@demo.com",
        passwordHash: hash,
        role: "customer",
      })
      .returning();

    const [workerUser1] = await db
      .insert(usersTable)
      .values({
        name: "Marcus Webb",
        email: "worker@demo.com",
        passwordHash: hash,
        role: "worker",
      })
      .returning();

    const [workerUser2] = await db
      .insert(usersTable)
      .values({
        name: "Sofia Chen",
        email: "worker2@demo.com",
        passwordHash: hash,
        role: "worker",
      })
      .returning();

    const [adminUser] = await db
      .insert(usersTable)
      .values({
        name: "Admin",
        email: "admin@demo.com",
        passwordHash: hash,
        role: "admin",
      })
      .returning();

    const [worker1] = await db
      .insert(workersTable)
      .values({ userId: workerUser1!.id, status: "available", lat: 37.774929, lng: -122.419416 })
      .returning();

    const [worker2] = await db
      .insert(workersTable)
      .values({ userId: workerUser2!.id, status: "available", lat: 37.785889, lng: -122.428163 })
      .returning();

    const [car1] = await db
      .insert(carsTable)
      .values({
        userId: customer1!.id,
        brand: "BMW",
        model: "5 Series",
        color: "#1A1A2E",
        plateNumber: "BMW 550i",
        carType: "sedan",
      })
      .returning();

    const [car2] = await db
      .insert(carsTable)
      .values({
        userId: customer2!.id,
        brand: "Mercedes",
        model: "GLE 450",
        color: "#C0C0C0",
        plateNumber: "MBZ GLE4",
        carType: "suv",
      })
      .returning();

    const [pkg1] = await db
      .insert(packagesTable)
      .values({
        name: "Basic Wash",
        description: "Professional exterior hand wash",
        price: 25,
        tier: "basic",
        itemsJson: JSON.stringify([
          "Exterior hand wash",
          "Wheel clean",
          "Window clean",
          "Tire shine",
        ]),
      })
      .returning();

    const [pkg2] = await db
      .insert(packagesTable)
      .values({
        name: "Full Detail",
        description: "Complete interior and exterior detailing",
        price: 65,
        tier: "full",
        itemsJson: JSON.stringify([
          "Everything in Basic",
          "Interior vacuum",
          "Dashboard wipe",
          "Seat wipe",
          "Floor mats cleaned",
          "Door panels wiped",
        ]),
      })
      .returning();

    const [pkg3] = await db
      .insert(packagesTable)
      .values({
        name: "Premium Platinum",
        description: "The ultimate luxury detailing experience",
        price: 120,
        tier: "premium",
        itemsJson: JSON.stringify([
          "Everything in Full Detail",
          "Engine bay clean",
          "Ceramic wax polish",
          "Odor treatment",
          "Leather conditioning",
          "Paint protection spray",
        ]),
      })
      .returning();

    await db.insert(ordersTable).values([
      {
        customerId: customer1!.id,
        workerId: worker1!.id,
        carId: car1!.id,
        packageId: pkg2!.id,
        packageName: "Full Detail",
        addonsJson: JSON.stringify([
          { id: "roof-polish", name: "Roof Polish", price: 15, zone: "roof" },
        ]),
        status: "completed",
        scheduledDate: new Date().toISOString().split("T")[0]!,
        scheduledTime: "Morning (8am–12pm)",
        locationLat: 37.774929,
        locationLng: -122.419416,
        locationAddress: "123 Market St, San Francisco, CA",
        totalPrice: 80,
      },
      {
        customerId: customer1!.id,
        workerId: worker1!.id,
        carId: car1!.id,
        packageId: pkg3!.id,
        packageName: "Premium Platinum",
        addonsJson: JSON.stringify([]),
        status: "in_progress",
        scheduledDate: new Date().toISOString().split("T")[0]!,
        scheduledTime: "Afternoon (12pm–5pm)",
        locationLat: 37.774929,
        locationLng: -122.419416,
        locationAddress: "456 Mission St, San Francisco, CA",
        totalPrice: 120,
      },
      {
        customerId: customer2!.id,
        workerId: worker2!.id,
        carId: car2!.id,
        packageId: pkg1!.id,
        packageName: "Basic Wash",
        addonsJson: JSON.stringify([]),
        status: "confirmed",
        scheduledDate: new Date().toISOString().split("T")[0]!,
        scheduledTime: "Evening (5pm–9pm)",
        locationLat: 37.785889,
        locationLng: -122.428163,
        locationAddress: "789 Valencia St, San Francisco, CA",
        totalPrice: 25,
      },
      {
        customerId: customer2!.id,
        workerId: null,
        carId: car2!.id,
        packageId: pkg2!.id,
        packageName: "Full Detail",
        addonsJson: JSON.stringify([]),
        status: "pending",
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0]!,
        scheduledTime: "Morning (8am–12pm)",
        locationLat: 37.785889,
        locationLng: -122.428163,
        locationAddress: "100 California St, San Francisco, CA",
        totalPrice: 65,
      },
    ]);

    logger.info("Seed complete");
  } catch (err) {
    logger.error({ err }, "Seed failed");
  }
}
