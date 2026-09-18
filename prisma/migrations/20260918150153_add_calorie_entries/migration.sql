-- CreateTable
CREATE TABLE "CalorieEntry" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalorieEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalorieEntry_date_idx" ON "CalorieEntry"("date");
