# web-portfolio

This site dynamically builds a gallery from folders under `assets/`. Because the
images are stored outside the repository, run the generator script after
creating a local `assets` symlink:

```bash
npm run generate
```

This script scans the folders under `assets/` and writes `data/projects.json`,
which is loaded by the front-end to build the gallery.
