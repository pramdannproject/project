const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const sendSession = require("../functions/sendSession");
const sessionWatcher = require("../functions/sessionWatcher");

function handleDataSessionAccount(ws, req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if(!token) {
        ws.send(JSON.stringify({ error: "Token is required" }));
        ws.close();
        return;
    }

    // Verify the token
    try {
        const decoded = verify(token, process.env.JWT_SECRET);

        if(decoded.expired < Date.now()) {
            ws.send(JSON.stringify({ error: "Invalid or expired token" }));
            ws.close();
            return;
        }

        var sessionId = decoded.sessionId;
        var userId = decoded.id;

        const session = sessionWatcher(sessionId);

    } catch(err) {
        ws.send(JSON.stringify({ error: "Invalid or expired token" }));
        ws.close();
        return;
    }

    let data = null;

    const sendUpdatedData = async () => {
        let newData = await sendSession(userId, sessionId);

        if(JSON.stringify(newData) !== data) {
            data = JSON.stringify(newData);
            ws.send(data);
        }
    };

    sendUpdatedData();
    const interval = setInterval(sendUpdatedData, 1000);
    
    ws.on("close", () => {
        clearInterval(interval);
    });
}

module.exports = handleDataSessionAccount;