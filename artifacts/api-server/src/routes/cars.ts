import { Router } from "express";
import { db } from "@workspace/db";
import { carsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const cars = await db
      .select()
      .from(carsTable)
      .where(eq(carsTable.userId, req.user!.id));
    res.json(cars);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res) => {
  const { brand, model, color, plateNumber, carType } = req.body as {
    brand: string;
    model: string;
    color: string;
    plateNumber: string;
    carType: "sedan" | "suv" | "truck" | "hatchback";
  };
  try {
    const [car] = await db
      .insert(carsTable)
      .values({ userId: req.user!.id, brand, model, color, plateNumber, carType })
      .returning();
    res.status(201).json(car);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params["id"]!);
  const { brand, model, color, plateNumber, carType } = req.body as {
    brand: string;
    model: string;
    color: string;
    plateNumber: string;
    carType: "sedan" | "suv" | "truck" | "hatchback";
  };
  try {
    const [car] = await db
      .update(carsTable)
      .set({ brand, model, color, plateNumber, carType })
      .where(and(eq(carsTable.id, id), eq(carsTable.userId, req.user!.id)))
      .returning();
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    res.json(car);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  const id = parseInt(req.params["id"]!);
  try {
    await db
      .delete(carsTable)
      .where(and(eq(carsTable.id, id), eq(carsTable.userId, req.user!.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
