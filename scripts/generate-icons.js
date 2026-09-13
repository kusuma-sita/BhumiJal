import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, drawFn) {
  // Pre-calculate scanlines
  const rowBytes = 1 + width * 4;
  const buffer = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    buffer[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      buffer[pixelOffset] = r;
      buffer[pixelOffset + 1] = g;
      buffer[pixelOffset + 2] = b;
      buffer[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(buffer);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const toCrc = Buffer.concat([typeBuf, data]);

    // CRC-32
    let c = 0 ^ -1;
    for (let i = 0; i < toCrc.length; i++) {
      c = (c >>> 8) ^ table[(c ^ toCrc[i]) & 0xff];
    }
    c = (c ^ -1) >>> 0;

    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(c, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Precompute CRC32 table
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let curr = i;
    for (let j = 0; j < 8; j++) {
      if ((curr & 1) !== 0) {
        curr = (0xedb88320 ^ (curr >>> 1)) >>> 0;
      } else {
        curr = curr >>> 1;
      }
    }
    table[i] = curr;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // Color type 6 (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Brand color palette
// Teal primary #0f766e, Dark #042f2e, Water #0284c7, Leaf #22c55e, Gold #f59e0b

function drawBrandIcon(x, y, w, h, isMaskable = false) {
  // Normalize coordinates to 0..1
  const nx = x / w;
  const ny = y / h;

  // Background
  let bgR = Math.round(4 + (15 - 4) * ny);
  let bgG = Math.round(47 + (118 - 47) * ny);
  let bgB = Math.round(46 + (110 - 46) * ny);
  let bgA = 255;

  if (!isMaskable) {
    // Rounded corner for standard icons
    const cornerR = 0.2;
    const dx = Math.abs(nx - 0.5);
    const dy = Math.abs(ny - 0.5);
    if (dx > 0.5 - cornerR && dy > 0.5 - cornerR) {
      const dist = Math.hypot(dx - (0.5 - cornerR), dy - (0.5 - cornerR));
      if (dist > cornerR) {
        return [0, 0, 0, 0];
      }
    }
  }

  // Center coordinate
  const cx = nx - 0.5;
  const cy = ny - (isMaskable ? 0.5 : 0.54);
  const scale = isMaskable ? 0.75 : 0.9;

  // Scaled coordinates
  const sx = cx / scale;
  const sy = cy / scale;

  // Water drop formula: r(theta) or distance check
  // Drop apex at sy = -0.38, round bottom at sy = 0.15, radius 0.25
  const dropCenterY = 0.12;
  const dropRadius = 0.26;
  const distToBottom = Math.hypot(sx, sy - dropCenterY);

  let isInsideDrop = false;
  if (distToBottom <= dropRadius) {
    isInsideDrop = true;
  } else if (sy < dropCenterY && sy > -0.35) {
    const widthAtY = dropRadius * (1 - (dropCenterY - sy) / 0.47);
    if (Math.abs(sx) <= Math.max(0.01, widthAtY)) {
      isInsideDrop = true;
    }
  }

  if (isInsideDrop) {
    // Water drop coloring: Sky blue to deep cyan
    const dropT = (sy + 0.35) / 0.7;
    let r = Math.round(56 + (2 - 56) * dropT);
    let g = Math.round(189 + (132 - 189) * dropT);
    let b = Math.round(248 + (199 - 248) * dropT);

    // Plant sprout in center of drop
    // Left leaf
    const dLeftLeaf = Math.hypot(sx + 0.08, sy - 0.08);
    const dRightLeaf = Math.hypot(sx - 0.08, sy - 0.12);
    const dStem = Math.abs(sx) < 0.02 && sy > -0.15 && sy < 0.22;

    if (dLeftLeaf < 0.075 || dRightLeaf < 0.07) {
      // Leaf green
      return [34, 197, 94, 255];
    }
    if (dStem) {
      // Golden sprout stem
      return [250, 204, 21, 255];
    }

    // Highlight sheen on top-left of drop
    if (sx < -0.06 && sy < dropCenterY && sx > -0.18) {
      r = Math.min(255, r + 50);
      g = Math.min(255, g + 50);
      b = Math.min(255, b + 40);
    }

    return [r, g, b, 255];
  }

  // Soil curve at bottom
  if (sy > 0.38) {
    return [217, 119, 6, 255];
  }

  return [bgR, bgG, bgB, bgA];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
console.log('Generating PWA icons...');

fs.writeFileSync(
  path.join(publicDir, 'pwa-192x192.png'),
  createPng(192, 192, (x, y, w, h) => drawBrandIcon(x, y, w, h, false))
);

fs.writeFileSync(
  path.join(publicDir, 'pwa-512x512.png'),
  createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, false))
);

fs.writeFileSync(
  path.join(publicDir, 'pwa-maskable-512x512.png'),
  createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, true))
);

fs.writeFileSync(
  path.join(publicDir, 'apple-touch-icon.png'),
  createPng(180, 180, (x, y, w, h) => drawBrandIcon(x, y, w, h, false))
);

// Minimal 32x32 for favicon.ico
fs.writeFileSync(
  path.join(publicDir, 'favicon.ico'),
  createPng(32, 32, (x, y, w, h) => drawBrandIcon(x, y, w, h, false))
);

console.log('Successfully generated all PWA icons!');
