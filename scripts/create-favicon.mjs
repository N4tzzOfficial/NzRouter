import sharp from "sharp";
import fs from "fs";
import path from "path";

// Create a simple ICO file manually
// ICO format: 6-byte header + directory entries + image data

async function createFavicon() {
  const inputPath = "public/nzrouter-logo.png";
  const outputPath = "public/favicon.ico";

  // Create 16x16 and 32x32 PNGs
  const png16 = await sharp(inputPath)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const png32 = await sharp(inputPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // ICO header (6 bytes)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved (0)
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(2, 4); // Count (2 images)

  // Directory entries (16 bytes each)
  const dir1 = Buffer.alloc(16);
  dir1.writeUInt8(16, 0);  // Width
  dir1.writeUInt8(16, 1);  // Height
  dir1.writeUInt8(0, 2);   // Color count (0 = no palette)
  dir1.writeUInt8(0, 3);   // Reserved
  dir1.writeUInt16LE(1, 4); // Color planes
  dir1.writeUInt16LE(32, 6); // Bits per pixel
  dir1.writeUInt32LE(png16.length, 8); // Size of image data
  dir1.writeUInt32LE(6 + 16 * 2, 12); // Offset of image data

  const dir2 = Buffer.alloc(16);
  dir2.writeUInt8(32, 0);  // Width
  dir2.writeUInt8(32, 1);  // Height
  dir2.writeUInt8(0, 2);   // Color count
  dir2.writeUInt8(0, 3);   // Reserved
  dir2.writeUInt16LE(1, 4); // Color planes
  dir2.writeUInt16LE(32, 6); // Bits per pixel
  dir2.writeUInt32LE(png32.length, 8); // Size of image data
  dir2.writeUInt32LE(6 + 16 * 2 + png16.length, 12); // Offset of image data

  const ico = Buffer.concat([header, dir1, dir2, png16, png32]);
  fs.writeFileSync(outputPath, ico);

  console.log("Favicon created at:", outputPath);
}

createFavicon().catch(console.error);