# Mod 01: 800 W solar proposal

The selected plan is **four HQST HSP200N-64L 200 W panels in one series string (4S1P)**, retaining the existing Victron SmartSolar 150/35 and recorded 48 V system. This was recovered from the [existing solar guide](https://sgordon1024.github.io/solar-upgrade-guide/). The optional preview replaces only the illustrated existing panels. Saved roof equipment, notes and other upgrades remain intact. Toggle it under **Tools → Mod 01** on a phone. Export the complete parts list, sources, calculations and your proposed coordinates from that panel; ordinary layout export/import also retains the proposal.

## What can be reused?

The controller's published limits support this array on the recorded 48 V system. A larger controller is not selected or required solely because the array is 800 W. Verify the actual controller label and battery/BMS charge settings. The existing roof wiring, connectors, entry/combiner and isolators are **conditional reuse**: their labels, internal topology, condition and cable route are not documented sufficiently to call this a panel-only swap. No new electrical hardware has been selected.

The on-screen parts list includes the panels, risers/bars/clamps, controller, PV cabling/connectors, combiner/entry, protection/isolation, battery circuit and bonding/sealing/fasteners. Hidden components are listed rather than given fictitious installed locations.

## Electrical review · checked 2026-11-05

[HQST's model-specific PDF](https://cdn.shopify.com/s/files/1/0938/4627/4366/files/HSP200N-64L_-_Manual.pdf?v=1779096675) specifies Voc 22.4 V, Isc 11.04 A, Vmp 19.2 V and Imp 10.5 A per panel. Voc coefficient is −0.28%/°C; Isc coefficient +0.048%/°C. The [current product page](https://hqsolarpower.com/products/hqst-200w-16bb-n-type-high-efficiency-monocrystalline-solar-panel) gives ±3% electrical tolerance and Vmp 19.02 V, conflicting with the PDF. Calculations use PDF Vmp, conservative positive tolerance for Voc/Isc, and require confirmation against delivered labels. The selected model is **64L**, not bifacial 64LT.

For four in series:

- STC: 89.6 V Voc, 76.8 V Vmp, 10.5 A Imp, 11.04 A Isc; rated array 800 W.
- Cold Voc = 4 × 22.4 × 1.03 × [1 − 0.0028 × (minimum temperature − 25)]. At −40°C it is **109.08 V**. The editable default −20°C is a scenario, not a known travel minimum.
- Isc at 85°C with +3% tolerance is **11.70 A**. This is a temperature screen, not cable/protection sizing; irradiance and required design factors still apply.
- 800 / 48 ≈ 16.7 A is only a nominal output estimate before losses; actual charging voltage and conditions change output.

[Current Victron specifications](https://www.victronenergy.com/media/pg/Manual_SmartSolar_MPPT_150-35__150-45/en/technical-specifications.html) list 150 V maximum PV voltage, 35 A maximum PV short-circuit current, 35 A battery output and 2,000 W nominal PV power at 48 V. The [Victron datasheet](https://www.victronenergy.com/upload/documents/Datasheet-SmartSolar-charge-controller-MPPT-150-35-%26-150-45-EN.pdf) specifies 145 V startup/operating and 150 V absolute cold-weather maxima. That PDF lists 40 A PV Isc; we use the lower current manual limit. This array is below each relevant limit. At 12 V the power rating would instead be 500 W, so the recorded **48 V** system matters.

[Installation guidance](https://www.victronenergy.com/media/pg/Manual_SmartSolar_MPPT_150-35__150-45/en/installation.html) requires PV voltage above battery voltage by 5 V to start and 1 V to continue. 2S2P gives about 38 V at maximum power and is unsuitable for this 48 V bank. Hot/shaded 4S performance still needs checking against the configured charge voltage; no manufacturer Vmp temperature coefficient was found. Existing parallel branches cannot simply be assumed to form the selected series string.

Factory panel leads are 14 AWG / 0.7 m, which does not validate the van cable. Confirm actual conductor size, insulation voltage/temperature ratings, routing/derating, voltage drop, connector family and mating, roof-entry topology, DC isolator voltage/poles/load-break rating, protection and bonding. The module's **20 A maximum series fuse is a ceiling, not a chosen fuse**. Battery-side protection must suit the existing controller/cable installation. This is a compatibility review, not an executable wiring or isolation procedure.

## Mounting and fit

Nominal module size is 1175 × 765 × 30 mm (46.26 × 30.12 × 1.18 in), 9.15 kg / 20.17 lb. Four panels weigh 80.69 lb before hardware. Three rows (front landscape, middle portrait, rear pair portrait) need **122.64 in before gaps**; the rear pair is **60.24 in before its center gap**. Both exceed the owner's track-referenced 122 × 60 in rectangle. That rectangle is not a load-rated mounting boundary.

The preview uses this selected orientation but **estimated offsets and Z elevations**. The front panel bottom starts at illustrative Z6.5; the other three at Z14.5. These are independently adjustable positions, not a claimed 7.5-inch riser installation. The rear pair and middle panel use four conceptual raised spans with eight generic amber riser plates; independently changing the rear panels' heights/stations creates separate supports. Counts, shapes, crossbar sections, clamp locations and fasteners are not approved hardware selections. The old lower panel-support spans remain visible as conditional reuse.

The prior [Unaka 7.5-inch high-bar candidate](https://unakagearco.com/products/unaka-high-bar-bracket-kits) is not confirmed for this rack. It supplies four brackets; bars and attachment hardware are separate. Published interfaces cover Unaka racks or an OEM-rail option, with 15-series/round-bar connections. That does not establish a match for the existing double-channel rack and 2 × 1-inch bars. The product is REV2 while the [linked manual](https://cdn.shopify.com/s/files/1/0412/9898/5124/files/High_Bar_Kit_Install_Manual_Rev_0.pdf?v=1792502136) describes REV1. Its rise reference is not the owner's A/C crossbar datum, so subtracting 6 from 7.5 does **not** establish clearance.

[Mesa's alternative guide](https://desertbliss.com/desertvans/assets/docs/Desert-Vans-Mesa-Riser-Installation-Guide.pdf) uses 2⅞-inch slot centers versus the reported 3 inches. Its 7 13/16-inch rise runs from upper slot center to new crossbar underside. Four risers have a 60 lb platform limit including bars/hardware; two panels consume 40.34 lb, leaving 19.66 lb. All four panels exceed that limit alone. It expressly does not establish panel wind-uplift capacity. Mesa is not the selected mount.

Panel and generic support-envelope screening flags the rear pair's overhang and the driver's rear panel against the packed snowboard envelope, including driver-side risers. Moving panels higher does not resolve airflow, wind loads, signal obstruction or service access. Open-fan envelope, actual A/C airflow/service zone, Starlink RF/shading, antennas, clamp/rack interface, dynamic loading, road height and support overhangs remain unverified. No existing accessory is silently relocated or deleted.

## Measurements to gather

1. Photograph the rack extrusion/profile and all mounting slot centers with tape endpoints; identify rack model.
2. From one marked datum, measure upper slot center, existing crossbar top, A/C top and fully open fan. Confirm whether the earlier 6.5 inches reaches bar top, center or bottom.
3. Measure usable mounting span, all crossbar stations, panel support/clamp locations and approved load/overhang limits.
4. Measure Starlink footprint/tilt/movement, antenna positions and packed snowboard/clamp envelope, including access space.
5. Record visible labels for existing PV wire, connectors, roof entry/combiner and isolators without opening energized equipment. A qualified installer should document internal wiring, protection and charge settings.

Original geometry and calculations are MIT licensed with the planner. Source links do not transfer manufacturer CAD or photography into this repository.

## Current rear 2×2 alternative · 5 November 2026

The historical layout above remains documented; the new optional preset is described in [the planner guide](README.md#rear-22-roof-study--5-november-2026). Four portrait modules form a 61.24 × 93.52-inch block with 1-inch gaps, Z18 panel bottoms and four generic raised spans/eight risers. Positions, rail attachment points and bracket heights are illustrative. The owner-measured 23 × 20-inch 50 W panel is a **separate chassis circuit**, excluded from all 800 W house-string arithmetic. No new chassis controller or electrical parts have been selected.

The rack is just under 52 inches across its outside rails; first/rear crossbar centers are 130 inches apart. Neither substitutes for the separate 60 × 122-inch planning reference. The outside passenger-rail awning, packed bag approximately 60 × under15 × 7 inches, clamp positions, loading path and Starlink footprint stay in screening. Bag thickness is not a riser dimension. Editable overhang allowances are planning inputs, not physical authorization. The parts list includes the chassis circuit and optional cargo support alongside existing hidden electrical components.

## Selected-panel support correction · 6 November 2026

Unequal panel heights can place one module underneath the neighboring module’s full-width support spans. The roof editor now detects that relationship from the generated support envelopes and offers a selected-panel-only raise to the highest crossing support top, rounded upward to 0.01 inch. It preserves every other saved position and has a guarded session undo. Support ownership and the new flags also appear in solar reports. Existing layouts, imports and presets are not automatically modified. The corrected height remains an estimated roof-datum coordinate, not a verified riser specification or installation clearance.

## Rear rail boundary correction · 6 November 2026

The rear rails and fairing were brought over the final shell roof without moving saved panels, risers, other equipment or the planning origin. Visible rail end is now planning Y123 (estimated); the recorded 130-inch crossbar-center span is unregistered and not a verified mounting envelope. The rear 2×2 example still reaches Y128.26, leaving 5.26 inches beyond the illustrated rail ends. Rear riser feet reach Y121.76; having a drawn footprint inside the rails does not establish attachment or capacity. Screening now flags full support-foot footprints that exceed the visible rail span; mounting, airflow, load and overhang questions remain open.
