-- CreateTable
CREATE TABLE "ControlAssy" (
    "id_controlAssy" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "planning" INTEGER NOT NULL,
    "actual" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlAssy_pkey" PRIMARY KEY ("id_controlAssy")
);

-- CreateTable
CREATE TABLE "ControlMachining" (
    "id_controlMachining" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cylblock_planning" INTEGER NOT NULL,
    "cylblock_actual" INTEGER NOT NULL,
    "cylhead_planning" INTEGER NOT NULL,
    "cylhead_actual" INTEGER NOT NULL,
    "crankshaft_1nr_planning" INTEGER NOT NULL,
    "crankshaft_1nr_actual" INTEGER NOT NULL,
    "crankshaft_2nr_planning" INTEGER NOT NULL,
    "crankshaft_2nr_actual" INTEGER NOT NULL,
    "camshaft_conv_planning" INTEGER NOT NULL,
    "camshaft_conv_actual_in" INTEGER NOT NULL,
    "camshaft_conv_actual_ex" INTEGER NOT NULL,
    "camshaft_conv_bal_in" INTEGER NOT NULL,
    "camshaft_conv_bal_ex" INTEGER NOT NULL,
    "camshaft_hv_planning" INTEGER NOT NULL,
    "camshaft_hv_actual_in" INTEGER NOT NULL,
    "camshaft_hv_actual_ex" INTEGER NOT NULL,
    "camshaft_hv_bal_in" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlMachining_pkey" PRIMARY KEY ("id_controlMachining")
);

-- CreateTable
CREATE TABLE "ControlCasting" (
    "id_controlCasting" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cast_dc_planning" INTEGER NOT NULL,
    "cast_dc_actual" INTEGER NOT NULL,
    "cast_lp_planning" INTEGER NOT NULL,
    "cast_lp_actual" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlCasting_pkey" PRIMARY KEY ("id_controlCasting")
);
