-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "noReg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "picture" TEXT NOT NULL DEFAULT '/default.png',

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assy" (
    "id_assy" SERIAL NOT NULL,
    "NR_elbow_planning" INTEGER NOT NULL,
    "NR_elbow_actual" INTEGER NOT NULL,
    "NR_ball_planning" INTEGER NOT NULL,
    "NR_ball_actual" INTEGER NOT NULL,
    "NR_hev_planning" INTEGER NOT NULL,
    "NR_hev_actual" INTEGER NOT NULL,
    "NR_2_elbow_planning" INTEGER NOT NULL,
    "NR_2_elbow_actual" INTEGER NOT NULL,
    "NR_2_ball_planning" INTEGER NOT NULL,
    "NR_2_ball_actual" INTEGER NOT NULL,
    "NR_2_hev_planning" INTEGER NOT NULL,
    "NR_2_hev_actual" INTEGER NOT NULL,

    CONSTRAINT "Assy_pkey" PRIMARY KEY ("id_assy")
);

-- CreateTable
CREATE TABLE "Casting" (
    "id_casting" SERIAL NOT NULL,
    "LP_planning" INTEGER NOT NULL,
    "LP_actual" INTEGER NOT NULL,
    "DC_conv_planning" INTEGER NOT NULL,
    "DC_conv_actual" INTEGER NOT NULL,
    "DC_hev_planning" INTEGER NOT NULL,
    "DC_hev_actual" INTEGER NOT NULL,
    "CB_conv_planning" INTEGER NOT NULL,
    "CB_conv_actual" INTEGER NOT NULL,
    "CB_hev_planning" INTEGER NOT NULL,
    "CB_hev_actual" INTEGER NOT NULL,
    "CH_conv_planning" INTEGER NOT NULL,
    "CH_conv_actual" INTEGER NOT NULL,
    "CH_hev_planning" INTEGER NOT NULL,
    "CH_hev_actual" INTEGER NOT NULL,
    "CA_IN_conv_planning" INTEGER NOT NULL,
    "CA_IN_conv_actual" INTEGER NOT NULL,
    "CA_IN_hev_planning" INTEGER NOT NULL,
    "CA_IN_hev_actual" INTEGER NOT NULL,
    "CA_EX_conv_planning" INTEGER NOT NULL,
    "CA_EX_conv_actual" INTEGER NOT NULL,
    "CA_EX_hev_planning" INTEGER NOT NULL,
    "CA_EX_hev_actual" INTEGER NOT NULL,
    "CR_1NR_planning" INTEGER NOT NULL,
    "CR_1NR_actual" INTEGER NOT NULL,
    "CR_2NR_planning" INTEGER NOT NULL,
    "CR_2NR_actual" INTEGER NOT NULL,
    "elbow_1NR_planning" INTEGER NOT NULL,
    "elbow_1NR_actual" INTEGER NOT NULL,
    "ball_1NR_planning" INTEGER NOT NULL,
    "ball_1NR_actual" INTEGER NOT NULL,
    "hev_1NR_planning" INTEGER NOT NULL,
    "hev_1NR_actual" INTEGER NOT NULL,
    "elbow_2NR_planning" INTEGER NOT NULL,
    "elbow_2NR_actual" INTEGER NOT NULL,
    "ball_2NR_planning" INTEGER NOT NULL,
    "ball_2NR_actual" INTEGER NOT NULL,
    "hev_2NR_planning" INTEGER NOT NULL,
    "hev_2NR_actual" INTEGER NOT NULL,
    "planning_1NR" INTEGER NOT NULL,
    "actual_1NR" INTEGER NOT NULL,
    "planning_2NR" INTEGER NOT NULL,
    "actual_2NR" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Casting_pkey" PRIMARY KEY ("id_casting")
);

-- CreateTable
CREATE TABLE "Machining" (
    "id_machining" SERIAL NOT NULL,
    "CB_conv_planning" INTEGER NOT NULL,
    "CB_conv_actual" INTEGER NOT NULL,
    "CB_hev_planning" INTEGER NOT NULL,
    "CB_hev_actual" INTEGER NOT NULL,
    "CH_conv_planning" INTEGER NOT NULL,
    "CH_conv_actual" INTEGER NOT NULL,
    "CH_hev_planning" INTEGER NOT NULL,
    "CH_hev_actual" INTEGER NOT NULL,
    "CA_IN_conv_planning" INTEGER NOT NULL,
    "CA_IN_conv_actual" INTEGER NOT NULL,
    "CA_IN_hev_planning" INTEGER NOT NULL,
    "CA_IN_hev_actual" INTEGER NOT NULL,

    CONSTRAINT "Machining_pkey" PRIMARY KEY ("id_machining")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
