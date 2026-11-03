# Rooflab — open van layout planner

[Open the planner](https://sgordon1024.github.io/solar-upgrade-guide/planner/) · [Download starter specs](https://sgordon1024.github.io/solar-upgrade-guide/planner/starter-specs.json)

An editable, mobile-friendly, dependency-free 3D roof concept model for a 2024 Entegra Launch 19Y on an owner-reported 2023 Sprinter 2500, 144-inch wheelbase. Rotate the view, switch to roof plan or side view, edit equipment, add solar panels/custom boxes/crossbars, and export/import JSON. Everything stays in your browser; there is no connection to vehicle controls.

## What is known

The owner measured a 122-inch track-referenced length and 60-inch width. Starlink is on the driver side and the fan is centered. The measurement notebook preserves additional owner observations without forcing inconsistent or unresolved reference points into roof-datum coordinates. The reported 4-inch lower-side-rail-center to upper-rail-bottom measurement remains unresolved.

**The initial equipment footprints, elevations and exact positions are demonstration estimates.** A/C, fan and Starlink models/installed envelopes are not established. Inventory is incomplete, including existing solar panels and rack members. No manufacturer-verified geometry is preloaded. The whole van is an original low-poly Sprinter-style exterior study, not factory CAD. Axle spacing is 144 inches; overall body dimensions are an approximate 234 × 82 inches. Windows, cab contours, tires, ride height, trim and placement of the planning rectangle on the body are estimated. Aftermarket suspension may change the actual stance. No third-party mesh, VIN, private photograph, engine or interior is included.

## Coordinates and checks

All geometry uses inches. Origin is the front driver-side corner of the planning rectangle. X increases toward passenger side, Y toward rear, Z above roof datum. X/Y locate the minimum corner of an item's axis-aligned envelope; Z locates its bottom. Rotation supports 0° and 90°, swapping width/length while keeping that corner fixed.

The model uses an orthographic projection of an original polygon exterior and equipment envelopes onto a Canvas 2D surface. Drag rotates the camera; arrow keys rotate; +/- and buttons zoom. Roof plan uses 12-inch grid spacing. Camera presets and zoom animate briefly; reduced-motion preferences disable animation. The forest-green, paper-and-felt interface uses original CSS textures with no external asset requests. Colors encode provenance, not equipment function: amber if either size or position is estimated; blue if neither is estimated and either is manufacturer-sourced; otherwise green. Both provenance labels are visible in the equipment list.

Checks compare axis-aligned 3D boxes and planning-rectangle edges. Touching is flagged. The optional margin expands **each** box by the entered amount on all axes, so separation between two boxes must exceed twice that margin. Margin is applied to X/Y roof-edge checks; no maximum roof height is known. No collision with the illustrative body is checked. Raising a panel above an obstacle may remove a box overlap but proves neither safe mounting nor usable clearance.

Checks do not model brackets, wiring, fan sweep beyond its entered envelope, shading, Starlink view, airflow, roof curvature, waterproofing, wind loads, structural capacity or manufacturer service zones. The planning rectangle is not a certified mounting boundary. “No box conflicts” does not mean “fits.” Measure installed envelopes and use model-specific instructions before installation.

## Editing and sharing

Select equipment, then change its name, size, rotation or X/Y/Z position. Numeric geometry edits reset the affected source label to estimated; after verifying, set measured/manufacturer and record the evidence. Source labels are user assertions, not independent verification. Edits save locally after changing/leaving a field. Notes save as you type. Export creates `rooflab-specs.json`; import replaces the local layout. Export a backup first. Reset asks for confirmation.

Specs use `schema: "rooflab"`, `version: 1`, `units: "in"`, roof dimensions/provenance/evidence, `clearance`, `notes`, owner observation triples, and `items`. Each item has a unique `id`, `name`, `kind`, numeric `x/y/z/width/length/height/rotation`, `dimensionStatus`, `positionStatus` and `evidence`. Inspect the starter file for a full example. Unknown fields are discarded on import; historical observations and vehicle identity are restored from this model's fixed context, so this version targets the Launch/Sprinter configuration rather than arbitrary vehicle identities. Notes and equipment evidence are portable and preserved. Import validates type, range, schema, IDs and item count before replacing state, with a 250 KB / 60 item limit. Imported text is escaped before rendering. Nothing is uploaded.

Dimensions are editable for other owners' roof layouts. Download/fork this folder and adapt metadata for other vehicles. Review notes before sharing a file; they may contain information you do not want public.

## Run and contribute

Serve the repository with `python3 -m http.server 8765`, then open `/planner/`. No build or runtime dependencies. Files: `index.html`, `style.css`, `app.js`, `starter-specs.json`. Hosting uses the existing GitHub Pages site. The original guide's installation holds are unchanged.

Contributions should include reference endpoints, measurement provenance and model-specific source URLs, preserve import validation, and avoid uploading identifying photos, credentials or private vehicle network data.

The files in this planner directory are available under the MIT license in LICENSE. This does not relicense other repository content or grant rights to manufacturer trademarks.
