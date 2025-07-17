
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

async function initGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  try {
    const projects = await loadProjects();
    for (const { folder, images } of projects) {
      const folderPath = `assets/${folder}/`;
      const project = createProject(images, folderPath);
      gallery.appendChild(project);
    }
  } catch (err) {
    console.error('Failed to initialize gallery:', err);
  }
}

async function loadProjects() {
  const response = await fetch('data/projects.json');
  if (!response.ok) {
    throw new Error(`Failed to fetch project list: ${response.status}`);
  }
  return response.json();
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


