-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "raw_union" JSONB,
ADD COLUMN     "raw_union_artifact" JSONB,
ADD COLUMN     "raw_union_champion" JSONB,
ADD COLUMN     "raw_union_raider" JSONB;
