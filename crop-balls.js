const sharp = require('sharp')
const path = require('path')

const src = path.join(__dirname, '..', '..', '..', '..', 'AppData', 'Local', 'Temp', 'claude', '3f352b523f3118e4', 'df314592-63f3-41df-ad88-54498937d7c3', 'images', '19.png')
const outDir = path.join(__dirname, 'frontend', 'public', 'balls')

const cols = 4
const rows = 3

const names = [
  'bowling', 'basketball', 'baseball', 'badminton',
  'golf', 'tennis', 'volleyball', 'football',
  'billiard', 'soccer', 'cricket', 'hockey'
]

const picks = [1, 2, 5, 6, 7, 9, 11]

async function run() {
  const meta = await sharp(src).metadata()
  const cellW = Math.floor(meta.width / cols)
  const cellH = Math.floor(meta.height / rows)
  console.log(`Image: ${meta.width}x${meta.height}, cell: ${cellW}x${cellH}`)

  for (const idx of picks) {
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const name = names[idx]
    await sharp(src)
      .extract({ left: col * cellW, top: row * cellH, width: cellW, height: cellH })
      .png()
      .toFile(path.join(outDir, name + '.png'))
    console.log(`Saved ${name}.png`)
  }
}

run().catch(console.error)
