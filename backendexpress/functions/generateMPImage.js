const { PrismaClient } = require("@prisma/client"); 
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const sharp = require("sharp"); // Library untuk manipulasi gambar
dotenv.config();

async function generateMPImage(id) {
  try {
    const henkaten = await prisma.manPowerImage.findUnique({
      where: {
        id: id,
      },
    });

    if (!henkaten) {
      return { error: "Henkaten not found" };
    }

    if (henkaten.path) {
      const inputImagePath = path.join(
        __dirname,
        "../img/manpower",
        henkaten.path
      );
      const outputImagePath = path.join(
        __dirname,
        "../img/manpower",
        `modified_${henkaten.path}`
      );

      // Baca gambar asli
      const originalImage = sharp(inputImagePath);
      const metadata = await originalImage.metadata();
      const { width, height, channels } = metadata;

      // Tentukan ukuran maksimum untuk resize
      const maxWidth = 300;
      const maxHeight = 300;

      // Resize gambar dengan mempertahankan rasio asli
      const resizedImageBuffer = await originalImage
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: sharp.fit.inside, // Mempertahankan rasio dan memastikan gambar tidak melebihi dimensi yang ditentukan
          withoutEnlargement: true, // Jangan perbesar gambar jika lebih kecil dari ukuran target
        })
        .toBuffer();

      // Dapatkan metadata dari gambar yang di-resize
      const resizedMetadata = await sharp(resizedImageBuffer).metadata();
      const resizedWidth = resizedMetadata.width;
      const resizedHeight = resizedMetadata.height;

      // Definisikan ukuran border dan area teks
      const borderSize = 10; // Ukuran border di sekitar gambar
      const textAreaHeight = 100; // Tinggi area untuk teks

      // Hitung ukuran kanvas
      const canvasWidth = resizedWidth + borderSize * 2;
      const canvasHeight = resizedHeight + borderSize * 2 + textAreaHeight;

      // Buat kanvas putih dengan border
      const canvas = sharp({
        create: {
          width: canvasWidth,
          height: canvasHeight,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      });

      // Tambahkan border hitam pada gambar yang di-resize
      const borderedImageBuffer = await sharp(resizedImageBuffer)
        .extend({
          top: borderSize,
          bottom: borderSize,
          left: borderSize,
          right: borderSize,
          background: { r: 0, g: 0, b: 0, alpha: 1 }, // Warna border hitam
        })
        .toBuffer();

      // Komposit gambar ke kanvas
      const compositeImageBuffer = await canvas
        .composite([
          { input: borderedImageBuffer, top: 0, left: 0 },
        ])
        .png()
        .toBuffer();

      // Buat SVG untuk teks dengan garis tepi dan teks bold
      const svgText = `
        <svg width="${canvasWidth}" height="${textAreaHeight}">
          <rect x="0" y="0" width="${canvasWidth}" height="${textAreaHeight}" fill="white" stroke="black" stroke-width="2"/>
          <text x="${canvasWidth / 2}" y="40" font-size="24" font-weight="bold" text-anchor="middle" fill="black" stroke="white" stroke-width="1">
            ${henkaten.name || "Nama"}
          </text>
          <text x="${canvasWidth / 2}" y="80" font-size="20" font-weight="bold" text-anchor="middle" fill="black" stroke="white" stroke-width="1">
            ${henkaten.noreg || "NoReg"}
          </text>
        </svg>
      `;
      const svgBuffer = Buffer.from(svgText);

      // Tambahkan teks ke kanvas di bawah gambar
      const finalImageBuffer = await sharp(compositeImageBuffer)
        .composite([
          { input: svgBuffer, top: resizedHeight + borderSize * 2, left: 0 },
        ])
        .png()
        .toBuffer();

      // Tambahkan border luar seperti tabel
      const finalImageWithBorder = await sharp(finalImageBuffer)
        .extend({
          top: 5,
          bottom: 5,
          left: 5,
          right: 5,
          background: { r: 0, g: 0, b: 0, alpha: 1 }, // Warna border hitam
        })
        .toBuffer();

      // Simpan gambar akhir ke file
      await sharp(finalImageWithBorder)
        .toFile(outputImagePath);

      // Perbarui path di database
      await prisma.manPowerImage.update({
        where: {
          id: id,
        },
        data: {
          pathEdited: `modified_${henkaten.path}`,
        },
      });

      return {
        success: true,
        pathEdited: `${process.env.HOST}/files/img/mp/modified_${henkaten.path}`,
      };
    }

    return henkaten;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

module.exports = generateMPImage;
