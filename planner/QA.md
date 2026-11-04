# Verification — 3 November 2026

Initial planner release: automated browser checks on local Chrome:

- Rendered initial three equipment boxes and nonempty 3D canvas; no page JavaScript errors.
- 375, 390, 768 and 1280 px viewport widths: no horizontal page overflow.
- Roof plan, 3D and side view; camera keyboard rotation changes rendered pixels; zoom buttons operate.
- Added a solar concept, edited X to cause edge overrun, verified warning.
- Reload preserved item count and edited position.
- Downloaded JSON, removed equipment, imported download and restored four items.
- Invalid schema import rejected without changing current layout.
- Geometry cases: touching boxes flagged; separated boxes clear; clearance margin flagged; vertical separation clear.
- Reset cancellation preserved data; confirmed reset restored starter.
- Disabled localStorage did not block editing and displayed export/session warning.
- Desktop and mobile screenshots visually inspected. Body geometry is illustrative, not measured vehicle CAD.

The renderer and checks use conservative boxes, not a CAD collision engine. No physical installation or mounting verification has been performed. Source labels do not independently verify inputs. Cross-device storage synchronization is not implemented; JSON is the transfer mechanism.

## Exterior and design update

- Original polygon exterior added with 144-inch axle spacing, approximate cab/body contours, windows, bumpers and round wheels. No third-party mesh or private imagery.
- Native Chrome visual inspection at desktop width and 375/390 px device emulation: forest/paper layout, equipment controls and roof view remain readable.
- Mobile roof-plan toggle visibly switched the canvas and selected state; desktop 3D restored the full exterior.
- Reduced-motion CSS and camera branches reviewed; data validation, collision checks and persistence code are unchanged from the initial tested release.
- Syntax checked with Node. This pass is visual/manual verification, not a new physical fit validation.

## Photo-informed WebGL revision

- Materialized four exterior images plus overhead reference privately with the supported Library helper and Python 3.12; inspected all five as pixels. No photo files or metadata included in release.
- Replaced the flat Canvas 2D renderer with locally hosted Three.js 0.170.0 and OrbitControls. All van/accessory geometry is original and photo-informed; no licensed third-party vehicle mesh.
- Removed the selected-card orange inset stripe and notice-card side stripe, deployed separately, and visually verified the live selected Starlink card. Versioned stylesheet URL avoids reuse of stale CSS.
- Node syntax checks pass. Data checks pass: eight starter items, four panels, 60 × 122 roof, JSON validation roundtrip, touching/overlap, clearance, vertical separation, boundary overrun, malformed schema, duplicate IDs and nonfinite values.
- Desktop Chrome: WebGL rendered, 3D and driver views inspected. Roof camera framing refined during review.
- No physical fit accuracy, scan reconstruction, CAD tolerance or mounting approval established. Earlier functional tests remain historical evidence; this revision's checks are distinguished above.
- Current revision manual Chrome checks: 375 × 844 emulation rendered the exterior and controls with no visible horizontal overflow; console showed only an extension-origin inspector permission warning, no observed app error. Added a ninth item, reloaded and confirmed persistence; exported JSON contained nine items and 60 × 122 roof; removed the test item, imported the export and confirmed restoration to nine; removed it again to restore the eight-item local test layout.

## Bare-shell reconstruction — current revision

- Inspected the supplied 33 WebP images as contact sheets and reviewed front, rear, side and top reference pixels at full size. The ZIP contained no editable mesh files. References remain private and outside the publishing allowlist.
- Rebuilt the shell as original parameterized surfaces; all camper accessories are deferred in the default view. Existing roof configuration state and import/export schema are retained.
- Compared matching rendered views during construction. An independent agent reviewed all six views and source, identifying mirrored rear hardware, sparse projected seams, rear-surface clipping, broad arch gaps and windshield/cowl shape issues. Corrections applied; final review findings are recorded below after recheck.
- Node geometry validation checks all mesh positions/normals for finite values and all indices for range; asserts 144-inch axle separation and bounded exterior dimensions, triangle budget and draw-call count. Original exterior parts batch into 12 material meshes. These tests check software integrity, not physical dimensional accuracy.
- JSON data checks remain passing for schema roundtrip, overlap/touching, margin expansion, vertical separation, edge overrun and invalid-data rejection. Node syntax checks pass for the renderer and shell module.

- Independent recheck confirmed correct rear plate/handle handedness, continuous door seams, removed rear V-shaped clipping, improved arch gaps and bowed windshield. Whole-shell Top and isolated Roof plan remain correctly oriented. Subsequent detail pass rounded the rear pressed-panel outline and retained the same coordinate conversion.
- Final mesh: approximately 345,000 triangles, 12 material draw calls. Rendered axle center spacing remains 144 inches after length registration; mesh bounds are 234 inches long and 92.3 inches across mirrors. These are software scale targets; body contours and suspension height remain unverified.
- Desktop Chrome and 375 × 844 device emulation: shell renders, view buttons, wireframe and equipment visibility operate, no visible page overflow. No observed app JavaScript errors; the console contains an extension-origin inspector permission-policy warning. Physical phone frame rate was not benchmarked.
- Exported the existing eight-item local test configuration from mobile emulation, inspected valid downloaded JSON (60 × 122-inch roof), imported that exact file successfully, reloaded, and confirmed all eight items persisted. No live user equipment was reset or replaced.
- Remaining visual fidelity limits: glazing, fine grille/bumper relief and some panel highlights remain simplified. This release is not an exact replica and establishes no physical tolerance.

## Owner paint match — 3 November 2026

Reviewed owner driver/passenger photographs in actual pixels and changed the body paint to a muted blue-gray. The shared paint material covers the shell, doors, painted trim and roof ribs. Base color is an appearance estimate under the renderer's studio lighting, not a verified factory paint code. Compared local passenger and three-quarter views with the reference photos; geometry, equipment state and data controls are unchanged. Renderer and shell module URLs are versioned for the color release.

## Paint and lighting correction — 3 November 2026

The first paint update was visibly too pale and was rejected by the owner. Re-inspected both side photos and the front image, sampling painted regions instead of judging the base color alone. Changed the paint base to `#8d9499`, reduced hemisphere/fill illumination and exposure, and placed the stronger light toward the passenger side to retain a shaded driver side.

Compared browser-generated screenshots with the private reference pixels: driver lower-door median RGB was 86/100/108 versus photo 82/95/104; rear-quarter median was 86/99/107 versus photo 85/99/106. This is an approximate appearance comparison under differing capture conditions, not calibrated color matching or a factory paint-code identification. Private photos and screenshot samples are not published. Shell geometry and saved configuration logic remain unchanged. New `paint2` module URLs invalidate the previous paint assets.

## Overlay-driven shell corrections — 4 November 2026 UTC

- Captured actual WebGL front, rear, driver, passenger and top views at fixed orthographic cameras. Created 50% reference/render overlays and colored edge comparisons before editing and through multiple correction passes. Registration used uniform scale and translation only; no nonuniform image warping. Side registration used the nominal 144-inch wheelbase; the other views used estimated body-envelope dimensions. These are visual registrations, not calibrated physical measurements.
- Replaced the detached rear plate with surfaces sharing the terminal roof/side section, applied a common tail lean, and corrected door seams and hardware placement. Fixed windshield top concavity by separating plan curvature from elevation and flattening its central upper edge; corrected lower width and corner droop. Refined cab seams, mirror and antenna positions, wrapped headlamp surfaces and wheel-well liners.
- Independently reviewed all five overlays and both front/rear three-quarter renders. Review confirmed the rear-body join and corrected windshield. Added curved wheel-well barrels to address a remaining oblique-view gap.
- Geometry integrity tests pass: finite vertices/normals, valid indices, actual axle spacing 144 inches, nominal mesh length 234 inches, mirror envelope 92.3 inches, 381,060 triangles batched into 12 draw calls. Rear closure boundary samples differ from the adjacent tessellated loft by at most 0.039 inch; central windshield upper-edge elevation variation is zero. These are digital mesh properties, **not real-vehicle tolerances**.
- Changed paint from neutral gray to bluer `#829bac`, with lower neutral environment reflection and higher roughness. Compared actual rendered passenger-side appearance with the owner photograph. This is an appearance adjustment under synthetic lighting, not a verified paint code.
- Desktop and 375 × 844 Chrome device emulation show the revised model and working Passenger/Front controls. No visible overflow or observed app console error; a Chrome extension still emits its unrelated inspector permissions warning. Existing storage/import/export code is unchanged; earlier functional results above remain historical evidence.
- Reference photos, overlays and image metadata remain private and excluded from publication. Remaining differences include grille/lamp fine detail, stamped-panel relief, seams, tires and suspension stance. No exact-CAD claim, physical fit validation or mounting tolerance is established.

## Rear sleeping flares — 4 November 2026 UTC

- Inspected owner driver/passenger and rear photos in pixels. Added original rounded flare surfaces with a small tinted window on the driver side and blank painted passenger face. Photo-estimated parameters and resulting model bounds are recorded in shell specs; no product identification or physical fit claim.
- Kept the stock shell independently visible using the checked-by-default Sleeping flares toggle. Roof layout data, validation and storage code are unchanged.
- Stock geometry tests remain passing. Additional checks verify finite flare vertices, rear-quarter bounds, retained 234-inch envelope, separate flare material batches and tinted window presence. With both flares the model has 401,540 triangles and 16 draw calls; hiding them restores 12 visible stock-shell batches.
- Actual WebGL driver, passenger, rear and oblique renders compared privately against the owner photos. Desktop toggle hides/restores the flares without removing the underlying shell. New controls and geometry were also checked at 375 × 844 device emulation.
- The stock-shell reference overlay viewer remains private and intentionally excludes the added flares because the stock reference renders do not show them. The body/flared-surface models are visual approximations, not CAD fit certification.

- Independent flare review confirmed the window/blank-face side assignment and found no gross intersection. Applied its photo-based forward placement and window-width/position refinements, then softened the shoulders. Projection depth remains an unverified estimate.

## Flare taper and camper glazing — 4 November 2026 UTC

- Re-inspected owner side photos and official Flarespace Classic 144 product images. Recorded published 64 × 27⅝-inch footprint and deepest-point depths (3¼ regular, 5¼ extended driver) as a manufacturer comparison, with installed-product identity explicitly unconfirmed. Front projections and taper remain estimates.
- Lowered both flares, retained the passenger forward edge beside the sliding-door seam, and changed the depth profile to increase toward the rear. Kept the driver flare-window longitudinal location, increased estimated height to 11.4 inches, lowered its center and rounded its complete corner arcs after independent review.
- Added driver middle and passenger sliding-door glass with broadly rounded front lower corners and forward opening panes. Separate checked-by-default camper-window visibility works independently of sleeping flares. Shifted body paint slightly bluer to `#7c9bb2`.
- Compared actual WebGL side and oblique renders with owner photos; generated private 50% overlays using local uniform scaling/translation anchored to body seams, rear body line and gutter. Perspective was not calibrated or removed. Final independent review found no blocking visual regression; passenger guide-rail detail and rear-edge slant remain approximate.
- Removed diagonal shading ripples below the flares by keeping upper-body tessellation rows independent of wheel-arch sampling. The analytic body shape and 144-inch axle spacing remain unchanged.
- Geometry checks pass for finite positions/normals, valid indices, nominal 234-inch body envelope, separate feature batches, window bounds and actual rearward increase of flare depth. Full exterior with flares and glazing: 432,644 triangles in 19 batches; hiding both features restores 12 stock batches. Stock seam-continuity and windshield checks remain passing. These are software geometry checks, not real-vehicle tolerances.
- Desktop Chrome: passenger view and both independent visibility combinations visually checked. At 375 × 844 device emulation, driver view and the new window checkbox visibly operate; no visible horizontal overflow. No observed application console errors; the existing extension-origin inspector permissions warning remains. Physical-phone performance was not benchmarked.
- Roof-layout state, storage, validation and import/export logic are unchanged. Private photos, manufacturer imagery and overlays are excluded from the six-file publication allowlist.

## Owner running gear and bluer paint — 4 November 2026 UTC

- Located the owner-maintained vehicle record: installed tires are BFGoodrich KO3 LT245/70R17 LR-E. The 265/70R17 size is explicitly a future option. Published only the task-relevant tire specification; no source document, identifying data or unrelated private content is included.
- Inspected four wheel/arch crops and official BFGoodrich and Owl product images privately. Built original six-fork-spoke rims, hollow barrels, recessed brake details, angular tire tread/shoulders, fine sipes, auxiliary reservoir shocks and rear leaf packs. Wheel brand and exact hardware geometry remain unverified.
- Tire diameter target 30.5 inches and 17-inch bead diameter follow the recorded designation. Lip diameter 18.5, rim width 7.5, track 72.2 and hub-to-arch 23 are estimates. The 4.7-inch axle drop corrects the old generic model; actual suspension lift stays null in the exported specs. Ground follows the tires while roof datum and 144-inch axle spacing stay fixed.
- Removed small side-trim and lower-rear-bumper reflectors. Tail/brake lamps remain. Changed paint to `#779bb8` for the requested small additional blue shift.
- Captured nine actual WebGL views including wheel closeups. Three owner-photo/render overlays use local uniform scale and translation anchored to visible rim diameter and hub center. Camera perspective, loaded tire shape and uneven ground are not calibrated.
- Independent review prompted broader spokes, dark recessed wheel interiors, lower wheel-house backing/end walls and a subdued rotor finish. Final refreshed images and overlays were rechecked: no blocking new regression; rim topology, tire proportions and stance plausibly match the photos. Fine tread, sidewall, spoke faceting and suspension mounts remain approximate.
- Stock, flare/glazing and running-gear geometry checks pass: finite vertices/normals, valid indices, ground contact, actual 144-inch axle spacing, nominal 30.5-inch tire envelope, separate feature bounds and no side-reflector material. Current full model: 463,428 triangles in 20 material batches. This checks software integrity, not real-world fit or a manufacturing tolerance.
- Roof-layout persistence and import/export code are unchanged. Images and private source records remain outside the publication allowlist.
- Final current-version desktop and 375 × 844 Chrome device-emulation checks: bluer paint, six-fork wheels, tire/arch spacing and removed reflectors are visible; Driver/Passenger views, zoom and drag orbit operate without visible horizontal overflow. No observed app console error; only the existing extension-origin inspector permission warning. Physical-device frame rate was not benchmarked.

## Windshield-to-roof transition — 3 November 2026 Pacific

- Compared supplied side and quarter reference pixels and the owner's passenger photo with actual WebGL before/after renders and a fixed-registration 50% side overlay. Found an artificial inward S curve caused by two overly short blending regions above the windshield.
- Broadened both the longitudinal cab bow recovery and transverse roof crown blend, and refined one upper profile point. Changed the antenna pad to follow the sloped surface. Existing windshield upper-edge constraints remain intact.
- Independent review of final front, driver and quarter views confirmed removal of the visible dip, a level attached windshield top and a seated antenna pad, with no blocking local regression. Owner and supplied reference imagery remain private.
- Geometry checks pass for finite positions/normals and valid indices, eleven brow sections without inward slope reversal, level central windshield upper edge, rear seam continuity, 144-inch axle spacing, 234-inch nominal envelope and running-gear/flare bounds. Full model: 463,648 triangles in 20 material batches. Desktop planner side view visually checked; earlier mobile results remain historical evidence.
- This is a visual surface correction, not a measured roof profile or CAD tolerance. Saved layouts, paint and tire dimensions are unchanged.
