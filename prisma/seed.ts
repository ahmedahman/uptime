import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { EXERCISES, DAY_TEMPLATES, findExercise } from "../src/features/gym/lib/day-templates";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const exerciseIdBySlug = new Map<string, string>();

  for (const exercise of EXERCISES) {
    const created = await prisma.exercise.upsert({
      where: { id: exercise.slug },
      create: {
        id: exercise.slug,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        notes: exercise.notes,
      },
      update: {
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        notes: exercise.notes,
      },
    });
    exerciseIdBySlug.set(exercise.slug, created.id);
  }

  for (const day of DAY_TEMPLATES) {
    const template = await prisma.dayTemplate.upsert({
      where: { dayOfWeek: day.dayOfWeek },
      create: {
        dayOfWeek: day.dayOfWeek,
        dayName: day.dayName,
        type: day.type,
        skillName: day.skillName,
      },
      update: {
        dayName: day.dayName,
        type: day.type,
        skillName: day.skillName,
      },
    });

    await prisma.dayTemplateExercise.deleteMany({ where: { dayTemplateId: template.id } });

    for (const [order, dayExercise] of day.exercises.entries()) {
      const exercise = findExercise(dayExercise.exerciseSlug);
      if (!exercise) throw new Error(`Unknown exercise slug: ${dayExercise.exerciseSlug}`);

      const scheme =
        dayExercise.scheme.kind === "heavy-failure-backoff"
          ? `heavy-failure-backoff:${dayExercise.scheme.count}`
          : `straight:${dayExercise.scheme.count}x${dayExercise.scheme.repRange}`;

      await prisma.dayTemplateExercise.create({
        data: {
          dayTemplateId: template.id,
          exerciseId: exerciseIdBySlug.get(dayExercise.exerciseSlug)!,
          order,
          scheme,
        },
      });
    }
  }

  await prisma.userStats.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", weightKg: 61, heightCm: 170, age: 25, activityMult: 1.2 },
    update: {},
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
