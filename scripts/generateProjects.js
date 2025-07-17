const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'projects.json');

function isImage(file) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(file);
}

function getProjects() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Assets directory not found: ${ASSETS_DIR}`);
    return [];
  }

  return fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const folder = dirent.name;
      const folderPath = path.join(ASSETS_DIR, folder);
      const images = fs.readdirSync(folderPath)
        .filter(isImage);
      return { folder, images };
    });
}

function main() {
  const projects = getProjects();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
  console.log(`Wrote ${projects.length} projects to ${OUTPUT_FILE}`);
}

main();

