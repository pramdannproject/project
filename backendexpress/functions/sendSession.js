const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function sendSession(idAccount, idSession) {
  try {
    if (!idAccount || !idSession) {
      throw new Error("Both idAccount and idSession are required.");
    }

    const account = await prisma.account.findUnique({
      where: {
        id: idAccount,
      },
      include: {
        contact: true,
        sessions: true,
      },
    });

    if (!account) {
      throw new Error("Account not found.");
    }

    // Tambahkan sessionNow secara manual
    const accountWithSessionNow = {
      ...account,
      sessionNow: idSession,
    };

    //delete password field
    delete accountWithSessionNow.password;
    delete accountWithSessionNow.role;

    // Modifikasi URL gambar jika ada
    if (accountWithSessionNow.contact?.picture) {
      accountWithSessionNow.contact.picture = `${process.env.HOST}/files/img/profile/${accountWithSessionNow.contact.picture}`;
    }

    return { account: accountWithSessionNow };
  } catch (error) {
    console.error("Error in sendSession:", error.message);
    throw error;
  }
}

module.exports = sendSession;
