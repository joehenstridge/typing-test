# Ready, Set, Learn (v6)

Free typing, spelling and maths practice for children in UK Years 2 to 6.
A static site with no build step, no tracking and no third-party requests.

## Pages
- `index.html`: home screen with the three activities
- `typing.html`: typing test with Starter, Explorer and Challenge passages. Passages rotate, so each test starts on new text
- `spelling.html`: Years 2 to 6, using the English national curriculum spelling lists. The word shows for 3, 5 or 8 seconds and is read aloud. Then the child drags, taps or types the letter tiles into order. Years 4 to 6 add 1 or 2 decoy letters
- `maths.html`: Years 2 to 6. Adding, taking away, times tables and dividing, with times tables you can choose. On-screen keypad for tablets

No accounts, cookies, analytics or adverts. Nothing is sent anywhere. Scores stay in the browser's localStorage on that device only, and can be cleared from the home page. A light/dark switch sits in every page header.

## Deploying to GitHub Pages
1. Create a new public repository on GitHub, e.g. `ready-set-learn`.
2. Push these files to `main`:
   ```
   git init -b main
   git add .
   git commit -m "Ready, Set, Learn v6"
   git remote add origin https://github.com/<you>/ready-set-learn.git
   git push -u origin main
   ```
3. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/pages.yml` deploys every push to `main`.
   The site appears at `https://<you>.github.io/ready-set-learn/`.

All links are relative, so the site also works on a custom domain.

## Editing content
- Typing passages: `typing.html`, search for `const PASSAGES=`
- Spelling words: `spelling.html`, search for `const WORDS=` (keys "2" to "6")
- Maths difficulty: `maths.html`, functions `addPair`, `mulPair` and `divPair`

## Notes
- Read-aloud uses the browser's built-in speech (Web Speech API) and prefers a British English voice.
  It works in current Chrome, Edge and Safari, including on iPad. If a device has no voice, the button is disabled.
- Fonts (Archivo, JetBrains Mono) are bundled under the SIL Open Font License.
