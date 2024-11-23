const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const useragent = require("express-useragent");
const getIpInfo = require("../../functions/getIpInfo");

router.use(useragent.express());

// const detectDevice = (userAgent) => {
//   if (/mobile/i.test(userAgent)) return "Mobile";
//   if (/tablet/i.test(userAgent)) return "Tablet";
//   if (/desktop/i.test(userAgent) || /mac|win|linux/i.test(userAgent)) return "Desktop";
//   return "Unknown";
// };

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //get ip address from user
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ipInfo = await getIpInfo(ip);

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Find the account using the unique email field
    const account = await prisma.account.findUnique({
      where: {
        email: email,
      },
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const passwordMatch = await bcrypt.compare(password, account.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Find the contact using the same unique email field
    const contact = await prisma.contact.findUnique({
      where: {
        email: email,
      },
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const expired = Date.now() + 60 * 60 * 60 * 1000; // 1 day

    // Detect device type using express-useragent
    let deviceType;
    if (req.useragent.isMobile) deviceType = "MOBILE";
    else if (req.useragent.isTablet) deviceType = "TABLET";
    else if (req.useragent.isDesktop) deviceType = "DESKTOP";
    else deviceType = "UNKNOWN";

    let token = "initial";

    // Write the token to the database session
    const sessionManager = await prisma.session.create({
      data: {
        token: token,
        expiredAt: new Date(expired),
        device: deviceType,
        ip: ip,
        region: ipInfo.region,
        city: ipInfo.city,
        loc: ipInfo.loc,
        org: ipInfo.org,
        timezone: ipInfo.timezone,
        account: {
          connect: {
            id: account.id,
          },
        },
      },
    });

    if (!sessionManager) {
      return res.status(400).json({ error: "Failed to create session" });
    }

    // Generate a JWT token
    token = jwt.sign(
      {
        id: account.id,
        role: account.role,
        email: account.email,
        noReg: contact.noReg,
        expiredAt: expired,
        device: deviceType,
        sessionId: sessionManager.id,
      },
      process.env.JWT_SECRET
    );

    // update token to session
    const goodSession = await prisma.session.update({
      where: {
        id: sessionManager.id,
      },
      data: {
        token: token,
      },
    });

    if (!goodSession) {
      return res.status(400).json({ error: "Failed to update session" });
    }

    //id of session
    // console.log(sessionManager.id);

    return res
      .status(200)
      .json({ token, deviceType, sessionId: sessionManager.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

//logout user
router.post("/logout", async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    //decode token
    const decoded = jwt.decode(token);
    const sessionId = decoded.sessionId;

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return res
        .status(200)
        .json({ message: "Logout success, but the session loses" });
    }

    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return res.status(200).json({ message: "Logout success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/remote-logout", async (req, res) => {
  const { authorization } = req.headers;
  const { sessionId } = req.body;

  try {
    if (!authorization) {
      return res.status(400).json({ error: "auth is required" });
    }

    //decode token
    const decoded = jwt.decode(authorization.replace("Bearer ", ""));
    const sessionNow = decoded.sessionId;

    if (sessionNow == sessionId) {
      return res.status(401).json({ error: "Cannot logout current session" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return res.status(200).json({ message: "Remote logout success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/remote-logout-others", async (req, res) => {
  const { authorization } = req.headers;
  const { sessionId } = req.body;

  try {
    if (!authorization) {
      return res.status(400).json({ error: "auth is required" });
    }

    //decode token
    const decoded = jwt.decode(authorization.replace("Bearer ", ""));
    const sessionNow = decoded.sessionId;

    if (sessionNow == sessionId) {
      return res.status(401).json({ error: "Cannot logout current session" });
    }

    if (decoded.role !== "ADMIN") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return res.status(200).json({ message: "Remote logout success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
