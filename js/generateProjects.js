// Generates project containers and images from the assets folder.
// If directory listing is available on the server, it will fetch
// the folder structure. Otherwise it falls back to a predefined list.

async function getProjects() {
    try {
        const parser = new DOMParser();
        const rootRes = await fetch('assets/');
        if (!rootRes.ok) throw new Error('no directory listing');
        const rootHtml = await rootRes.text();
        const rootDoc = parser.parseFromString(rootHtml, 'text/html');
        const folders = Array.from(rootDoc.querySelectorAll('a'))
            .map(a => a.getAttribute('href'))
            .filter(href => href && href.endsWith('/') && href !== '../')
            .map(href => href.replace(/\/$/, ''));
        const projects = {};
        for (const folder of folders) {
            const res = await fetch(`assets/${folder}/`);
            if (!res.ok) continue;
            const html = await res.text();
            const doc = parser.parseFromString(html, 'text/html');
            const files = Array.from(doc.querySelectorAll('a'))
                .map(a => a.getAttribute('href'))
                .filter(href => href && !href.endsWith('/') && !href.startsWith('?'));
            if (files.length) {
                projects[folder] = files;
            }
        }
        if (Object.keys(projects).length > 0) {
            return projects;
        }
        throw new Error('empty projects');
    } catch (err) {
        console.warn('Falling back to static project list:', err);
        return {
            OBI_STRIPE: [
                'OBI_STRIPE_IMG01.png',
                'OBI_STRIPE_IMG02.png',
                'OBI_STRIPE_IMG03.png',
                'OBI_STRIPE_IMG04.png',
                'OBI_STRIPE_IMG05.png'
            ],
            LOTTOFPRINTS: [
                'LOTTOFPRINTS_02.jpg',
                'LOTTOFPRINTS_03.jpg',
                'LOTTOFPRINTS_04.jpg',
                'LOTTOFPRINTS_05.jpg',
                'LOTTOFPRINTS_06.jpg',
                'LOTTOFPRINTS_07.jpg',
                'LOTTOFPRINTS_08.jpg'
            ],
            SENS_UNIK: [
                'SENS_UNIK_IMG_01.png'
            ],
            SYNTHETIC_ORGANIC: [
                'KushletMains_01.jpg',
                'Kushlet_Topview1.jpg',
                'Kushlet_Topview2.jpg',
                'Kushlet_Topview3.jpg',
                'KushletMains_02.jpg',
                'Kushlet_Topview4.jpg',
                'Kushlet_Topview5.jpg',
                'Kushlet_Topview6.jpg',
                'Kushlet_Topview7.jpg'
            ],
            V_KEYBOARD: [
                'Keyboard_3DRender_0.jpg',
                'Keyboard_3DRender_1.jpg',
                'Keyboard_3DRender_2.jpg',
                'Keyboard_3DRender_3.jpg',
                'Keyboard_3DRender_4.jpg'
            ]
        };
    }
}

async function generateProjects() {
    const container = document.querySelector('.main_container');
    if (!container) return;
    const projects = await getProjects();
    Object.entries(projects).forEach(([folder, files]) => {
        const projDiv = document.createElement('div');
        projDiv.className = 'project_container';
        files.forEach(file => {
            const img = document.createElement('img');
            img.src = `assets/${folder}/${file}`;
            img.alt = folder.replace(/_/g, ' ');
            projDiv.appendChild(img);
        });
        container.appendChild(projDiv);
    });
}

document.addEventListener('DOMContentLoaded', generateProjects);
