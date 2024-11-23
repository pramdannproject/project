const ExcelJS = require("exceljs");
const puppeteer = require("puppeteer");
const fs = require("fs");

async function excelToPDF(inputFilePath, outputFilePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputFilePath);

  // Ambil data dari sheet pertama
  const worksheet = workbook.worksheets[0];
  let htmlContent = "<table border='1'>";

  worksheet.eachRow((row) => {
    htmlContent += "<tr>";
    row.eachCell((cell) => {
      htmlContent += `<td>${cell.value || ""}</td>`;
    });
    htmlContent += "</tr>";
  });
  htmlContent += "</table>";

  // Buat PDF menggunakan Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Tambahkan data Excel dalam format HTML ke browser Puppeteer
  await page.setContent(`
    <html>
      <body>${htmlContent}</body>
    </html>
  `);

  // Simpan sebagai PDF
  await page.pdf({ path: outputFilePath, format: "A4" });
  await browser.close();

  console.log("Excel converted to PDF:", outputFilePath);
}

// Ubah Excel ke PDF
const inputPath = "SOP MESIN TEFA AKTI.xlsx";
const outputPath = "example.pdf";

excelToPDF(inputPath, outputPath).catch((error) =>
  console.error("Error converting Excel to PDF:", error)
);
