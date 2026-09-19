import { ProgressPageClient } from "@/app/gym/progress/[exerciseId]/progress-page-client";

export default async function ExerciseProgressPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  return <ProgressPageClient exerciseId={exerciseId} />;
}
