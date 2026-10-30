# HOSTEL360

**A smarter way to live, connect & manage.**

Working browser-only hostel management prototype for a Java/OOP college project. HTML, CSS and vanilla JavaScript; no installation, build tools or Java server required.

## Start locally

Open `index.html` in your browser. For consistent browser storage, use VS Code Live Server, or run `python -m http.server 8000` in this folder and visit http://localhost:8000.

Demo login: **STU1024 / demo123**. Choose Student, Warden or Maintenance Staff. The role switcher supports a classroom demonstration.

## Upload to GitHub (no terminal)

1. Extract this ZIP fully.
2. Create an empty GitHub repository called `HOSTEL360`.
3. Choose **uploading an existing file** (or **Add file > Upload files**).
4. Upload the contents of this HOSTEL360 folder, rather than the ZIP or the outer folder. `index.html` must appear at the repository root.
5. Commit the files to `main`.
6. Open **Settings > Pages**. Set **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**, then Save.
7. Wait for GitHub to display the published website link in Pages settings.

For free GitHub Pages hosting with GitHub Free, use a public repository. Check your plan before publishing a private repository.

## Push with Git (alternative)

Create an empty repository first. From the extracted folder containing index.html:

```sh
git init
git add .
git commit -m "Add HOSTEL360 working demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/HOSTEL360.git
git push -u origin main
```

Replace YOUR-USERNAME. Authenticate through GitHub's supported sign-in when prompted; do not put tokens or passwords in project files.

## Optional GitHub Actions deployment

A `.github/workflows/deploy-pages.yml` workflow is included. If you push all files with Git, choose **Settings > Pages > Source: GitHub Actions** instead of branch deployment. Then rerun the workflow from the Actions tab or push a commit. Use one deployment method. Browser drag-and-drop may omit hidden files; branch deployment above works without the workflow.

## Features

- Personal student dashboard and room details
- Normal outings, special outings, extended leave and guardian communication
- Editable regular outing hours (demo default 09:00–22:00 IST)
- Return check-in, late/overdue records, searchable register and printable reports
- Rule-based complaint priority and maintenance task tracking
- SOS demonstration linked to current outing details
- Visitors, mess feedback, fees, notices and editable profile
- Student, Warden and Maintenance Staff demonstration workspaces
- Responsive layouts and browser-local persistence

## Files

| File | Purpose |
| --- | --- |
| index.html | Main entry page |
| styles.css, campus.css | Layout and light campus theme |
| data.js | Sample records, persistence and complaint rules |
| app.js | Navigation, forms and shared module behavior |
| movement-data.js | Outing policy, movement records and timing rules |
| movement.js | Outing forms, register, return and reports |
| campus.js | Campus dashboards, contextual views and module refinements |
| docs/PROJECT-GUIDE.md | Detailed demonstration flow and Java/OOP mapping |
| .github/workflows/deploy-pages.yml | Optional GitHub Pages deployment |

## Demo boundaries

This is the restored working **frontend demo**, not the later five-role Java backend project. Login and role controls are simulated; they are not secure authentication or RBAC. Records remain in this browser and are not shared across devices. Use fictional data only. SOS notifications, contacts and payments are demonstrations; no real messages, calls, payments or GPS are used. Do not use this version for real hostel records.

The separate Java RBAC project requires a running Java server. GitHub Pages cannot execute that backend.

## Troubleshooting

- **404:** Ensure index.html is at the repository root, and Pages points to main / root.
- **Missing styling:** Upload every CSS and JavaScript file alongside index.html with the original filenames.
- **Old screen:** Hard refresh with Ctrl+Shift+R.
- **Records differ between devices:** Browser storage is local to each browser and website origin.
- **Java API error:** This package does not use the Java API. Make sure you uploaded this package rather than the later Java-dependent frontend.

GitHub references: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site and https://github.com/actions/starter-workflows/blob/main/pages/static.yml
