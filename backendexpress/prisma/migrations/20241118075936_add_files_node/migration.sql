-- CreateTable
CREATE TABLE "FileNodeSga" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "path" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileNodeSga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileNodeGLManagementBoard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "path" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileNodeGLManagementBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileNodeGentaniBoard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "path" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileNodeGentaniBoard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileNodeSga" ADD CONSTRAINT "FileNodeSga_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileNodeSga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileNodeGLManagementBoard" ADD CONSTRAINT "FileNodeGLManagementBoard_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileNodeGLManagementBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileNodeGentaniBoard" ADD CONSTRAINT "FileNodeGentaniBoard_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileNodeGentaniBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
