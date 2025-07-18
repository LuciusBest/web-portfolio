document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  if (!main) return;

  async function fetchListing(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const base = new URL(url, window.location.href);
      return Array.from(doc.querySelectorAll('a'))
        .map(a => {
          const href = new URL(a.getAttribute('href'), base).pathname;
          const relative = href.startsWith(base.pathname)
            ? href.slice(base.pathname.length)
            : href.replace(/^\//, '');
          return relative;
        })
        .filter(h => h && !h.startsWith('?') && h !== '../');
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function buildProjects() {
    const folders = await fetchListing('assets/');
    for (const href of folders) {
      if (!href.endsWith('/')) continue;
      const folder = href.replace(/\/$/, '');
      const items = await fetchListing(`assets/${folder}/`);
      const images = items.filter(name => /\.(png|jpe?g)$/i.test(name));

      const section = document.createElement('section');
      section.className = 'project-container';
      const row = document.createElement('div');
      row.className = 'image-row';

      images.forEach(file => {
        const img = document.createElement('img');
        img.src = `assets/${folder}/${file}`;
        img.alt = `${folder} ${file}`;
        row.appendChild(img);
      });

      section.appendChild(row);
      main.appendChild(section);
    }
  }

  buildProjects();
});
