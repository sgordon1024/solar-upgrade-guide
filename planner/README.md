# Rooflab — Sprinter shell study

[Open Rooflab](https://sgordon1024.github.io/solar-upgrade-guide/planner/) · [Shell specifications](shell-specs.json) · [Roof layout specifications](starter-specs.json)

An original browser-based reconstruction of a 144-inch-wheelbase, high-roof Sprinter cargo shell. This revision uses 33 supplied reference images, including front/rear/side/top renders and wireframe views. The archive contained image files, not an editable 3D model. Reference pixels were inspected privately; images, background information and identifying metadata are not published.

## Current scope and accuracy

The initial view shows the **Sprinter exterior with sleeping flares, camper windows, off-road running gear, hood lip, roof rack with front light bar, motorcycle carrier and 2021 KTM 350 SX-F**. The driver-side flare includes the small rounded tinted window visible in the owner photos; the passenger-side flare has a solid painted face. The driver-side middle window and passenger sliding-door glass include front-positioned opening panes. Uncheck **Sleeping flares · estimated** and **Camper windows · estimated** independently to inspect the underlying body. The six-fork-spoke charcoal rims, KO3-style tread and Owl/Falcon-style suspension hardware are reconstructed from references. The rear doors have two broad tinted panes with a narrow center seam. Awning, ladders and spare-tire carrier are deferred. Body paint is a bluer gray revised after owner feedback and checked in the actual passenger-side render against the owner photo; the factory paint code has not been verified. Existing roof layouts remain saved; enable **Show roof equipment** to return to editing them.

This is a manually constructed polygon mesh, **not factory CAD, photogrammetry, an exact replica or a calibrated scan**. The continuous roof/cab loft, pressed side panels, door seams, windscreen, headlights, grille, bumper, rear doors, roof ribs and stock wheels were compared with corresponding reference views. Five front/rear/driver/passenger/top image overlays used uniform scale and translation, with side views anchored to the wheelbase. They drove corrections to the joined rear closure, windshield elevation and plan curvature, cab seams, mirrors, antenna and wrapped headlights. Oblique views and an independent agent review checked the result. Fine grille/lamp relief, stamped panels, seams, tires and stance still differ. Visual review does not establish a dimensional tolerance.

The axle centers are exactly 144 inches apart in the software, using the owner's reported configuration. Body width is estimated at 79.5 inches without mirrors. The former 82-inch value described an approximate camper envelope, not a verified bare shell. The exterior length is scaled to a nominal 234 inches while preserving axle spacing; mirrors target the reference screenshot’s approximately 92.3-inch width. These are reconstruction targets, not a survey of the owner’s chassis. The installed tire designation is recorded; suspension stance, wheel details, roof shape and surface contours remain estimates. The supplied manufacturer-page screenshot describes a 2026 vehicle and is not presented as 2023 chassis-specific verification.

Flare and window inputs are recorded in `shell-specs.json`. The [Flarespace Classic Sprinter 144 specifications](https://flarespace.com/products/mercedessprinter-144flares) provide a comparison footprint of 64 × 27⅝ inches and maximum depths of 3¼ inches regular or 5¼ inches for the extended driver side. The installed product has **not** been identified. Those reference values guide the model; front projection, taper, placement, corner radii and glazing dimensions remain estimated. The flares now deepen toward the rear, with the passenger forward edge beside the sliding-door seam. Local photo/render overlays and an independent review checked both glass outlines and the small flare window. Unmatched camera perspective prevents physical calibration. These visibility switches are view controls, separate from roof-layout export/import.

The owner vehicle record identifies **BFGoodrich KO3 LT245/70R17 LR-E** tires; the listed 265/70R17 is a future option. The model uses an approximately 30.5-inch nominal diameter and 17-inch bead diameter derived from that designation. Original tread/shoulder geometry follows [BFGoodrich KO3 references](https://www.bfgoodrichtires.com/auto/tires/bfgoodrich-all-terrain-t-a-ko3); it is not an exact tire mesh. The six forked spokes are visible in the owner photos, but rim brand, width and offset are unconfirmed.

[Owl Arrow Trail 2500 references](https://owlvans.com/products/arrow-suspension-trail-2500-awd-and-4x4) guide the visible auxiliary shocks and rear leaf packs. Local wheel-photo overlays support an estimated 23-inch hub-to-arch distance, about 1.24 visible rim diameters. Matching that stance moves the hubs 4.7 inches lower than the prior generic model. **That is a rendering correction, not the actual suspension lift.** Actual lift remains unknown; photos cannot isolate factory AWD height, kit changes, load and terrain. The roof datum remains fixed and the ground plane follows the revised tires. Hardware is illustrative, without mounting, travel or clearance validation. Small lower-trim reflectors are removed at the owner's request.

The original rear accessory model follows the [HAUL-MASTER 57720 carrier](https://www.harborfreight.com/600-lb-capacity-motorcycle-carrier-57720.html) and its [assembly manual](https://manuals.harborfreight.com/manuals/57000-57999/57720-193175421548.pdf). Published reference dimensions are 83⅛ × 36¼ × 15½ inches overall, a 78¾ × 8-inch wheel platform, a 72-inch ramp and a 2-inch receiver. The passenger-side chock, open rocking cradle, stored inboard ramp, tie-down tubes and clamp are original approximations of those references. The carrier's 600 lb product rating does **not** establish this vehicle/hitch's load capacity. Receiver mounting, installed height and insertion depth are estimates because the owner's photos obscure them. The KTM is a separate original mesh; loose cargo is deferred. Uncheck **2021 KTM 350 SX-F** to inspect the empty carrier. Hiding **Motorcycle carrier** also hides the bike and disables its toggle until the carrier is restored, preserving your bike visibility choice. Uncheck **Motorcycle carrier** to inspect the receiver; the camera reframes the resulting envelope. Product and installation provenance are separate in the downloadable shell specs.

The separate 60 × 122-inch roof planning rectangle remains owner-measured and track-referenced. Its body registration is now a photo estimate: the front driver-side corner is at body coordinates `[0, 26, 0]`. The first and last modeled crossbars align with its front and rear. This display offset does not change saved item coordinates or establish the physical measurement endpoints. **The visible shell is not a mounting or clearance reference.** No physical fit or safe installation is established by this renderer.

### Hood lip, roof rack and front light bar

The black hood-leading-edge lip follows the existing hood surface, with tapered ends and a shallow raised ridge. Its shape was compared against the owner's front photo in a private overlay. Brand, thickness and physical dimensions remain unverified.

The separate rack model follows the visible open, two-level side rails, four visible crossbars, sloped fairings and front LED bar. The [2024 Entegra Launch specification](https://www.entegracoach.com/models/previous-model-years/2024/launch/) confirms a double roof rack, front/rear wind deflectors and front LED light bar, but provides no dimensional drawing. Rail sections, mounts, body registration, hidden structure and the light bar's estimated 49 × 2.6 × 3.1-inch envelope are photo estimates. The lamp is shown unlit. The passenger-side awning cassette is not part of this rack model and remains deferred.

Owner-reported observations are preserved separately in the shell specs: 122 × 60-inch track reference, 2 × 1-inch crossbar section, 3-inch side-slot center spacing, 6.5 inches from roof to crossbar and 4 inches from lower rail center to an unidentified upper rail bottom. The illustrative crossbar top is at Z = 6.5; the physical datum and exact target surface still need confirmation. The separate 4-inch observation is not used to solve the rack heights. Visible crossbar stations are estimated at 0%, 23%, 67% and 100% of the 122-inch reference.

Uncheck **Roof rack & light bar · estimated** to inspect the underlying roof. This static reference assembly is independent of editable roof equipment and is excluded from box-conflict checks. Changing the planning rectangle does not resize the reference rack. Download **shell specs** for its inputs, modeled bounds and unresolved measurements; roof-layout export/import continues to transfer only the editable planning configuration.

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

Serve the repository with `python3 -m http.server 8765` and open `/planner/`. No build step. `shell-model.js` contains the original parameterized mesh; `rear-carrier.js` contains the separate receiver/carrier mesh; `dirtbike.js` contains the original KTM reconstruction; `roof-rack.js` contains the separate rack and front light bar; `render3d.js` contains the scene and controls. `shell-specs.json` records the reconstruction's provenance and limits. Roof JSON export/import continues to transfer editable equipment, not the detailed shell mesh.

Original planner code and model geometry use the MIT license in LICENSE. Three.js 0.170.0 and OrbitControls use `vendor/THREE-LICENSE.txt`. This does not relicense supplied images, manufacturer trademarks or the rest of the repository. No external vehicle mesh, private imagery, VIN, credentials, analytics or vehicle-control connection is included.

The cab brow uses a gradual windshield-to-roof blend, checked against supplied side and quarter references. Its shape remains a photo-informed estimate; no factory surface or physical tolerance is supplied.

### KTM 350 SX-F on the carrier

The 2021 model is reconstructed from owner photos and the manufacturer-authored [KTM owner manual 3214215en](https://en.enduro.team/images/2/26/2021_350_sxf.pdf) (07/2020, printed pages 139–140, hosted by a third party). Reference dimensions are a 1,485 ±10 mm wheelbase, 950 mm unloaded seat height, 80/100-21 front and 110/90-19 rear tires, and 260/220 mm brake discs. The nominal outside tire diameters calculated from those size codes are 27.30/26.80 inches. They are not measurements of the owner's current knobby tires.

The front wheel faces the passenger side and the right/exhaust side faces outward, as in the photos. Original geometry includes knobby tires, 36 spokes per wheel, brakes, swingarm, chain, engine exterior, right-side exhaust, forks, controls, orange/white bodywork, black seat, number 69 and estimated webbing paths. A private axle-aligned overlay informed the silhouette and a 2¼-inch upper-fork/bar height correction; wheelbase and contact points were preserved. Fine graphics, mechanical details, fork compression, steering, lean and tie-down routing remain estimates. No photos, manual pages or commercial meshes are redistributed.

Both nominal tire contacts sit in the wheel channel. An approximately 85.51-inch tire silhouette extends beyond the 83⅛-inch carrier envelope, while both axle/contact positions remain over its platform. This is a model placement check, not a physical fit or restraint validation. Receiver height/extension, rear-door opening and loaded clearances still need measurement. Download **shell specs** for the motorcycle's manufacturer data, derived tire diameters, estimated installation and modeled bounds. Roof JSON export/import retains its existing equipment-layout scope.
