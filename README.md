# Typing Test for Kids (v4)

A static, single-page typing test for children and young people.

- Three levels: Starter, Explorer and Challenge, each with original passages
- Test length from 15 seconds to 10 minutes; adjustable text size
- Optional punctuation/capitals and number passages
- Results: words per minute, accuracy, stars and encouragement, speed chart, character breakdown, keys to practise, recent tests

## Privacy
No tracking, cookies, analytics or third-party requests (enforced by a Content-Security-Policy meta tag).
Fonts are bundled locally. Settings and recent scores stay in the browser's localStorage only.

## Deploying to GitHub Pages
1. Create a new repository on GitHub (e.g. `typing-test`). It must be public on a free plan.
2. Push these files to the `main` branch (or use "Add file > Upload files" and drag in everything, including the `.github` folder).
3. In the repository go to **Settings > Pages** and set **Source** to **GitHub Actions**.
4. The "Deploy to GitHub Pages" workflow runs on every push to `main`. Watch it under the **Actions** tab.
5. The site appears at `https://<your-username>.github.io/<repo-name>/`.

All paths are relative, so it works from a project sub-path or a custom domain.
For a custom domain, add it under Settings > Pages and tick "Enforce HTTPS".

## Files
- `index.html`: the whole app (HTML, CSS, JS)
- `fonts/`: Archivo and JetBrains Mono (SIL Open Font License)
- `favicon.svg`
- `.github/workflows/pages.yml`: GitHub Pages deploy workflow
- `.nojekyll`: serves files as-is, without Jekyll processing

## Editing passages
Search `index.html` for `const PASSAGES=` and add or change sentences under starter, explorer or challenge.
Passages containing digits only appear when "Numbers" is switched on.
