const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Function to create a canvas and draw the icon
function drawIcon(size, backgroundColor = '#ffffff') {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Main computer shape
  ctx.fillStyle = '#1e40af';
  const monitorWidth = size * 0.7;
  const monitorHeight = size * 0.5;
  const x = (size - monitorWidth) / 2;
  const y = (size - monitorHeight) / 2;
  
  // Monitor
  ctx.fillRect(x, y, monitorWidth, monitorHeight);
  
  // Stand
  const standWidth = monitorWidth * 0.2;
  const standHeight = size * 0.15;
  ctx.fillRect(
    (size - standWidth) / 2,
    y + monitorHeight,
    standWidth,
    standHeight
  );

  // Base
  const baseWidth = monitorWidth * 0.4;
  const baseHeight = size * 0.05;
  ctx.fillRect(
    (size - baseWidth) / 2,
    y + monitorHeight + standHeight,
    baseWidth,
    baseHeight
  );

  return canvas;
}

// Generate and save icons
const icons = [
  { name: 'icon.png', size: 1024 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'splash.png', size: 2048 },
  { name: 'favicon.png', size: 32 }
];

icons.forEach(({ name, size }) => {
  const canvas = drawIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../assets', name), buffer);
  console.log(`Generated ${name}`);
}); 