/*
  Warnings:

  - Changed the type of `width` on the `StreamedImages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `height` on the `StreamedImages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StreamedImages" DROP COLUMN "width",
ADD COLUMN     "width" INTEGER NOT NULL,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER NOT NULL;
