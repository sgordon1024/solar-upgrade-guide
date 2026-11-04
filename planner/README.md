# Rooflab — Sprinter shell study

[Open Rooflab](https://sgordon1024.github.io/solar-upgrade-guide/planner/) · [Shell specifications](shell-specs.json) · [Roof layout specifications](starter-specs.json)

An original browser-based reconstruction of a 144-inch-wheelbase, high-roof Sprinter cargo shell. This revision uses 33 supplied reference images, including front/rear/side/top renders and wireframe views. The archive contained image files, not an editable 3D model. Reference pixels were inspected privately; images, background information and identifying metadata are not published.

## Current scope and accuracy

The initial view shows the **Sprinter shell with rear sleeping flares**. The driver-side flare includes the small rounded tinted window visible in the owner photos; the passenger-side flare has a solid painted face. Uncheck **Sleeping flares · estimated** to inspect the stock shell. Other camper windows, aftermarket wheels, rack, awning, ladders and rear carrier are deferred. Body paint is a bluer gray revised after owner feedback and checked in the actual passenger-side render against the owner photo; the factory paint code has not been verified. Existing roof layouts remain saved; enable **Show roof equipment** to return to editing them.

This is a manually constructed polygon mesh, **not factory CAD, photogrammetry, an exact replica or a calibrated scan**. The continuous roof/cab loft, pressed side panels, door seams, windscreen, headlights, grille, bumper, rear doors, roof ribs and stock wheels were compared with corresponding reference views. Five front/rear/driver/passenger/top image overlays used uniform scale and translation, with side views anchored to the wheelbase. They drove corrections to the joined rear closure, windshield elevation and plan curvature, cab seams, mirrors, antenna and wrapped headlights. Oblique views and an independent agent review checked the result. Fine grille/lamp relief, stamped panels, seams, tires and stance still differ. Visual review does not establish a dimensional tolerance.

The axle centers are exactly 144 inches apart in the software, using the owner's reported configuration. Body width is estimated at 79.5 inches without mirrors. The former 82-inch value described an approximate camper envelope, not a verified bare shell. The exterior length is scaled to a nominal 234 inches while preserving axle spacing; mirrors target the reference screenshot’s approximately 92.3-inch width. These are reconstruction targets, not a survey of the owner’s chassis. Tire size, suspension stance, roof shape and all surface contours remain estimates. The supplied manufacturer-page screenshot describes a 2026 vehicle and is not presented as 2023 chassis-specific verification.

Flare footprint, projection, window size and placement are photo estimates recorded in `shell-specs.json`; none is a verified measurement. The flare visibility switch is a view control and is separate from roof-layout export/import.

The separate 60 × 122-inch roof planning rectangle remains owner-measured and track-referenced. Its registration to the body is unresolved. **The visible shell is not a mounting or clearance reference.** No physical fit or safe installation is established by this renderer.

## Views and controls

Choose 3D, Front, Driver, Passenger, Rear or Top for matching-angle inspection. Drag to orbit, pinch or use +/- to zoom; right-drag to pan. Arrow keys rotate and +/- zoom when the canvas has focus. Reset camera restores the default view. Dimensions and wireframe are optional inspection overlays. Top is the whole shell; Roof plan, available with equipment enabled, isolates the measured planning rectangle.

The scene uses local Three.js modules, physically lit materials and a generated studio environment. Static shell parts are batched by material for a small number of draw calls. It renders on interaction rather than an idle animation loop, caps pixel ratio and respects reduced-motion preferences. Desktop and mobile emulation checks are recorded in [QA.md](QA.md); performance on a physical phone has not been benchmarked.

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
4. For each sleeping flare, measure its front/rear and top/bottom edges from a marked body reference, outward projection perpendicular to the original side panel, and the window opening separately.
5. Include mounts and open fan envelope. Use independent check distances to assess model error before assigning a tolerance.

## Run and license

Serve the repository with `python3 -m http.server 8765` and open `/planner/`. No build step. `shell-model.js` contains the original parameterized mesh; `render3d.js` contains the scene and controls. `shell-specs.json` records the reconstruction's provenance and limits. Roof JSON export/import continues to transfer editable equipment, not the detailed shell mesh.

Original planner code and model geometry use the MIT license in LICENSE. Three.js 0.170.0 and OrbitControls use `vendor/THREE-LICENSE.txt`. This does not relicense supplied images, manufacturer trademarks or the rest of the repository. No external vehicle mesh, private imagery, VIN, credentials, analytics or vehicle-control connection is included.
