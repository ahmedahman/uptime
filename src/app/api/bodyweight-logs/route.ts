import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  date: z.string(),
  weightKg: z.number().min(20).max(300),
});

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "12") || 12;
  const logs = await prisma.bodyweightLog.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });
  return NextResponse.json(logs.reverse());
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, weightKg } = parsed.data;
  const log = await prisma.bodyweightLog.upsert({
    where: { date },
    create: { date, weightKg },
    update: { weightKg },
  });
  return NextResponse.json(log);
}
