import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userStatsSchema } from "@/features/nutrition/lib/schema";

export async function GET() {
  const stats = await prisma.userStats.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  return NextResponse.json(stats);
}

export async function PUT(req: NextRequest) {
  const parsed = userStatsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const stats = await prisma.userStats.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: parsed.data,
  });
  return NextResponse.json(stats);
}
