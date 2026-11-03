# Rooflab — photo-informed van planner

[Open Rooflab](https://sgordon1024.github.io/solar-upgrade-guide/planner/) · [Download starter specs](https://sgordon1024.github.io/solar-upgrade-guide/planner/starter-specs.json)

A browser-based modification planner for a 2024 Entegra Launch 19Y on an owner-reported 2023 Sprinter 2500, 144-inch wheelbase. Original exterior geometry is informed by four owner exterior photographs and one overhead reference, inspected in actual pixels. The images themselves, their backgrounds and identifying metadata are not distributed.

## Accuracy and scope

This is a manually modeled visual approximation, **not photogrammetry, factory CAD or a calibrated scan**. It is more detailed than the earlier block model, but has not achieved a near-exact photo match. Body contours, wheel/tire dimensions, suspension stance, rack, awning, ladders, windows, rear carrier and motorcycle remain estimates. Side views reproduce the observed asymmetric windows and accessory placement. Rear gear can be hidden.

Axle spacing is modeled at the owner-reported 144 inches. The approximate body envelope is 234 × 82 inches; neither this nor visual details establishes mounting locations. The roof planning rectangle is separately recorded as the owner's measured 60 × 122 inches. Its endpoints and registration to the body/rack remain unresolved. **Do not use the visually positioned rack or body as a measurement reference.** Decorative rack members, ladders, awning and rear gear are excluded from collision checks and editable JSON geometry.

The updated starter includes four solar panels, Starlink, fan, A/C and a roof bag seen in the references. All their footprints, positions and heights are estimates. In particular, the illustrative panel height of 6.5 inches does not resolve the owner's crossbar reference ambiguity. No manufacturer-verified equipment geometry is preloaded. Preserve and resolve the measurement notebook before planning installation.

## Views and controls

The lit WebGL scene uses locally hosted Three.js, with orbit, driver, passenger, rear and roof-plan views. Drag or use arrow keys to rotate; pinch or use +/- to zoom. Roof plan locks rotation and displays the planning boundary with a 12-inch grid. Equipment labels, boundary and rear gear have separate visibility controls. The displayed color/material resembles the equipment; provenance appears in the list and fine envelope outlines. Selecting an item highlights its envelope.

Camera preset motion respects reduced-motion preferences. Rendering happens on interaction or resize, not in a continuous idle animation loop. Pixel ratio and shadow resolution are capped for mobile devices. WebGL is required for the scene; measurement forms and export remain usable if graphics initialization fails.

## Measurements and checks

Units are inches. Origin is the front driver-side corner of the planning rectangle. X increases toward passenger side, Y toward rear, Z above roof datum. X/Y specify the minimum corner of an item's axis-aligned envelope; Z its bottom. Rotation supports 0° and 90°, swapping width/length while retaining that corner.

Checks compare equipment bounding boxes and planning-rectangle edges, not the detailed visual meshes. Touching counts as a conflict. Clearance expands **each** box on X/Y/Z, so the distance between two boxes must exceed twice the entered margin. The margin also applies to X/Y boundary checks. There is no established maximum roof height.

The system does not check decorative exterior geometry, brackets, wiring, full movement sweeps, roof curvature, shading, Starlink field of view, airflow, waterproofing, wind loads, structural strength or manufacturer service zones. Raising Z may remove a box conflict without providing usable clearance or safe supports. “No box conflicts” is not a fit certification.

## Saved layouts and sharing

Edits save in local browser storage. Existing saved layouts are preserved through this upgrade: they are **not** silently replaced with the new photo-informed starter. Export a backup, then choose Reset layout to load the updated starter if desired. Reset requires confirmation.

Select an item to edit dimensions, rotation, X/Y/Z and evidence. Changing a dimension or position resets its affected provenance to estimated. Measured/manufacturer labels are user assertions; record supporting measurements or specific model documentation. Notes save as typed; fields save on change.

Export downloads `rooflab-specs.json`; import validates before replacing the saved layout. Version 1 uses `schema: "rooflab"`, `units: "in"`, roof dimensions/evidence/status, `clearance`, `notes`, observations and items. Items contain unique IDs, names, types, X/Y/Z, width/length/height, 0/90 rotation, dimension/position provenance and evidence. Limits: 250 KB, 60 items, finite bounded values. Invalid imports leave the current layout intact. Unknown fields are discarded; vehicle identity and historical observations use the fixed model context. JSON transfers planning geometry, not the decorative exterior mesh.

No accounts, analytics, remote asset requests or connection to vehicle controls. Review free-text notes before sharing. Other owners can fork the source and adapt the model; vehicle identity is fixed in this release.

## Next measurements

1. Identify the physical front driver-side reference in a marked photo; confirm both endpoints of the 122-inch length and 60-inch width.
2. From that same reference measure each item's front edge, driver-side edge, full mounted footprint, and bottom/top height above a shared roof datum.
3. Record rail section, rail elevation, crossbar positions and which surface the 6.5-inch measurement reaches. Identify “top rail” in the 4-inch observation.
4. Include mounts and open fan envelope. Use independent check distances to assess model error before assigning a tolerance.

## Run and license

Serve with `python3 -m http.server 8765`, then open `/planner/`. No build step. App files are `index.html`, `style.css`, `app.js`, `render3d.js`, `starter-specs.json`, and `vendor/`.

Original planner code and geometry use the MIT license in LICENSE. Three.js 0.170.0 and OrbitControls are vendored under their own MIT license in `vendor/THREE-LICENSE.txt`; the OrbitControls import is changed to a local relative module path. This does not relicense the rest of the repository, supplied photographs or manufacturer trademarks.
