import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  date: z.string(),
  slot: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  calories: z.number().int().min(0).max(10000),
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json([]);
  const entries = await prisma.calorieEntry.findMany({
    where: { date },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const entry = await prisma.calorieEntry.create({ data: parsed.data });
  return NextResponse.json(entry);
}
