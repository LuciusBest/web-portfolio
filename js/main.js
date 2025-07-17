
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

async function initGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const basePath = 'assets/';

  try {
    const folders = await getSubfolders(basePath);
    for (const folder of folders) {
      try {
        const folderPath = `${basePath}${folder}/`;
        const images = await getImages(folderPath);
        const project = createProject(images, folderPath);
        gallery.appendChild(project);
      } catch (err) {
        console.error(`Failed to load images for ${folder}:`, err);
      }
    }
  } catch (err) {
    console.error('Failed to initialize gallery:', err);
  }
}

async function fetchHTML(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status}`);
  }
  return response.text();
}

function parseLinks(html, filter) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('a')]
    .map(a => a.getAttribute('href'))
    .filter(href => href && filter(href));
}

async function getSubfolders(path) {
  const html = await fetchHTML(path);
  return parseLinks(html, href => href.endsWith('/') && href !== '../')
    .map(href => href.replace(/\/$/, ''));
}

async function getImages(path) {
  const html = await fetchHTML(path);
  return parseLinks(html, href => /\.(png|jpe?g|gif|webp|svg)$/i.test(href));
}

function createProject(images, folderPath) {
  const container = document.createElement('div');
  container.className = 'project';

  images.forEach(name => {
    const img = document.createElement('img');
    img.src = `${folderPath}${name}`;
    img.alt = name;
    img.loading = 'lazy';
    container.appendChild(img);
  });

  return container;
}

