const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function sendDefectOp(parentId, searchKey, fromDate, toDate) {
  try {
    // Initialize the search criteria for `defectOperatorChild`
    const searchCriteria = {
      parentId: parentId, // We are filtering based on parentId
    };

    // Add searchKey criteria if provided
    if (searchKey) {
      searchCriteria.OR = [
        { no: { contains: searchKey, mode: 'insensitive' } },
        { operator: { contains: searchKey, mode: 'insensitive' } },
        { line: { contains: searchKey, mode: 'insensitive' } },
        { process: { contains: searchKey, mode: 'insensitive' } },
        { defect: { contains: searchKey, mode: 'insensitive' } },
      ];
    }

    // Add date range filter if fromDate and toDate are provided
    if (fromDate && toDate) {
      searchCriteria.createdAt = {
        gte: new Date(fromDate), // Greater than or equal to fromDate
        lte: new Date(toDate),   // Less than or equal to toDate
      };
    }

    // Fetch the defectOperatorChild records with optional search criteria
    const defectOperators = await prisma.defectOperatorChild.findMany({
      where: searchCriteria,
      include: {
        parent: true,    // Include parent (defectOperatorParrent)
        operator: true,  // Include operator
      },
    });

    // Return the filtered defectOperatorChild records
    return defectOperators;
  } catch (error) {
    console.error("Error fetching defectOperatorChilds:", error);
    throw error;
  }
}

module.exports = sendDefectOp;