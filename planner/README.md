# Rooflab — Sprinter shell study

[Open Rooflab](https://sgordon1024.github.io/solar-upgrade-guide/planner/) · [Shell specifications](shell-specs.json) · [Roof layout specifications](starter-specs.json)

An original browser-based reconstruction of a 144-inch-wheelbase, high-roof Sprinter cargo shell. This revision uses 33 supplied reference images, including front/rear/side/top renders and wireframe views. The archive contained image files, not an editable 3D model. Reference pixels were inspected privately; images, background information and identifying metadata are not published.

## Current scope and accuracy

The initial view shows the **Sprinter exterior with sleeping flares, camper windows, off-road running gear, hood lip, roof rack with front light bar, driver-side Owl ladder, A/C, Starlink, four solar panels, two crossbar antennas, Maxxair fan, bagged snowboard on two rear clamp carriers, motorcycle carrier and 2021 KTM 350 SX-F**. The driver-side flare includes the small rounded tinted window visible in the owner photos; the passenger-side flare has a solid painted face. The driver-side middle window and passenger sliding-door glass include front-positioned opening panes. Uncheck **Sleeping flares · estimated** and **Camper windows · estimated** independently to inspect the underlying body. The six-fork-spoke charcoal rims, KO3-style tread and Owl/Falcon-style suspension hardware are reconstructed from references. The rear doors have two broad tinted panes with a narrow center seam. The separate rear-door steps remain deferred; the installed awning and rear-door spare are described below. Body paint is a bluer gray revised after owner feedback and checked in the actual passenger-side render against the owner photo; the factory paint code has not been verified. Existing roof layouts remain saved; enable **Edit roof layout** to return to editing them.

This is a manually constructed polygon mesh, **not factory CAD, photogrammetry, an exact replica or a calibrated scan**. The continuous roof/cab loft, pressed side panels, door seams, windscreen, headlights, grille, bumper, rear doors, roof ribs and stock wheels were compared with corresponding reference views. Five front/rear/driver/passenger/top image overlays used uniform scale and translation, with side views anchored to the wheelbase. They drove corrections to the joined rear closure, windshield elevation and plan curvature, cab seams, mirrors, antenna and wrapped headlights. Oblique views and an independent agent review checked the result. Fine grille/lamp relief, stamped panels, seams, tires and stance still differ. Visual review does not establish a dimensional tolerance.

The axle centers are exactly 144 inches apart in the software, using the owner's reported configuration. Body width is estimated at 79.5 inches without mirrors. The former 82-inch value described an approximate camper envelope, not a verified bare shell. The exterior length is scaled to a nominal 234 inches while preserving axle spacing; mirrors target the reference screenshot’s approximately 92.3-inch width. These are reconstruction targets, not a survey of the owner’s chassis. The installed tire designation is recorded; suspension stance, wheel details, roof shape and surface contours remain estimates. The supplied manufacturer-page screenshot describes a 2026 vehicle and is not presented as 2023 chassis-specific verification.

Flare and window inputs are recorded in `shell-specs.json`. The [Flarespace Classic Sprinter 144 specifications](https://flarespace.com/products/mercedessprinter-144flares) provide a comparison footprint of 64 × 27⅝ inches and maximum depths of 3¼ inches regular or 5¼ inches for the extended driver side. The installed product has **not** been identified. Those reference values guide the model; front projection, taper, placement, corner radii and glazing dimensions remain estimated. The flares now deepen toward the rear, with the passenger forward edge beside the sliding-door seam. Local photo/render overlays and an independent review checked both glass outlines and the small flare window. Unmatched camera perspective prevents physical calibration. These visibility switches are view controls, separate from roof-layout export/import.

The owner vehicle record identifies **BFGoodrich KO3 LT245/70R17 LR-E** tires; the listed 265/70R17 is a future option. The model uses an approximately 30.5-inch nominal diameter and 17-inch bead diameter derived from that designation. Original tread/shoulder geometry follows [BFGoodrich KO3 references](https://www.bfgoodrichtires.com/auto/tires/bfgoodrich-all-terrain-t-a-ko3); it is not an exact tire mesh. The six forked spokes are visible in the owner photos, but rim brand, width and offset are unconfirmed.

[Owl Arrow Trail 2500 references](https://owlvans.com/products/arrow-suspension-trail-2500-awd-and-4x4) guide the visible auxiliary shocks and rear leaf packs. Local wheel-photo overlays support an estimated 23-inch hub-to-arch distance, about 1.24 visible rim diameters. Matching that stance moves the hubs 4.7 inches lower than the prior generic model. **That is a rendering correction, not the actual suspension lift.** Actual lift remains unknown; photos cannot isolate factory AWD height, kit changes, load and terrain. The roof datum remains fixed and the ground plane follows the revised tires. Hardware is illustrative, without mounting, travel or clearance validation. Small lower-trim reflectors are removed at the owner's request.

The original rear accessory model follows the [HAUL-MASTER 57720 carrier](https://www.harborfreight.com/600-lb-capacity-motorcycle-carrier-57720.html) and its [assembly manual](https://manuals.harborfreight.com/manuals/57000-57999/57720-193175421548.pdf). Published reference dimensions are 83⅛ × 36¼ × 15½ inches overall, a 78¾ × 8-inch wheel platform, a 72-inch ramp and a 2-inch receiver. The passenger-side chock, open rocking cradle, stored inboard ramp, tie-down tubes and clamp are original approximations of those references. The carrier's 600 lb product rating does **not** establish this vehicle/hitch's load capacity. Receiver mounting, installed height and insertion depth are estimates because the owner's photos obscure them. The KTM is a separate original mesh; loose cargo is deferred. Uncheck **2021 KTM 350 SX-F** to inspect the empty carrier. Hiding **Motorcycle carrier** also hides the bike and disables its toggle until the carrier is restored, preserving your bike visibility choice. Uncheck **Motorcycle carrier** to inspect the receiver; the camera reframes the resulting envelope. Product and installation provenance are separate in the downloadable shell specs.

The separate 60 × 122-inch roof planning rectangle remains owner-measured and track-referenced. Its body registration is now a photo estimate: the front driver-side corner is at body coordinates `[0, 26, 0]`. The first and last modeled crossbars align with its front and rear. This display offset does not change saved item coordinates or establish the physical measurement endpoints. **The visible shell is not a mounting or clearance reference.** No physical fit or safe installation is established by this renderer.

### Owl side ladder

The original seven-step driver-side ladder follows the owner photos and [Owl Explorer Sprinter Side Ladder](https://owlvans.com/products/sprinter-side-ladder-explorer) references. It has four narrow upper treads, two slotted lower plates with center notches, one low tread, joined tubular rails and a forward bend beside the rear wheel. Placement across the window/flare junction, height, width, standoff and bracket geometry are photo estimates. The exact installed product revision is unconfirmed; Owl’s published 13-inch wheel-opening-to-front envelope is not an overall ladder width. The separate rear-door steps are deferred. **Owl side ladder · estimated** controls visibility independently; the ladder is excluded from roof equipment box checks. Request E07 in the measurement checklist covers the unresolved dimensions.

### Hood lip, roof rack and front light bar

The black hood-leading-edge lip follows the existing hood surface, with tapered ends and a shallow raised ridge. Its shape was compared against the owner's front photo in a private overlay. Brand, thickness and physical dimensions remain unverified.

The separate rack model follows the visible open, two-level side rails, four exposed main crossbars plus four lower panel-support members, sloped fairings and front LED bar. The [2024 Entegra Launch specification](https://www.entegracoach.com/models/previous-model-years/2024/launch/) confirms a double roof rack, front/rear wind deflectors and front LED light bar, but provides no dimensional drawing. Rail sections, mounts, body registration, hidden structure and the light bar's estimated 49 × 2.6 × 3.1-inch envelope are photo estimates. The lamp starts unlit; tap it or use its labeled control to preview illumination. The passenger-side awning cassette is a separate model, described below.

Four rows of partly exposed panel-edge stubs and center fasteners support the additional transverse support stations. Their full spans beneath the panels, sections and heights are inferred. These members sit below the panel frames, separately from the four exposed main beams. The count matches visible photo evidence; it does not establish structural capacity or sufficient support for a future load. Hide **Installed roof · estimated** to inspect all eight modeled transverse members. Request R03 asks for both main-beam and lower-support stations and sections.

Owner-reported observations are preserved separately in the shell specs: 122 × 60-inch track reference, 2 × 1-inch crossbar section, 3-inch side-slot center spacing, 6.5 inches from roof to crossbar and 4 inches from lower rail center to an unidentified upper rail bottom. The illustrative crossbar top is at Z = 6.5; the physical datum and exact target surface still need confirmation. The separate 4-inch observation is not used to solve the rack heights. Visible crossbar stations are estimated at 0%, 23%, 67% and 100% of the 122-inch reference.

Uncheck **Roof rack & light bar · estimated** to inspect the underlying roof. This static reference assembly is independent of editable roof equipment and is excluded from box-conflict checks. Changing the planning rectangle does not resize the reference rack. Download **shell specs** for its inputs, modeled bounds and unresolved measurements; roof-layout export/import transfers editable roof configuration and optional upgrade selections.

### Installed rooftop equipment

The default **Installed roof · estimated** reference now includes four framed solar panels in two pairs, the rear black A/C shroud, a driver-side white Starlink face tilted upward toward the rear, and two antennas near the center of the front crossbar. One is a tall whip with a thicker lower section; the other is a shorter black antenna. The original cab-roof antenna remains separate. Equipment identities come from the owner; exact product models, panel wattage and installed dimensions are unverified.

These are original photo-informed meshes, separate from the editable layout. The provisional panel size is 23 × 23 × 1.4 inches, Starlink face 22.5 × 22.5 inches with an 8° tilt, A/C footprint 27 × 37 inches, and antenna heights 20.5 and 6.8 inches above their mount plate. These are **estimates**, not manufacturer specifications. The A/C's model shroud top at Z = 12.5 uses the unresolved illustrative crossbar datum plus the owner's reported 6-inch offset. Small brackets and cable runs are illustrative; concealed support connections are not reconstructed. The Maxxair fan and bagged snowboard are described below; the Carefree awning is described below; unidentified loose rooftop objects remain deferred.

**Edit roof layout** temporarily hides the installed reference and disables its visibility switch, then restores the prior choice when editing ends. Existing saved dimensions, positions, notes and JSON remain intact, including any earlier placeholders. Starter items describe estimated existing equipment; newly added concepts describe proposed changes. The static reference and its antennas are excluded from box-conflict checks. Use **Download shell specs** for its geometry inputs, bounds and unresolved references; roof-layout export transfers the saved editable configuration and optional upgrade selections. The [measurement checklist](measurements.md) now includes separate antenna-height and mount-offset instructions.

## Views and controls

Choose 3D, Front, Driver, Passenger, Rear, Top or Underbody for matching-angle inspection. Drag to orbit, pinch or use +/- to zoom; right-drag to pan. Arrow keys rotate and +/- zoom when the canvas has focus. Reset camera restores the default view. Dimensions and wireframe are optional inspection overlays. Top is the whole shell; Roof plan, available with equipment enabled, isolates the measured planning rectangle.

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

## Running measurement checklist

[The prioritized measurement checklist](measurements.md) tracks the exact dimensions and reference points still needed, starting with rack datums, crossbar positions and the front light bar. Rooflab also surfaces these priorities in **Field notes → Measurements to collect later**, with a separate checklist download. Modeling continues with labeled estimates; no measurement is a prerequisite for another visual update.

When adding a feature, append its unresolved measurements to this list. When evidence arrives, update the corresponding specs and request status together, keeping measured, manufacturer-sourced and estimated values separate. Preserve conflicting observations until their endpoints are reconciled. The shared checklist is separate from roof-layout JSON; personal notes retain their existing local persistence and export behavior.

## Run and license

Serve the repository with `python3 -m http.server 8765` and open `/planner/`. No build step. `shell-model.js` contains the original parameterized mesh; `rear-carrier.js` contains the separate receiver/carrier mesh; `dirtbike.js` contains the original KTM reconstruction; `roof-rack.js` contains the separate rack and front light bar; `roof-equipment.js` contains the installed rooftop reference; `render3d.js` contains the scene and controls. `shell-specs.json` records the reconstruction's provenance and limits. Roof JSON export/import transfers editable roof equipment and optional upgrade selections, not exterior meshes.

Original planner code and model geometry use the MIT license in LICENSE. Three.js 0.170.0 and OrbitControls use `vendor/THREE-LICENSE.txt`. This does not relicense supplied images, manufacturer trademarks or the rest of the repository. No external vehicle mesh, private imagery, VIN, credentials, analytics or vehicle-control connection is included.

The cab brow uses a gradual windshield-to-roof blend, checked against supplied side and quarter references. Its shape remains a photo-informed estimate; no factory surface or physical tolerance is supplied.

### KTM 350 SX-F on the carrier

The 2021 model is reconstructed from owner photos and the manufacturer-authored [KTM owner manual 3214215en](https://en.enduro.team/images/2/26/2021_350_sxf.pdf) (07/2020, printed pages 139–140, hosted by a third party). Reference dimensions are a 1,485 ±10 mm wheelbase, 950 mm unloaded seat height, 80/100-21 front and 110/90-19 rear tires, and 260/220 mm brake discs. The nominal outside tire diameters calculated from those size codes are 27.30/26.80 inches. They are not measurements of the owner's current knobby tires.

The front wheel faces the passenger side and the right/exhaust side faces outward, as in the photos. Original geometry includes knobby tires, 36 spokes per wheel, brakes, swingarm, chain, engine exterior, right-side exhaust, forks, controls, orange/white bodywork, black seat, number 69 and estimated webbing paths. A private axle-aligned overlay informed the silhouette and a 2¼-inch upper-fork/bar height correction; wheelbase and contact points were preserved. Fine graphics, mechanical details, fork compression, steering, lean and tie-down routing remain estimates. No photos, manual pages or commercial meshes are redistributed.

Both nominal tire contacts sit in the wheel channel. An approximately 85.51-inch tire silhouette extends beyond the 83⅛-inch carrier envelope, while both axle/contact positions remain over its platform. This is a model placement check, not a physical fit or restraint validation. Receiver height/extension, rear-door opening and loaded clearances still need measurement. Download **shell specs** for the motorcycle's manufacturer data, derived tire diameters, estimated installation and modeled bounds. Roof JSON export/import retains its existing equipment-layout scope.


### Maxxair fan and bagged snowboard

The installed reference now includes the owner-identified Maxxair exhaust fan and the rear driver-side snowboard packed with clothes in a canvas-style case. The smoke cowl follows the [MAXXFAN Deluxe family reference](https://www.maxxair.com/products/fans/maxxfan-deluxe/) and owner roof pixels; the source’s 14 × 14-inch opening is a family reference, not a verified installed cutout or outer envelope. Exact model is unknown. A 16.4 × 23-inch outer cowl is an estimate, shown in a low/closed pose. Its leading area is partly obscured by the front panels and interior crossbar. The reported open-height observation remains separate; this mesh does not validate lid travel, ventilation or clearance.

The original soft case has irregular packed bulges, a flatter rounded tail, grey fabric, a dark underside, zipper and carrying webbing. Two distinct clamp carriers sit on the existing two rear main beams. The approximately 64-inch case and 20-inch rear-crossbar overhang are photo estimates; packing can change that shape. Clamp brand, jaw geometry, attachment and loading remain unverified. No manufacturer mesh or owner photo is published.

Both additions follow **Installed roof · estimated** and hide when **Edit roof layout** is enabled. Saved fan/roof-bag entries retain their earlier values and do not automatically become these detailed meshes. R07 and R09 in the measurement checklist track their unresolved dimensions.

## Rear-door spare and cassette hatch

The default exterior includes a driver rear-door spare with a charcoal six-fork wheel, original all-terrain tread, hinge-mounted diagonal braces and a central retainer. A separate **Rear-door spare · estimated** checkbox hides the wheel and its mount for inspecting the rear doors. The spare's identity is unknown: the illustrative 30.5 × 9.65-inch envelope borrows nominal road-tire dimensions, without claiming the spare is the same tire. Wheel offset, center and concealed mount construction remain estimates.

The closed cassette toilet access door sits on the driver side immediately ahead of the Owl ladder and above the dark molding. Its rounded bezel follows the actual modeled side surface; the inset lid has two aft-edge molded latch tabs and small forward hinges. The 14 × 16-inch outside frame and its offsets are photo estimates; the access hatch now opens onto a generic illustrative cassette compartment. Its exact make, tank shape and clearance remain unverified.

Both are original geometry in `exterior-details.js`, recorded with provenance and bounds in `shell-specs.json`. Checklist E08 requests spare size, center, standoff, mount and bike gap; E09 requests hatch dimensions and body/ladder offsets. Static accessories are independent of saved roof layouts and excluded from equipment box checks. Photo overlays and independent visual review improve appearance but do not establish CAD tolerances, real clearances, door movement or mounting capacity.


### Carefree awning and optional underbody upgrades

The existing passenger-side **Carefree awning · stowed estimate** has an original rounded cassette, end caps, closure seam, unlit LED diffuser and provisional brackets. Owner photos informed its 124-inch length, 5.2-inch width, 7-inch height and rack-relative placement. [2024 Launch documentation](https://www.entegracoach.com/models/previous-model-years/2024/launch/) identifies a Carefree armless patio awning; it does not establish this van's exact product or dimensions. Fabric deployment, arms and clearance sweeps are unmodeled. Request R10 records the missing measurements.

Expand **Optional underbody upgrades** to compare the [GoCode 28-gallon tank](https://gocodeoverland.com/collections/all-tanks/products/28-gallon-sprinter-spare-tire-water-tank) (29.75 L × 27.75 W × 10 H inches) or [S&B 35-gallon tank](https://sbfilters.com/products/35-gallon-spare-tire-replacement-fresh-water-tank-07-24-mercedes-sprinter-144-170-copy) (29 L × 32 W × 11.75 H inches). These are nominal manufacturer envelopes, with published dimensional variation retained in the catalogue. Select only one. Both require the original spare basket; its presence and usable space on this conversion are unknown. Fittings and mounting hardware are not modeled.

The [Van Compass 4095 engine](https://vancompass.com/products/engine-skid-plate-sprinter-awd-2023-2500-by-van-compass) and [4096 transmission/transfer-case](https://vancompass.com/products/transmission-and-transfer-case-skid-plate-sprinter-awd-2023-by-van-compass) choices are illustrative plate outlines with estimated bends and positions. Selecting 4096 also selects the required engine plate; clearing the engine plate clears both. The separate 4102 engine variant is specific to a Van Compass lift, not a choice justified by this model's stance. Verify the actual suspension/mounting configuration.

All choices start **off**, remain **proposed**, and use amber geometry. **Inspect underneath** hides the generic floor placeholder and ground. The exposed shell interior is not a surveyed chassis. Frame rails, drivetrain envelopes, coach tanks, spare basket, plumbing and movement/heat/service clearances remain incomplete. These proposals are excluded from roof box checks; no physical fit or load capacity is certified. U01–U06 list the survey still needed.

Roof-layout JSON keeps version 1 and adds an optional `upgrades` object: `{ "version": 1, "tank": "none", "engineSkid": false, "transmissionSkid": false }`. Tank values are `none`, `gocode28` or `sb35`. Old files without this section import with all proposals off and preserve roof items and notes. Invalid combinations are rejected before replacing saved data. Export includes selections; sourced catalogue dimensions, estimated poses and modeled bounds are in **Download shell specs**. The stowed awning is static existing-equipment geometry, separate from proposed selections. New modules: `awning.js`, `upgrade-data.js` and `underbody-upgrades.js`.


### Rear VP Racing container

The **VP Racing 3-gallon container · estimated** is existing owner-identified equipment, upright on the passenger end of the stored rear ramp and inboard of the motorcycle. The original cream mesh follows the owner photo: rounded lower body, steep shoulder, molded handgrip, small inferred dark cap, outward-facing VP mark and approximate over-strap/ratchet. Its 10 × 10 × 16-inch envelope and placement are estimates; exact installed part number is unknown. The [official container-family source](https://plasticproductformers.com/products/3-gallon-motorsport-container%C2%AE-square) establishes the general handle/cap configuration, not these dimensions or this van's installation.

Its visibility is independent of the bike, and hiding the carrier also hides the container. It is a static reference in shell specs, excluded from editable roof boxes and their checks. The base meets the modeled ramp floor; small footprint overhang and gaps still need measurement (E10). Neither support, securement, contents/use nor physical clearance is validated. No owner photo or manufacturer image is included in the public model.


### Running boards

Both existing running boards follow the owner side photos: a short driver cab step with one perforated pad, and a long passenger step with three separated pads beneath the cab and sliding door. Original geometry includes straight charcoal oval tubes, rounded caps, clipped pad ends, round holes and sparse illustrative supports. Estimated lengths are 38 and 101 inches; the 5.2 × 3.2-inch tube section, outward projection, drop and brackets are unmeasured. Brand and model are unknown.

**Running boards · estimated** controls both sides independently of other accessories. Geometry and provenance are included in shell specs; E11 requests the measurements needed to refine it. Saved roof layouts are unaffected. These static references are excluded from roof box checks and do not establish structural capacity, ground clearance or moving-door/tire clearance.


### Launch and Entegra emblems

Three photo-referenced silver **Launch** emblems sit below the aft portion of both side flares and above the driver-side rear glass. Small dark serif **ENTEGRA** marks appear on both lower cab doors and beneath the front light bar. The fairing mark replaces the earlier simple strokes; hiding the rack hides its lettering too. Original vector geometry includes the Launch slant, separated strokes and pointed H terminal, with shallow relief fitted to the modeled body surfaces. No photo textures or font assets are redistributed.

Locations are photo-observed; exact outlines, dimensions and depth remain estimates. E12 records measurements to refine them. Body dimensions and saved roof layouts are unchanged. Brand names and marks identify the depicted vehicle; rights remain with their owners.


### Rear differential scale correction

The original 6.12-inch-high placeholder has been replaced by an original cast-bowl/cover/pinion reconstruction, estimated at 11.8 inches wide × 11.5 inches high. [ARB lists a 245 mm ring gear](https://www.arb.com.au/product/rd262-arb-air-locker-rear-axle-mercedes-benz-sprinter) for its Sprinter application, larger than the entire old placeholder. That supports correcting scale, but does not establish this van’s axle variant or outer dimensions. The axle center stays at Z −92.5 inches; the nominal modeled low point is −98.75 and its ground gap is 9 inches. Those are visualization values, not surveyed clearance. U07 records the missing photo and dimensions. No aftermarket differential cover or locker is represented as installed.

Model visibility is now organized into Body & sides, Roof, and Rear & cargo switch groups under Model layers. Dimensions, Wireframe and Edit roof layout remain directly accessible. The switches use native keyboard-operable inputs and preserve existing visibility dependencies; they do not change saved roof geometry.


### Side alignment and driver access details

Local grayscale photo overlays register to the nearby flare outline with uniform scale and translation, leaving perspective differences visible. Both fitted flares now have a narrow outward rollover and a photo-estimated upper aft taper; the artificial stock-panel depression around them is removed. The driver window is 2 inches farther forward, 0.8 inch lower and estimated at 25 × 10.3 inches. Driver and passenger Launch badges use separate placements: the passenger mark sits beneath the sliding-door metal channel. These refinements improve visual agreement without establishing a CAD tolerance.

The closed fuel flap is on the fixed driver-side body immediately aft of the cab door, with a red cap inside. The owner's access requirement and cap color are recorded separately from estimated dimensions. **Model layers → Fuel cap cutaway** hides the flap for inspection; it is not a door-opening or interlock simulation. The small black light above the cassette hatch starts unlit and has a separate interactive control. E01/E12–E15 collect unresolved measurements. Body paint and saved roof-layout data are unchanged.


Passenger-side comparison refined the aft flare rake and lower edge independently of the driver flare, raised the metal track and Launch badge together, reduced the sliding glass’s upper-aft chamfer and replaced rectangular passenger handles with oval pockets and raised grips. These are photo-based estimates. Color, wheelbase and running gear are unchanged; E01/E02/E12/E13/E16 record the remaining measurements.


The front-corner revision removes the artificial nose-width dip, gives the front and side bumper a shared edge, and keeps the wrapped lamps on the same surface. Both mirrors now use original tapered convex caps, glass rims and lower panes, short mounts and vertical indicators. Owner photos and supplied exterior-render references guide these shapes; exact mirror dimensions and folding clearance remain open in E17.


### Interactive exterior

Tap a visible door, opening window pane, lamp or tire in the 3D view. The **Try your van** controls provide the same actions with native keyboard and touch buttons. Dragging and pinching keep their camera behavior. Headlights cycle **Off → Low beam → High beam**; use **Day / night preview** to see their illustrative ground illumination. Fog, tail, roof-bar and hatch lights are independent.

The cab doors swing outward with their glass, mirrors and badges; the sliding door first moves outward, then rearward. The rear doors carry the spare and their door hardware. Carrier, motorcycle and container visibility are temporarily suppressed while rear doors are open, then restored to your existing layer selections. This is a demonstration, not collision detection. The front cabin is now reconstructed from the supplied Sprinter references and 2024 Launch documentation. Rear camper furnishings remain unmodeled; the plain floor/wheel housings are placeholders.

The driver middle pane slides rearward. The flare pane hinges outward from its top edge with two telescoping support stays. A tire tap starts/stops a wheel and suspension demonstration: road wheels spin, calipers stay fixed, shocks compress and the rear spring pack flexes. It stops automatically after 20 seconds or when the tab is hidden. Reduced-motion preference uses immediate door/window changes and a static wheel/suspension pose. **Close all & reset** restores the neutral model and switches lights off.

Angles, travel, support hardware, suspension response, interior reveals and beam patterns are estimates. M01–M05 in the measurement checklist record the needed observations. These poses do not establish physical clearance or load behavior. Motion state is temporary, separate from saved roof-layout data and its JSON export. Opening animation is disabled while editing the roof layout.

Dependency-free checks (Node.js):

```sh
node planner/tests/geometry.test.mjs
node planner/tests/controller.test.mjs
```

The checks cover concave panel extraction and area conservation, pose reset, rearward door travel, attached spare, independent lamps, layer visibility, fixed calipers, direct picking, drag/multitouch suppression, reduced motion and stopping on timeout/tab hiding.

### Front cabin and lighting study

The original code-built cabin includes black leather front seats (owner-confirmed), satin three-spoke steering wheel, instruments, circular vents, media fascia, door cards, footwells, visors and overhead console. The [official 2024 Launch archive](https://www.entegracoach.com/models/previous-model-years/2024/launch/) confirms heated swivel front seats and a 10.25-inch MBUX display. The [19Y floorplan](https://data.entegracoach.com/media/4myh3r40/2024-launch-19y.png) provides layout context, not a dimensioned CAD survey. Owner-supplied renderings 22–24 guide surface appearance; the physical coach's cabin still needs direct photographs. No reference photo or third-party mesh is redistributed.

Cockpit, Driver seat, Front seats and Ceiling lights presets use perspective cameras. Tap a seat or its labeled button to swivel; the corresponding cab door opens for the demonstration, then its inner armrest lifts and its upper assembly slides an estimated 11 inches rearward before turning. During the turn the display path also shifts up to 5.5 inches toward the aisle, returning to its original lateral position at either end. Seats turn one at a time. This is an illustrative clearance path, not a model of the real swivel hardware or a claim that the physical seat follows that sequence. The door cards follow their doors. The cassette hatch swings outward and reveals a generic tank. Rear camper furnishings are outside this pass. M06–M09 track missing geometry.

Fog lamps and the entire roof-bar housing have bounded tap targets with solid-body occlusion. Low/high beams remain separate. The light bar combines modest body illumination with a broad procedural ground wash and limited side/rear spill in Night preview; it is intentionally illustrative and cannot predict lux, glare or road performance.

Custom ceiling rope lights follow the owner's described route; the bed-front datum and corners around cabinets are estimates (M10). Choose Warm, Aurora, Sunset or Rainbow, with Steady, Flow or Breathing patterns and adjustable speed. Pause/Resume is available; animation stops after 60 seconds, when hidden or when roof editing begins, and reduced motion freezes the pattern. These controls affect only the local 3D visualization, never the physical van. Reset turns them off. Appearance/motion controls do not modify saved roof-layout measurements.

### Phone view and simple environments

At widths up to 900 CSS pixels, the model fills the viewport. **Views** chooses a camera, **Controls** groups doors, windows, lights and motion, **Scene** selects scenery, and **Tools** contains layers, optional upgrades, roof editing, files and notes. Menus start closed. Actions close the menu to reveal the model; camera reset returns to the exterior. Keyboard focus stays inside an open menu and Escape closes it. Scene arrow-key selection keeps the menu open. Existing measurement controls and saved configuration are the same original controls, moved into the menus.

Scene choices are White, Desert, Sand dunes, Mud, Gravel back road, Paved highway, Rain and Snow. They are original stylized scenery, not real locations, terrain surveys or weather forecasts. Drive demo reuses the wheels' animation clock to move the ground, roadside shapes and weather. Stop it with the same control or a tire tap; it also stops after 20 seconds, on tab hiding or when roof editing starts. Reduced motion keeps scenery still. No extra animation loop or downloaded scenery assets are used. Scene selection is temporary and does not enter the exported roof specification.

The sliding-door opening no longer has an opaque placeholder backing. The view through it shows existing cabin geometry and the opposite body wall; rear camper furnishings are still not reconstructed. Door geometry, travel and physical clearance remain estimates.

`node planner/tests/environment.test.mjs` checks all scene types, motion synchronization, bounded geometry/particles, texture disposal, pause/restart and reduced motion. The geometry suite also casts through the open sliding-door aperture to guard against another solid obstruction.


## Optional 800 W solar proposal

Mod 01 is under Tools on phones and above the model on desktop. Four HQST HSP200N-64L panels use sourced nominal dimensions; all placement and generic riser/support geometry is estimated. Toggle between current equipment and proposed panels without modifying saved roof items. The parts list includes visible mounts and hidden electrical components, their reuse status and primary sources. See [solar review](solar-upgrade.md) and [starter proposal JSON](solar-800w-specs.json).

Version-1 layouts now carry optional `upgrades.solar` (`version`, `enabled`, `minTemperatureC`, four `{x,y,z}` panel-bottom positions in inches). Missing solar fields default off; existing measurements/notes/underbody choices remain. Ordinary export/import includes it. The dedicated solar JSON is a parts/analysis report, not an importable roof layout. Panel and support checks compare against estimated installed-reference envelopes; they do not validate engineering fit or the separately edited roof boxes.

`node planner/tests/solar.test.mjs` checks electrical arithmetic, manufacturer envelopes, support conflicts, geometry/disposal, selective hiding, legacy migration, persistence and malformed imports. No physical installation is authorized by the preview.

## Moving the detailed snowboard bag

Tap the visible canvas bag or its clamps, or choose **Move snowboard bag** above the model (phone: **Tools → Move snowboard bag**). The highlighted bag and both clamps move together. Use the vehicle-direction buttons with ¼-inch, 1-inch or 4-inch steps, or open **Precise position & fit notes** to enter offsets. **Done** or Escape closes the editor. **Restore photo position** resets only this bag and its clamps.

Offsets are saved with the version-1 layout under `installedRoof: {version: 1, snowboard: {x, y, z}}`, in inches relative to the original photo-estimated pose. X is positive toward the passenger side, Y rearward, Z upward. Older files with no `installedRoof` migrate to zero offsets. Export/import includes them; existing roof items, measurements, notes and upgrade choices are preserved. The earlier editable `roof-bag` box is explicitly labeled **layout box**, remains independent, and links to the detailed mover.

The rack crossbars stay fixed. Moving clamps does not validate a new attachment location. Bag/clamp dimensions and packing shape remain estimated; measured mounting and service clearances are required. Fit notes screen conservative bag and clamp envelopes against the installed reference equipment or selected solar proposal. Solar panel/support checks and the dedicated solar report also follow the moved bag; they do not check every van surface or replace physical clearance checks.

`node planner/tests/snowboard.test.mjs` verifies independent geometry transforms, geometry reuse, envelope coverage, fit/report updates, bounded inputs, legacy migration, persistence and JSON roundtrip. `node planner/tests/controller.test.mjs` includes actual raycast selection, moved/hidden/occluded bag checks and existing interaction regressions.

## Roof editor and temporary bag hiding

Choose **Edit roof layout** above the desktop model, or **Tools → Edit roof layout** on a phone. The top-view map drives the actual detailed installed equipment and proposed solar positions. Drag footprints, use the object picker and direction buttons, or enter X/Y/Z in **Precise position**. Front is up, driver side left. The object picker reaches parts obscured by other footprints. The bag and clamps and both antennas/mount each move as a group; installed panels move separately, or enable **Use proposed 800 W panels** to edit the four upgrade panels. **Done · view 3D** shows the result.

**Temporarily hide bag + clamps** hides only those meshes. It preserves the packed case's saved position and dimensions and never removes it from physical-fit flags. **Show bag** restores it at that saved position. A place to carry it is still needed. The bag mover also exposes this switch.

Changes save locally as they are made. **Export for review** downloads `rooflab-layout-for-review.json`; attach that file in the conversation for review. No upload happens automatically, and browser-local changes are not visible to the assistant. The file includes notes and evidence. Existing **Import specs** accepts this full layout, unlike the separate solar parts report. Export a new file after further edits.

Version-1 `installedRoof` now also carries `bagHidden` (default false) and `offsets`, with `{x,y,z}` for `starlink`, `ac`, `fan`, `antennas`, and `existing-0` through `existing-3`. Missing fields migrate to zero offsets. These offsets are inches from each original photo-estimated position; the existing `snowboard` offset is retained. Proposed panel positions remain under `upgrades.solar.panels`. Older roof item boxes, notes, measurements and optional upgrades are preserved. The previous box editor is labeled **Legacy roof boxes** to distinguish it from detailed equipment.

Relocations are hypothetical: cutouts, wiring, plumbing, airflow, fan opening, rack attachment and real installation constraints do not move with these controls. Rack beams remain fixed. Generic solar supports follow proposed panel positions but mounting is unresolved. Fit screening uses conservative envelopes covering the modeled fixtures and mounts; hidden bag/clamp envelopes still count. No CAD fit or physical mounting approval is implied.
