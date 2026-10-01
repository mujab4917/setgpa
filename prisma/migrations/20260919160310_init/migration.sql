-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "campus" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "gpaScale" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
    "gradingSystemNotes" TEXT,
    "gpaExplanation" TEXT,
    "cgpaExplanation" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "sourceNote" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeRule" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "gradePoint" DOUBLE PRECISION NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "City_isActive_idx" ON "City"("isActive");

-- CreateIndex
CREATE INDEX "University_isActive_idx" ON "University"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "University_cityId_slug_key" ON "University"("cityId", "slug");

-- CreateIndex
CREATE INDEX "GradeRule_universityId_sortOrder_idx" ON "GradeRule"("universityId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GradeRule_universityId_grade_key" ON "GradeRule"("universityId", "grade");

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeRule" ADD CONSTRAINT "GradeRule_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
