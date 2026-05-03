import { Router } from "express";
import { db } from "@workspace/db";
import { packagesTable } from "@workspace/db";
import type { Request, Response } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const packages = await db.select().from(packagesTable);
    res.json(
      packages.map((p) => ({
        ...p,
        items: JSON.parse(p.itemsJson) as string[],
      })),
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
