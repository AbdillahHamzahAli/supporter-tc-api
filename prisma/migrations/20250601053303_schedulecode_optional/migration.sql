-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_codeId_fkey";

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "codeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "ScheduleCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
