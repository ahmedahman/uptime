import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isPersonalRecord } from "@/features/gym/lib/pr-check";

const setSchema = z.object({
  setIndex: z.number().int().min(0),
  weightKg: z.number().min(0).nullable(),
  reps: z.number().int().min(0).nullable(),
});

const bodySchema = z.object({
  date: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
  exerciseId: z.string(),
  sets: z.array(setSchema),
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const exerciseId = req.nextUrl.searchParams.get("exerciseId");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "0") || undefined;

  const logs = await prisma.workoutLog.findMany({
    where: {
      ...(date ? { date } : {}),
      ...(exerciseId ? { exerciseId } : {}),
    },
    include: { sets: { orderBy: { setIndex: "asc" } } },
    orderBy: { date: "desc" },
    take: limit,
  });

  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, dayOfWeek, exerciseId, sets } = parsed.data;

  const log = await prisma.workoutLog.upsert({
    where: { exerciseId_date: { exerciseId, date } },
    create: { date, dayOfWeek, exerciseId },
    update: {},
  });

  await prisma.workoutSet.deleteMany({ where: { workoutLogId: log.id } });

  const createdSets = [];
  for (const set of sets) {
    const isPr =
      set.weightKg != null && set.reps != null
        ? await isPersonalRecord(exerciseId, set.weightKg, set.reps, log.id)
        : false;

    createdSets.push(
      await prisma.workoutSet.create({
        data: {
          workoutLogId: log.id,
          exerciseId,
          setIndex: set.setIndex,
          weightKg: set.weightKg,
          reps: set.reps,
          isPr,
        },
      }),
    );
  }

  return NextResponse.json({ log, sets: createdSets });
}
