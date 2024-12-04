const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function sendHenkaten() {
  try {
    const henkaten = await prisma.manPowerImage.findMany({}); // Fetch all data

    //edit the url image to be accessible
    henkaten.forEach((henkaten) => {
      if (henkaten.path) {
        henkaten.path = `${process.env.HOST}/files/img/mp/${henkaten.path}`;
      }
    });

    return henkaten; // Return the filtered accounts
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}

module.exports = sendHenkaten;
