import { Suspense } from "react";
import { GymPageClient } from "@/app/gym/gym-page-client";

export default function GymPage() {
  return (
    <Suspense>
      <GymPageClient />
    </Suspense>
  );
}
