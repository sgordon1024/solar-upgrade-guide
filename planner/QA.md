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
