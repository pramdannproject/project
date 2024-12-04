const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
const { startOfDay, endOfDay } = require("date-fns"); // Import untuk mengatur default tanggal
dotenv.config();

const sendDataDefectOp = require("../functions/sendDefectOp");

function handleDataDefectOp(ws, req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
        ws.send(JSON.stringify({ error: "Token is required" }));
        ws.close();
        return;
    }

    // Verify the token
    try {
        const decoded = verify(token, process.env.JWT_SECRET);

        if (decoded.expired < Date.now()) {
            ws.send(JSON.stringify({ error: "Invalid or expired token" }));
            ws.close();
            return;
        }

        if (decoded.role !== "ADMIN") {
            ws.send(JSON.stringify({ error: "Unauthorized" }));
            ws.close();
            return;
        }
    } catch (err) {
        ws.send(JSON.stringify({ error: "Invalid or expired token" }));
        ws.close();
        return;
    }

    // Retrieve query parameters
    const searchKey = url.searchParams.get("search");
    const parentId = url.searchParams.get("parentId");
    const fromDate = url.searchParams.get("fromDate");
    const toDate = url.searchParams.get("toDate");

    if (!parentId) {
        ws.send(JSON.stringify({ error: "parentId is required" }));
        ws.close();
        return;
    }

    // Default date handling if fromDate and toDate are not provided
    const today = new Date();
    const defaultFromDate = fromDate ? new Date(fromDate) : startOfDay(today);  // Default to today at 00:00
    const defaultToDate = toDate ? new Date(toDate) : endOfDay(today);  // Default to today at 23:59

    let filterSearch = searchKey || null; // Optional searchKey

    // Send the initial data
    let data = null;

    const sendUpdatedData = async () => {
        let newData = await sendDataDefectOp(parentId, filterSearch, defaultFromDate, defaultToDate);

        if (JSON.stringify(newData) !== data) {
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

module.exports = handleDataDefectOp;