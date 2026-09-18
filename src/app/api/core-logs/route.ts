import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  date: z.string(),
  exerciseName: z.string(),
  sets: z.number().int().min(0).nullable().optional(),
  reps: z.number().int().min(0).nullable().optional(),
  durationSec: z.number().int().min(0).nullable().optional(),
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const logs = await prisma.coreLog.findMany({
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
  const log = await prisma.coreLog.create({ data: parsed.data });
  return NextResponse.json(log);
}
