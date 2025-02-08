-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarCO2Record" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetMonth" TIMESTAMP(3) NOT NULL,
    "monthlyDistance" DOUBLE PRECISION NOT NULL,
    "fuelEfficiency" DOUBLE PRECISION NOT NULL,
    "fuelType" TEXT NOT NULL,
    "co2Emission" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarCO2Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnowRemovalRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "snowDepth" DOUBLE PRECISION NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "co2Reduction" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SnowRemovalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ACCO2Record" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "usageHours" DOUBLE PRECISION NOT NULL,
    "powerConsumption" DOUBLE PRECISION NOT NULL,
    "temperature" INTEGER NOT NULL,
    "co2Emission" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ACCO2Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyTarget" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetMonth" TIMESTAMP(3) NOT NULL,
    "carTarget" DOUBLE PRECISION NOT NULL,
    "acTarget" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyTarget_userId_targetMonth_key" ON "MonthlyTarget"("userId", "targetMonth");

-- AddForeignKey
ALTER TABLE "CarCO2Record" ADD CONSTRAINT "CarCO2Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnowRemovalRecord" ADD CONSTRAINT "SnowRemovalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ACCO2Record" ADD CONSTRAINT "ACCO2Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyTarget" ADD CONSTRAINT "MonthlyTarget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
