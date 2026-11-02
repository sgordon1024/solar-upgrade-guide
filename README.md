# Solar field guide

An illustrated, mobile-friendly planning guide for an 800 W van solar upgrade. One action per page, with local progress and notes. No dependencies, analytics, account, or backend.

## Live guide

https://sgordon1024.github.io/solar-upgrade-guide/

## Safety and scope

**This is not an approved installation manual.** Six preparation pages can be completed. Twelve later pages are explicitly locked previews for qualified installer planning; no UI control can approve or complete them. Reading progress never implies electrical isolation or structural approval.

The concept retains a Victron SmartSolar 150/35 and uses four HQST HSP200N-64L 200 W panels in series. Actual mounting, clearances, road and wind loads, disconnect ratings/topology, wiring, connector families, protection, bonding and safe isolation remain unresolved. Sources and the exact evidence checklist are built into the guide. HQST's linked PDF is a datasheet, not a detailed installation procedure.

All illustrations are custom conceptual SVGs, not construction drawings. They do not prescribe fasteners, torque, wiring polarity, isolation order or fuse sizes. No personal photos or private account details are published.

## Use

Open `index.html`, or serve this directory with `python3 -m http.server 8765`. GitHub Pages serves the root of `main`. There is no build step.

Use Back/Next or All steps. Mark preparation tasks done separately from viewing a page; click again to undo. Notes and the last step save in localStorage per browser/device. Clearing browser data erases them. If storage is unavailable, a visible warning explains that state lasts only for the current page session. Installation holds remain fixed regardless of stored state.

## Update

Edit `app.js` for step content and conceptual SVGs, `style.css` for presentation, and `index.html` for source references and the open-questions checklist. Preserve hard holds until a reviewed revision incorporates verified model-specific procedures. The current app intentionally offers no self-approval mechanism.

## Verification

Browser checks cover all 18 pages at 375, 390 and 1280 px; no horizontal overflow; SVG presence; blocked-step completion; mark/undo; notes and reload/resume; browser history; reset and cancellation; overview; Escape dismissal; and unavailable-storage fallback. See `QA.md` for final verification record.

## Layout correction — 2 November 2026

Starlink is on the vehicle driver side; the exhaust fan is on the centerline. Roof diagrams label FRONT/REAR and DRIVER/PASSENGER. Panel 2 is now an amber tentative footprint: its separation from Starlink and clearance above the fan are unverified. No exact offsets are inferred from the supplied screenshot, which shows the prior guide rather than a measured roof. Existing notes/place remain; the previous layout-review check resets once so the corrected concept can be reviewed. All installation holds remain.
