/*
  Warnings:

  - A unique constraint covering the columns `[mainCharacterId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "encryptedApiKey" TEXT,
ADD COLUMN     "mainCharacterId" TEXT;

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ocid" TEXT NOT NULL,
    "character_name" TEXT NOT NULL,
    "world_name" TEXT NOT NULL,
    "character_gender" TEXT NOT NULL,
    "character_class" TEXT NOT NULL,
    "character_class_level" TEXT NOT NULL,
    "character_level" INTEGER NOT NULL,
    "character_exp" BIGINT NOT NULL,
    "character_exp_rate" DOUBLE PRECISION NOT NULL,
    "character_guild_name" TEXT NOT NULL,
    "character_image" TEXT NOT NULL,
    "character_date_create" TIMESTAMP(3) NOT NULL,
    "access_flag" BOOLEAN NOT NULL,
    "liberation_quest_clear" INTEGER NOT NULL,
    "character_popularity" INTEGER NOT NULL,
    "character_combat_power" INTEGER NOT NULL,
    "raw_stat" JSONB NOT NULL,
    "raw_hyper_stat" JSONB NOT NULL,
    "raw_propensity" JSONB NOT NULL,
    "raw_ability" JSONB NOT NULL,
    "raw_item_equipment" JSONB NOT NULL,
    "raw_cashitem_equipment" JSONB NOT NULL,
    "raw_symbol_equipment" JSONB NOT NULL,
    "raw_set_effect" JSONB NOT NULL,
    "raw_beauty_equipment" JSONB NOT NULL,
    "raw_android_equipment" JSONB NOT NULL,
    "raw_pet_equipment" JSONB NOT NULL,
    "raw_skill" JSONB NOT NULL,
    "raw_link_skill" JSONB NOT NULL,
    "raw_vmatrix" JSONB NOT NULL,
    "raw_hexamatrix" JSONB NOT NULL,
    "raw_hexamatrix_stat" JSONB NOT NULL,
    "raw_dojang" JSONB NOT NULL,
    "raw_other_stat" JSONB NOT NULL,
    "raw_ring_exchange_skill_equipment" JSONB NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_ocid_key" ON "Character"("ocid");

-- CreateIndex
CREATE UNIQUE INDEX "User_mainCharacterId_key" ON "User"("mainCharacterId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mainCharacterId_fkey" FOREIGN KEY ("mainCharacterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
