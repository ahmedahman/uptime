import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  date: z.string(),
  completed: z.boolean(),
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json(null);
  const log = await prisma.warmupLog.findUnique({ where: { date } });
  return NextResponse.json(log);
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, completed } = parsed.data;
  const log = await prisma.warmupLog.upsert({
    where: { date },
    create: { date, completed },
    update: { completed },
  });
  return NextResponse.json(log);
}
