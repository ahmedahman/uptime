import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  date: z.string(),
  activityType: z.string(),
  durationMinutes: z.number().int().min(0),
  notes: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const logs = await prisma.cardioLog.findMany({
    where: date ? { date } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const log = await prisma.cardioLog.create({ data: parsed.data });
  return NextResponse.json(log);
}
