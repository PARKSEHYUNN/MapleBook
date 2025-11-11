/*
  Warnings:

  - A unique constraint covering the columns `[apiKeyHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "character_gender" DROP NOT NULL,
ALTER COLUMN "character_class_level" DROP NOT NULL,
ALTER COLUMN "character_exp" DROP NOT NULL,
ALTER COLUMN "character_exp_rate" DROP NOT NULL,
ALTER COLUMN "character_guild_name" DROP NOT NULL,
ALTER COLUMN "character_image" DROP NOT NULL,
ALTER COLUMN "character_date_create" DROP NOT NULL,
ALTER COLUMN "access_flag" DROP NOT NULL,
ALTER COLUMN "liberation_quest_clear" DROP NOT NULL,
ALTER COLUMN "character_popularity" DROP NOT NULL,
ALTER COLUMN "character_combat_power" DROP NOT NULL,
ALTER COLUMN "raw_stat" DROP NOT NULL,
ALTER COLUMN "raw_hyper_stat" DROP NOT NULL,
ALTER COLUMN "raw_propensity" DROP NOT NULL,
ALTER COLUMN "raw_ability" DROP NOT NULL,
ALTER COLUMN "raw_item_equipment" DROP NOT NULL,
ALTER COLUMN "raw_cashitem_equipment" DROP NOT NULL,
ALTER COLUMN "raw_symbol_equipment" DROP NOT NULL,
ALTER COLUMN "raw_set_effect" DROP NOT NULL,
ALTER COLUMN "raw_beauty_equipment" DROP NOT NULL,
ALTER COLUMN "raw_android_equipment" DROP NOT NULL,
ALTER COLUMN "raw_pet_equipment" DROP NOT NULL,
ALTER COLUMN "raw_skill" DROP NOT NULL,
ALTER COLUMN "raw_link_skill" DROP NOT NULL,
ALTER COLUMN "raw_vmatrix" DROP NOT NULL,
ALTER COLUMN "raw_hexamatrix" DROP NOT NULL,
ALTER COLUMN "raw_hexamatrix_stat" DROP NOT NULL,
ALTER COLUMN "raw_dojang" DROP NOT NULL,
ALTER COLUMN "raw_other_stat" DROP NOT NULL,
ALTER COLUMN "raw_ring_exchange_skill_equipment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiKeyHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKeyHash_key" ON "User"("apiKeyHash");
