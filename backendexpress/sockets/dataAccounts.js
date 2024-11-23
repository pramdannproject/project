const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const sendDataAccounts = require("../functions/sendAccount");

function handleDataAccountsSocket(ws, req) {
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

        if(decoded.role !== "ADMIN") {
            ws.send(JSON.stringify({ error: "Unauthorized" }));
            ws.close();
            return;
        }
    } catch(err) {
        ws.send(JSON.stringify({ error: "Invalid or expired token" }));
        ws.close();
        return;
    }

    const searchKey = url.searchParams.get("search");

    let filterSearch = null;
    
    if(searchKey) {
        filterSearch = searchKey;
    }

    // Send the initial data
    let data = null;

    const sendUpdatedData = async () => {
        let newData = await sendDataAccounts(filterSearch);

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

module.exports = handleDataAccountsSocket;