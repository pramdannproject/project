const ExcelJS = require('exceljs');
const { createCanvas } = require('canvas');
const fs = require('fs');

async function convertExcelToPNG(excelFilePath, outputPngPath) {
  // Buat workbook dan baca file Excel
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);

  // Ambil sheet pertama
  const worksheet = workbook.worksheets[0];

  // Tentukan ukuran canvas
  const canvas = createCanvas(800, 600); // Sesuaikan ukuran sesuai kebutuhan
  const ctx = canvas.getContext('2d');

  // Warna background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Atur font
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';

  let y = 30; // Koordinat awal vertikal

  // Iterasi melalui setiap baris dan kolom
  worksheet.eachRow((row, rowNumber) => {
    let x = 20; // Koordinat awal horizontal
    row.eachCell((cell, colNumber) => {
      const cellText = cell.value !== null && cell.value !== undefined ? cell.toString() : '';
      ctx.fillText(cellText, x, y);
      x += 150; // Jarak antar kolom
    });
    y += 30; // Jarak antar baris
  });

  // Simpan canvas ke file PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPngPath, buffer);

  console.log(`File berhasil dikonversi ke ${outputPngPath}`);
}

// Jalankan fungsi
convertExcelToPNG('Mapping Henkaten.xlsx', 'output.png').catch((err) => {
  console.error('Terjadi kesalahan:', err);
});