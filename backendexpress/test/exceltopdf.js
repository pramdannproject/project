const { exec } = require("child_process");
const path = require("path");

function convertExcelToPDF(inputFilePath, outputFilePath) {
  const paperSize = "A4";  // Ubah ke ukuran kertas yang diinginkan, misal A4, Letter, dll.
  const command = `soffice --headless --convert-to pdf --outdir ${path.dirname(outputFilePath)} --paper-size ${paperSize} ${inputFilePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error converting Excel to PDF:", error);
      return;
    }
    if (stderr) {
      console.error("stderr:", stderr);
    }
    console.log("stdout:", stdout);
    console.log("Excel converted to PDF:", outputFilePath);
  });
}

// Ubah Excel ke PDF
const inputPath = path.resolve(__dirname, "SOP MESIN TEFA AKTI.xlsx");
const outputPath = path.resolve();

convertExcelToPDF(inputPath, outputPath);
