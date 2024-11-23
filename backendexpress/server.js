const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws"); // Import the ws package
const fs = require("fs");
const path = require("path");
const http = require("http"); // Import the http package
const { verify } = require("jsonwebtoken");

dotenv.config();

const app = express();

// Load controllers
const usersLogin = require("./controllers/users/login");
const usersRegister = require("./controllers/users/register");
const userEdit = require("./controllers/users/edit");
const userAccount = require("./controllers/users/account");

const filesAssets = require("./controllers/files/assets");
const filesProfile = require("./controllers/files/profile");
const filemanager = require("./controllers/files/filemanager");
const filetree = require("./controllers/files/filetree");
const filemanagersga = require("./controllers/files/filemanagersga");
const filetreesga = require("./controllers/files/fileTreeSga");

// Load WebSocket handlers
const handleDataAccountsSocket = require("./sockets/dataAccounts");
const handleDataSessionId = require("./sockets/dataSessionId");
const handleDataSessionAccount = require("./sockets/dataSessionAccount");

//-----------------Configuration------------------//
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json({ limit: "500000mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.enable("trust proxy");
app.set("view engine", "ejs");

const PORT = process.env.PORT || 1777;

//-----------------Routes------------------//

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API", status: 200 });
});

//===============[User Routes]=================//
app.use("/api/users", usersLogin);
app.use("/api/users", usersRegister);
app.use("/api/users", userEdit);
app.use("/api/users", userAccount);

//===============[Internal Routes]=================//

//===============[File Routes]=================//
app.use("/files", filesAssets);
app.use("/files", filesProfile);

app.use("/api/manage", filemanager);
app.use("/api/manage", filetree);
app.use("/api/manage", filemanagersga);
app.use("/api/manage", filetreesga);

//handler if route not found
app.use((req, res) => {
  res.status(404).send({ error: "Not found" });
});

// Setup WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Setup WebSocket connections
wss.on("connection", (ws, req) => {
  if (req.url.startsWith("/accounts")) {
    handleDataAccountsSocket(ws, req);
  } else if (req.url.startsWith("/dataSessionId")) {
    handleDataSessionId(ws, req);
  } else if (req.url.startsWith("/dataSessionAccount")) {
    handleDataSessionAccount(ws, req);
  } else {
    ws.send(JSON.stringify({ error: "Invalid request URL" }));
    ws.close();
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
