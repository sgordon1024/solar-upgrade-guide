# Verification — 3 November 2026

Automated browser checks on local Chrome:

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
- Desktop and mobile screenshots visually inspected. Model is intentionally schematic, not measured body geometry.

The renderer and checks use conservative boxes, not a CAD collision engine. No physical installation or mounting verification has been performed. Source labels do not independently verify inputs. Cross-device storage synchronization is not implemented; JSON is the transfer mechanism.
