# São Paulo Transit Web — Technical Build Guide

## Mission

Build a modern, browser-first public transport application for São Paulo
in **one weekend**, as a focused manual coding run.

Coverage:

-   SPTrans
-   EMTU
-   CPTM
-   Metrô de São Paulo

The prototype must prove one clean end-to-end experience: open the site,
search or inspect nearby transit, understand the route/arrival
information immediately, and use the map without friction.

This is a prototype. Prefer existing libraries, simple architecture, and
vertical delivery over infrastructure work.

------------------------------------------------------------------------

## Product Principles

1.  Browser-first and mobile-first; desktop must still feel
    intentionally designed.
2.  No account required for core functionality.
3.  Transit information always outranks monetization.
4.  Reuse mature libraries and ready-made components. Do not build
    generic UI primitives from scratch.
5.  Normalize provider data behind the backend API.
6.  Never fabricate realtime capabilities.
7.  Realtime information must expose freshness/staleness.
8.  One provider failing must not destroy the entire UI.
9.  Avoid premature infrastructure: no Redis, PostGIS, microservices,
    custom design system, or custom routing engine unless the prototype
    proves they are necessary.
10. Keep code easy for Codex to understand and modify.

------------------------------------------------------------------------

## Fixed Technical Stack

### Monorepo

Use **Turborepo** with **Bun** as package manager/runtime.

``` text
/
├── apps/
│   ├── web/                 # TanStack Start application
│   └── api/                 # ElysiaJS API
│
├── packages/
│   ├── ui/                  # Shared application/domain components
│   ├── transit/             # Canonical transit types + schemas
│   ├── config/              # Shared TS/lint/config
│   └── providers/           # Transit provider adapters
│
├── turbo.json
├── package.json
└── bun.lock
```

Keep the workspace small. Do not create packages merely for
architectural aesthetics.

### Frontend

-   TanStack Start
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui configured with **Base UI**, not Radix UI
-   Base UI for accessible primitives
-   TanStack Query
-   TanStack Router / Start routing
-   MapLibre GL JS
-   Lucide icons
-   Motion only where animation adds meaningful feedback
-   Sonner for lightweight notifications

Do not introduce another UI framework.

Do not recreate buttons, dialogs, drawers, popovers, menus, tabs,
sheets, skeletons, tooltips, inputs, selects, command palettes, etc.
when shadcn/Base UI already provides an appropriate primitive.

Custom components should primarily represent the transit domain:

``` text
JourneyCard
TransitLineBadge
ArrivalBoard
VehicleMarker
StationCard
StopCard
ServiceAlert
TripTimeline
ModeIcon
AdSlot
```

### Backend

-   Bun
-   ElysiaJS
-   TypeScript
-   Provider adapters
-   In-memory caching where useful for the prototype
-   Runtime/schema validation at external-data boundaries

The browser talks to our API. It should not directly consume provider
APIs that require credentials or normalization.

``` text
Browser
   ↓
ElysiaJS API
   ↓
Canonical transit layer
   ↓
Provider adapters
   ├── SPTrans
   ├── EMTU
   ├── CPTM
   └── Metrô
```

Do not add Redis, queues, Kafka, microservices or Kubernetes for the
weekend prototype.

------------------------------------------------------------------------

## Transit Data Strategy

Prefer official GTFS / GTFS-Realtime sources where available.

### SPTrans

Primary prototype integration.

Use official SPTrans developer resources:

-   GTFS for static network information.
-   Olho Vivo for supported realtime information such as bus positions
    and arrival predictions.

Olho Vivo authentication must remain server-side.

### EMTU, CPTM and Metrô

Create explicit provider adapters.

Use verified official/open datasets available for each system.

Static data is sufficient for the prototype where trustworthy realtime
feeds are not available.

**Never simulate vehicle positions or label scheduled information as
realtime.**

Every provider adapter should translate its source into the canonical
domain model.

------------------------------------------------------------------------

## Canonical Transit Model

At minimum:

``` ts
type Agency = {
  id: string
  name: string
  mode: TransitMode
  source: string
}

type Route = {
  id: string
  agencyId: string
  shortName: string
  longName?: string
  color?: string
  mode: TransitMode
}

type Stop = {
  id: string
  name: string
  latitude: number
  longitude: number
  parentStationId?: string
  accessible?: boolean
}

type Vehicle = {
  id: string
  routeId: string
  tripId?: string
  latitude: number
  longitude: number
  bearing?: number
  observedAt: string
}

type Arrival = {
  stopId: string
  routeId: string
  tripId?: string
  scheduledAt: string
  predictedAt?: string
  observedAt?: string
}

type ServiceAlert = {
  id: string
  agencyId: string
  title: string
  description?: string
  severity: "info" | "warning" | "critical"
}
```

Extend these only when implementation requires it.

------------------------------------------------------------------------

# Design Direction

## Visual Reference

The visual language should feel like a combination of **Vercel and
Uber**:

**Vercel:** precision, restraint, strong typography, neutral surfaces,
excellent spacing, crisp borders, minimal visual noise.

**Uber:** transportation-first UX, extremely clear hierarchy, bold
destination/search interactions, strong map integration, obvious
actions, fast scanning.

Use these as design references, **not as assets to copy**.

The result should feel like a premium infrastructure/productivity
product applied to public transportation.

### Keywords

``` text
minimal
precise
urban
premium
functional
fast
quiet
high contrast
map-first
typographic
information-dense without feeling crowded
```

Avoid the visual language of traditional municipal/public-sector
websites.

Avoid playful gradients, excessive glassmorphism, colorful dashboard
cards, giant border radii, decorative illustrations, and unnecessary
shadows.

------------------------------------------------------------------------

## Color System

Default to a near-monochrome interface.

Suggested semantic foundation:

``` text
Background       near-white
Foreground       near-black
Muted surface    subtle neutral gray
Border           subtle neutral gray
Secondary text   medium neutral gray
Critical         red
Warning          amber
Success          green
```

Transit operator and line colors are **data**, not decoration.

Examples:

-   Metrô line color → line badge / route indicator.
-   CPTM line color → line badge / map geometry.
-   SPTrans route colors → only where useful for identification.

Do not splash operator colors across entire cards or pages.

Dark mode can be supported if inexpensive, but it is not more important
than finishing the core journey.

------------------------------------------------------------------------

## Typography

Use a modern grotesk/sans-serif system.

Prefer **Geist** for the product interface.

Typography hierarchy should carry most of the visual design.

Example:

``` text
Hero destination/search       28–36px
Page heading                  24–32px
Section heading               18–20px
Journey time                  18–24px / strong
Body                          14–16px
Metadata                      12–14px
```

Avoid excessive font weights.

------------------------------------------------------------------------

## Layout

Use an 8px spacing system.

Favor:

-   generous whitespace;
-   thin borders;
-   flat surfaces;
-   compact information groups;
-   restrained radius;
-   strong alignment.

Cards should exist because information needs grouping, not because
everything needs a rectangle.

### Mobile

Primary composition:

``` text
┌─────────────────────────────┐
│ Where are you going?        │
│ [Current location → Search] │
├─────────────────────────────┤
│ Nearby                      │
│                             │
│ 875A     3 min              │
│ 702U     7 min              │
├─────────────────────────────┤
│ Journey / Map content       │
├─────────────────────────────┤
│ Home   Nearby   Favorites   │
└─────────────────────────────┘
```

Use bottom sheets/drawers for map-related details where appropriate.

### Desktop

Prefer a split application layout:

``` text
┌──────────────────────────────────────────────────────────────┐
│ Search / navigation                                          │
├─────────────────┬────────────────────────────┬───────────────┤
│                 │                            │               │
│ Results         │            Map             │ Optional ad   │
│ 380–440px       │                            │ rail          │
│                 │                            │ 280–320px     │
│                 │                            │               │
└─────────────────┴────────────────────────────┴───────────────┘
```

The map gets priority over advertising.

If viewport width becomes constrained, remove the ad rail before
shrinking the useful application area.

------------------------------------------------------------------------

## Map UX

MapLibre owns map rendering.

Do not render hundreds of vehicles as React DOM markers.

Prefer MapLibre:

-   GeoJSON sources
-   symbol layers
-   circle layers
-   line layers
-   clustering where useful

React controls application state; MapLibre controls high-volume
geospatial rendering.

The map should remain visually restrained. Avoid showing every possible
stop, vehicle and label simultaneously.

------------------------------------------------------------------------

# Core Screens

## Home

Primary elements:

1.  Origin/destination search.
2.  "Use current location".
3.  Recent/favorite destinations if available.
4.  Nearby stops/stations.
5.  Immediate arrival information.

The search interaction should be visually dominant, inspired by the
clarity of Uber's destination flow.

## Journey Results

Show a small number of high-quality alternatives.

Each `JourneyCard` should prioritize:

``` text
Arrival time
Total duration
Transit modes / lines
Transfers
Walking duration
Service disruption
```

Do not bury the answer in metadata.

## Journey Detail

Use a clear vertical `TripTimeline`.

Example:

``` text
14:32  Walk 4 min
  │
14:36  ● Paulista
  │     Metrô Linha 2 — Verde
  │
14:48  ● Consolação
  │
        Walk 3 min
  │
14:51  Destination
```

## Stop / Station

Show:

-   station/stop name;
-   modes/lines;
-   next arrivals;
-   disruption status;
-   accessibility when available;
-   map position.

## Line

Show:

-   line identity;
-   direction;
-   service status;
-   stops;
-   route geometry;
-   live vehicles only when verified realtime data exists.

------------------------------------------------------------------------

# Advertising

Advertising is allowed, but must never sabotage the transit task.

## Allowed

-   Reserved ad card between secondary content groups.
-   Desktop ad rail.
-   Clearly labeled sponsored local card.
-   Small footer placement that does not cover navigation or transit
    information.
-   Ads after useful journey results have already appeared.

## Forbidden

Never implement:

-   launch interstitials;
-   route-search interstitials;
-   full-screen ads;
-   autoplay video with sound;
-   ads covering the map;
-   ads covering navigation;
-   fake buttons;
-   fake notifications;
-   sponsored routes mixed invisibly with organic results;
-   forced ad viewing before journey details;
-   unexpected redirects.

Reserve ad dimensions before loading creative to avoid layout shift.

`AdSlot` must be an isolated component so monetization can be removed or
changed without affecting transit UI.

------------------------------------------------------------------------

# API Shape

Prototype endpoints may follow:

``` http
GET /v1/search?q=
GET /v1/nearby?lat=&lon=&radius=
GET /v1/journeys?from=&to=&departAt=
GET /v1/stops/:id
GET /v1/stops/:id/arrivals
GET /v1/routes/:id
GET /v1/routes/:id/vehicles
GET /v1/alerts
```

Prefer resource-oriented responses.

Realtime responses should include metadata similar to:

``` json
{
  "data": {},
  "meta": {
    "source": "sptrans-olho-vivo",
    "generatedAt": "ISO-8601",
    "stale": false
  }
}
```

------------------------------------------------------------------------

# Weekend Scope

The time constraint is real: **this should be executable in one weekend
with Codex/AI assistance.**

Every engineering decision should be evaluated against that constraint.

## Friday / Foundation

Goal: application skeleton and first real data.

-   Create Bun/Turborepo workspace.
-   Create `apps/web`.
-   Create `apps/api`.
-   Configure TanStack Start.
-   Configure ElysiaJS.
-   Configure Tailwind.
-   Configure shadcn/ui with Base UI.
-   Add MapLibre.
-   Define canonical transit schemas.
-   Implement first SPTrans adapter.
-   Render first real stops/routes/vehicles.

## Saturday / Product

Goal: make it feel like a transit product.

-   Build home/search.
-   Build map.
-   Nearby stops/stations.
-   Stop details.
-   Line details.
-   SPTrans realtime where available.
-   Add static data for other operators.
-   Implement journey result UI.
-   Build Vercel/Uber-inspired responsive layout.
-   Add loading/error/stale states.

## Sunday / Integration + Polish

Goal: produce a convincing public prototype.

-   Multimodal journey integration using existing routing
    capability/data where feasible.
-   CPTM/Metrô/EMTU integration cleanup.
-   Mobile UX.
-   Desktop split layout.
-   Performance pass.
-   Accessibility pass.
-   Add non-intrusive ad placeholders.
-   Error handling.
-   Deployment.
-   README and architecture notes.

------------------------------------------------------------------------

# Explicit Non-Goals for the Weekend

Do **not** spend weekend time building:

-   custom routing engine from scratch;
-   custom component library;
-   authentication;
-   user profiles;
-   payment infrastructure;
-   ad auction infrastructure;
-   custom map renderer;
-   Redis infrastructure;
-   Kafka;
-   Kubernetes;
-   microservices;
-   elaborate observability stack;
-   native mobile applications;
-   perfect offline mode;
-   ML-based ETA prediction;
-   realtime train positions without an authoritative source.

Mock incomplete **product functionality** only when necessary to
demonstrate UI, and clearly mark it as mock data.

Never present mocked transit information as real.

------------------------------------------------------------------------

# Implementation Rules

While implementing this repository:

1.  Inspect existing code before creating new abstractions.
2.  Prefer existing dependencies over adding new ones.
3.  Prefer shadcn/Base UI components over custom primitives.
4.  Keep TypeScript strict.
5.  Avoid `any` unless interfacing temporarily with untyped external
    data.
6.  Validate external provider responses at the adapter boundary.
7.  Keep provider-specific types inside provider modules.
8.  Convert provider responses into canonical transit types before
    returning them to the frontend.
9.  Keep components small, but do not fragment trivial markup into
    meaningless components.
10. Do not create generic abstractions until at least two real use cases
    require them.
11. Do not add infrastructure merely because it would be appropriate at
    large scale.
12. Preserve accessibility when customizing Base UI/shadcn components.
13. Never expose provider credentials to browser code.
14. Avoid React DOM markers for large map datasets.
15. Always handle loading, empty, error and stale states.
16. Keep advertising code isolated from transit-domain logic.
17. Prefer completing a vertical user flow over broad incomplete feature
    coverage.
18. Before implementing something substantial from scratch, check
    whether the existing stack already solves it.

------------------------------------------------------------------------




# Advertising Architecture & Monetization

## Objective

Advertising is a **secondary monetization layer**, never part of the core transit task.

The product exists because users need fast, reliable transportation information. Monetization must not recreate the hostile experience that creates demand for an alternative.

Core rule:

> **No ad before value.**

A user must receive the information they opened the product to obtain before an advertisement is allowed to compete for attention.

Examples:

```text
GOOD

open station
    ↓
arrivals visible
    ↓
optional ad
```

```text
FORBIDDEN

open station
    ↓
advertisement
    ↓
arrivals
```

---

## Publisher Economics

We are the **publisher**.

We do not normally pay an ad network to display third-party advertisements. Networks such as Google AdSense monetize publisher inventory and share revenue with the publisher.

Conceptually:

```text
Advertiser
    │
    │ pays
    ▼
Ad platform / auction
    │
    │ revenue share
    ▼
Publisher
    │
    ▼
Our ad placement
```

Do not confuse:

```text
Google Ads     = we pay to advertise something
Google AdSense = we monetize our own inventory
```

The initial implementation should not require building an ad server or marketplace.

---

## Revenue Metrics

Do not optimize around clicks alone.

Primary publisher metrics:

```text
CPM
cost/revenue per thousand ad impressions

RPM
publisher revenue per thousand pageviews or ad impressions

CTR
click-through rate

Viewability
whether the advertisement was actually visible
```

For business planning, prefer **RPM**.

Conceptually:

```text
Page RPM =
estimated revenue / pageviews × 1000
```

Do not hardcode assumed Brazilian RPM values into business logic or documentation as guaranteed revenue.

Actual revenue varies significantly by:

- geography;
- advertiser demand;
- device;
- season;
- format;
- viewability;
- audience;
- content context;
- auction competition.

Use scenario modeling rather than revenue promises.

Example planning model:

| Monthly pageviews | R$2 RPM | R$5 RPM | R$10 RPM |
|---:|---:|---:|---:|
| 100k | R$200 | R$500 | R$1,000 |
| 500k | R$1,000 | R$2,500 | R$5,000 |
| 1M | R$2,000 | R$5,000 | R$10,000 |
| 5M | R$10,000 | R$25,000 | R$50,000 |

These are mathematical scenarios only, not AdSense forecasts.

---

## Monetization Evolution

### Phase 1 — Programmatic

Use a publisher network such as **Google AdSense**.

Goals:

- minimal implementation work;
- no direct sales operation;
- validate whether advertising can generate meaningful revenue;
- measure user tolerance and performance impact.

Architecture:

```text
AdSlot
  ↓
AdSense
  ↓
programmatic demand
```

Keep all ad-network integration isolated.

### Phase 2 — Direct Campaigns

Once traffic becomes meaningful, allow direct campaigns.

Potential advertisers:

```text
restaurants
cafés
shopping centers
events
universities
local services
retail near stations
```

Possible products:

```text
station sponsorship
local sponsored card
fixed impression package
campaign by geographic context
monthly placement
```

Direct sales can have better economics because fewer intermediaries participate in the transaction.

### Phase 3 — Contextual Mobility Advertising

The strongest long-term advertising product may be **contextual mobility intent**, not behavioral tracking.

Example:

```text
Destination: Allianz Parque
Context: destination area
```

A relevant sponsored result might be:

```text
Sponsored
Restaurant near Allianz Parque
3 min walk from destination
```

This can be useful without creating a persistent behavioral profile.

Do not use crowdsourced telemetry histories to target advertisements.

---

# Placement Strategy

## Mobile

Target:

> **At most one advertisement competing for the viewport at a time.**

Recommended initial placement:

```text
Search
↓
useful transit information
↓
inline advertisement
↓
secondary content
```

Example:

```text
┌──────────────────────────────┐
│ Where are you going?         │
│ [__________________________] │
│                              │
│ Nearby                       │
│ 875A                  3 min  │
│ 702U                  6 min  │
│                              │
│ ──────────────────────────── │
│ Advertisement                │
│ ──────────────────────────── │
│                              │
│ Favorites                    │
└──────────────────────────────┘
```

Do not place advertising above the primary search interaction.

---

## Journey Results

Useful route alternatives come first.

Preferred:

```text
Journey 1
42 min

Journey 2
48 min

────────────
Advertisement
────────────

Journey 3
53 min
```

Forbidden:

```text
Search
↓
Advertisement
↓
Advertisement
↓
Journey 1
```

Never require an advertisement to load before journey results can render.

---

## Active Journey

Treat active navigation as a protected state.

During an active trip, do not place ads near:

- next-stop instructions;
- transfer instructions;
- disruption warnings;
- ETA;
- map controls;
- navigation controls.

Prefer no advertisement at all if the available placement would compete with safety- or time-critical information.

---

## Desktop

Desktop provides the cleanest advertising inventory.

Preferred layout:

```text
┌─────────────────┬───────────────────────────┬───────────────┐
│                 │                           │               │
│ Journey/results │            Map            │ Advertisement │
│ 380–440 px      │                           │ rail          │
│                 │                           │ 280–320 px    │
│                 │                           │               │
└─────────────────┴───────────────────────────┴───────────────┘
```

The advertisement rail is optional.

Responsive priority:

```text
transit information
      >
map
      >
advertising
```

When space becomes constrained, remove the ad rail before shrinking critical application content.

---

# Allowed Formats

Initial acceptable inventory:

```text
responsive inline display
desktop side rail
clearly labeled sponsored local card
```

Potential later experiment:

```text
small dismissible anchor
```

Only test anchors if they do not collide with bottom navigation or active journey controls.

---

# Forbidden Formats

Do not implement:

```text
vignette / interstitial ads
full-screen ads
launch ads
pre-route ads
route-search interstitials
autoplay video with sound
map-covering ads
navigation-covering ads
fake notifications
fake application buttons
unexpected redirects
forced ad viewing
advertising disguised as organic journey results
large sticky mobile ads
```

A full-screen advertisement between route/search navigations directly violates the product thesis.

Do not enable it merely because an ad network offers it automatically.

---

# Ad Density

Do not maximize revenue by filling unused pixels.

The application should visually feel like:

```text
transit product with advertising
```

not:

```text
advertising product containing transit information
```

One high-viewability placement is preferable to multiple low-quality placements if it preserves retention.

---

# Viewability

An impression being technically served does not mean it had useful advertiser value.

Industry viewability standards commonly evaluate whether a meaningful portion of the creative remained visible for a minimum period.

Therefore optimize for:

```text
fewer
better placed
actually visible
non-disruptive
```

rather than raw ad count.

---

# Performance

Third-party advertising scripts can affect:

- LCP;
- INP;
- CLS;
- bandwidth;
- battery;
- JavaScript execution;
- privacy surface.

Advertising must never block initial transit rendering.

Load ads asynchronously after critical application content.

---

## Layout Stability

Every ad placement must reserve its layout dimensions before the creative loads.

Good:

```tsx
<AdSlot
  placement="home-after-nearby"
  minHeight={100}
/>
```

Bad:

```text
content
content
content

[ad suddenly inserted]

everything shifts
```

Avoid ad-induced CLS.

---

# Ad Component Architecture

Advertising must be isolated from transit-domain components.

Suggested structure:

```text
packages/
└── ads/
    ├── types.ts
    ├── placements.ts
    ├── provider.ts
    ├── adsense.ts
    └── house.ts
```

If this package would contain only trivial code during the prototype, keep it under `apps/web/lib/ads` until separation is justified.

Provider interface:

```ts
interface AdProvider {
  request(slot: AdSlotDefinition): Promise<AdCreative | null>
}
```

Placement type:

```ts
type AdPlacement =
  | "home-after-nearby"
  | "journey-after-primary-results"
  | "stop-secondary"
  | "desktop-side-rail"
```

Intentionally do not define:

```text
before-route-results
trip-navigation-overlay
map-overlay
launch-interstitial
```

If a placement is unacceptable product behavior, make it impossible or awkward to introduce accidentally.

---

# AdSlot

All advertising renders through a controlled component.

```tsx
<AdSlot
  placement="journey-after-primary-results"
/>
```

Responsibilities:

```text
reserve dimensions
lazy-load provider
handle no-fill
respect consent state
respect protected journey state
track performance
track viewability where appropriate
```

Transit components must not contain direct AdSense/network calls.

---

# House Ads

Support a fallback `HouseAdProvider`.

When programmatic inventory is unavailable, the application may show:

- product features;
- contribution/telemetry opt-in;
- feedback request;
- install/PWA prompt;
- future internal products.

Do not force a house ad merely to fill empty space.

Sometimes the correct no-fill UI is nothing.

---

# Privacy Boundary

Advertising and crowdsourced mobility telemetry are separate systems.

Architecture:

```text
                ┌── Transit telemetry
User ───────────┤
                │
                └── Advertising
```

Forbidden data flow:

```text
telemetry
   ↓
advertising profile
```

Do not expose to advertising providers:

- raw location telemetry;
- telemetry session IDs;
- movement histories;
- inferred train membership;
- crowdsourced journey traces.

Contextual placement may use the current product context only when legally and technically appropriate.

Prefer contextual advertising over persistent behavioral profiling.

---

# Consent

Advertising consent requirements depend on:

- provider;
- cookies/storage;
- personalization;
- jurisdiction;
- implementation.

Do not assume that integrating an ad script automatically satisfies LGPD requirements.

Keep consent management separate from transit permission and telemetry permission.

Conceptually:

```text
Location permission
≠
Telemetry contribution consent
≠
Advertising consent
```

They are separate purposes.

---

# Measurement

Do not optimize advertising revenue in isolation.

Track together:

```text
Ad RPM
Viewability
Ad fill rate
CLS attributable to ads
LCP / INP impact
Journey completion rate
Search success rate
Return rate
Session abandonment
```

A monetization change is a failure if a small RPM increase materially damages the transit product.

Example:

```text
RPM +20%
return rate -10%
```

should be treated as potentially negative overall economics, not automatically a win.

---

# Weekend Advertising Scope

## Implement

- `AdSlot` abstraction;
- explicit placement definitions;
- reserved dimensions;
- responsive inline placeholder;
- desktop side-rail placeholder;
- protected active-journey state;
- provider boundary;
- house/no-fill behavior.

## Optional

- AdSense integration if account/site approval and configuration are already available;
- basic impression/viewability instrumentation.

## Do Not Build

- custom ad server;
- real-time bidding;
- advertiser dashboard;
- campaign marketplace;
- direct-sales billing;
- behavioral targeting;
- telemetry-driven targeting;
- native ad auction;
- recommendation ML;
- interstitial system.

The prototype must not be delayed waiting for ad-network approval.

Placeholder inventory is sufficient to validate layout and UX.

---

# Advertising Definition of Done

Advertising is correctly implemented when:

1. The application is completely usable with ads disabled.
2. No ad appears before primary user value.
3. No ad blocks search, routing or navigation.
4. Mobile has no more than one competing ad placement in the viewport.
5. Desktop ads disappear before useful application space is compromised.
6. Ad loading does not block transit data.
7. Reserved slots prevent layout shift.
8. Telemetry data never flows into advertising.
9. All sponsored content is visibly labeled.
10. The ad provider can be replaced without rewriting transit UI.

The long-term optimization target is not:

> maximum ads per session.

It is:

> maximum sustainable revenue while preserving the user's habit of choosing this product for every transit journey.


# Location Search, Distance & Origin→Destination Mapping

## Goal

Provide one coherent geospatial layer for:

- searching places;
- searching stations/stops;
- reverse geocoding;
- user current location;
- destination selection;
- distance calculations;
- nearest-transit discovery;
- walking access/egress;
- origin→destination routing;
- map visualization.

The frontend should never need to know which external geocoder or routing engine produced the result.

---

## Location Search Architecture

Use a provider abstraction.

```text
Search box
   ↓
Search Orchestrator
   ├── Transit Search
   │     ├── stations
   │     ├── stops
   │     ├── routes
   │     └── terminals
   │
   └── Place Search
         └── Geocoder Provider
               ├── Nominatim / OSM   # MVP
               ├── Mapbox            # optional future
               └── Google Places     # optional future
   ↓
Canonical Place[]
   ↓
Ranking
   ↓
Autocomplete UI
```

Transit entities should generally rank above generic geocoder results when the query strongly matches transit intent.

Example:

```text
"pinheiros"

1. Estação Pinheiros
   Linha 4 · Linha 9

2. Terminal Pinheiros
   SPTrans

3. Pinheiros
   Bairro

4. Rua dos Pinheiros
   Endereço
```

---

## Canonical Place Model

```ts
type PlaceType =
  | "address"
  | "street"
  | "neighborhood"
  | "city"
  | "poi"
  | "station"
  | "stop"
  | "terminal"

type Place = {
  id: string
  name: string
  label: string

  latitude: number
  longitude: number

  type: PlaceType

  source:
    | "transit"
    | "osm"
    | "mapbox"
    | "google"

  transit?: {
    network?: "sptrans" | "emtu" | "metro" | "cptm"
    stationId?: string
    stopId?: string
    routeIds?: string[]
  }
}
```

Do not return provider-native geocoder objects to the frontend.

---

## MVP Geocoding Provider

Use **OpenStreetMap/Nominatim** for the weekend prototype.

Reasons:

- no dependency on Google Maps;
- interoperates cleanly with the MapLibre/OSM stack;
- adequate for address, neighborhood and POI search;
- allows the prototype to ship without binding the product to a commercial geocoder.

However, the public Nominatim instance is not appropriate as permanent high-volume infrastructure.

Wrap it behind:

```ts
interface GeocoderProvider {
  search(query: string, options?: SearchOptions): Promise<Place[]>
  reverse(latitude: number, longitude: number): Promise<Place | null>
}
```

Later the implementation may switch to:

- self-hosted Nominatim;
- Photon/Pelias;
- Mapbox Search;
- Google Places;
- another provider.

The rest of the application must not change.

---

## Search Ranking

Autocomplete quality is a product feature.

Do not blindly interleave provider results.

Use a simple deterministic score first.

Possible signals:

```text
exact name match
prefix match
transit entity boost
distance from user
network importance
station/terminal boost
query intent
historical popularity (future)
```

Example:

```ts
score =
  textMatchScore
  + transitIntentBoost
  + proximityScore
  + entityTypeBoost
```

No ML is needed for the prototype.

---

## User Location

Use browser geolocation with explicit permission.

```ts
navigator.geolocation.getCurrentPosition(...)
```

Use current location for:

- nearby stops/stations;
- origin selection;
- local autocomplete ranking;
- map centering;
- access-leg calculation.

Do not block the application if permission is denied.

Fallback:

```text
current location unavailable
        ↓
manual origin search
```

A user must always be able to enter an origin manually.

---

# Distance Model

Different UI questions require different definitions of "distance".

Do not use one function for everything.

## 1. Straight-Line Distance

Use geodesic point-to-point distance for:

- nearby ranking;
- quick radius filtering;
- deciding whether a stop is plausibly nearby;
- early pruning before expensive route calculation.

Use Turf.js or an equivalent Haversine/geodesic implementation.

Conceptually:

```ts
distanceMeters(user, stop)
```

Turf works well here because it is modular, TypeScript-friendly and speaks GeoJSON.

Do **not** show this as walking distance.

Example:

```text
Euclidean/geodesic:
user ───────────── stop
       420 m

actual walk:
user ─ road ─ crossing ─ entrance ─ stop
       610 m
```

---

## 2. Point-to-Line Distance

Use this for:

- matching telemetry to rail geometry;
- checking whether a user is close to a route shape;
- snapping points onto route geometry;
- finding progress along a rail segment.

Turf provides:

```text
nearestPointOnLine
pointToLineDistance
along
lineSliceAlong
```

These are sufficient for prototype-level rail geometry operations.

`nearestPointOnLine` is especially useful because it returns:

- nearest point;
- distance from source point to the line;
- location along the line.

This can become normalized route progress.

---

## 3. Network / Walking Distance

Use a routing engine, not Haversine.

Walking distance must follow the street/pedestrian graph.

Examples:

```text
user → station entrance
station → destination
transfer between stations
```

Do not implement walking graph traversal from scratch.

---

# Routing Engine Decision

## Recommended: Valhalla

Use **Valhalla** as the preferred long-term routing engine for this project.

It supports:

- OpenStreetMap road/pedestrian data;
- walking;
- bicycle;
- driving;
- multimodal routing;
- transit via user-supplied GTFS feeds;
- time-distance matrices;
- map matching.

This matches the product architecture better than a road-only router.

Conceptually:

```text
OSM
 +
GTFS
 ↓
Valhalla
 ↓
multimodal journey
```

Valhalla's route service supports combinations involving walking and public transit, with OSM as the street graph and GTFS supplied for transit.

### Why not build our own routing engine?

Because it would consume the entire weekend and still be worse.

Routing involves:

- graph construction;
- transfer edges;
- calendars;
- trip timing;
- stop sequences;
- walking edges;
- accessibility;
- time-dependent routing;
- service exceptions;
- path reconstruction.

This is infrastructure, not product differentiation for the prototype.

---

## OSRM

OSRM is an excellent alternative for street-network routing and distance matrices.

Use it when you need:

- walking;
- driving;
- bicycle profiles;
- fast road-network shortest paths;
- route distances;
- time/distance tables.

However, OSRM alone is not the preferred architecture for our full transit problem because it does not provide GTFS multimodal transit routing as its core model.

Therefore:

```text
OSRM = good street routing engine
Valhalla = better match for this multimodal transit product
```

---

# Origin→Destination Pipeline

The complete journey flow should look like this:

```text
Origin
  ├── current location
  └── searched place
          │
Destination
  └── searched place
          │
          ▼
Resolve canonical coordinates
          │
          ▼
Nearby transit access search
          │
          ├── nearest stops
          ├── nearest stations
          └── plausible terminals
          │
          ▼
Routing engine
          │
          ├── walking access
          ├── transit legs
          ├── transfers
          └── walking egress
          │
          ▼
Journey alternatives
          │
          ▼
Realtime enrichment
          │
          ├── SPTrans arrival/vehicle
          ├── service alerts
          ├── crowdsourced train state
          └── schedule confidence
          │
          ▼
Journey ranking
          │
          ▼
Frontend timeline + map
```

Routing and realtime enrichment are separate concerns.

Do not make the routing engine responsible for all realtime product state.

---

## Journey Model

```ts
type Journey = {
  id: string

  origin: Place
  destination: Place

  departureAt: string
  arrivalAt: string

  durationSeconds: number
  walkingSeconds: number
  transferCount: number

  legs: JourneyLeg[]

  confidence?: number
}
```

Example leg model:

```ts
type JourneyLeg =
  | {
      type: "walk"
      from: Place
      to: Place
      durationSeconds: number
      distanceMeters: number
      geometry: GeoJSON.LineString
    }
  | {
      type: "transit"
      mode: "bus" | "metro" | "train"
      agencyId: string
      routeId: string
      fromStopId: string
      toStopId: string
      departureAt: string
      arrivalAt: string
      geometry: GeoJSON.LineString
    }
```

Keep the journey model provider-neutral.

---

# Nearby Search

Do a cheap geodesic filter before calling expensive routing operations.

Example:

```text
user coordinate
      ↓
find stops within 1.5 km
      ↓
rank by straight-line distance
      ↓
select top candidates
      ↓
calculate walking route only for finalists
```

This reduces routing calls significantly.

Prototype heuristic:

```ts
const nearbyPolicy = {
  busRadiusMeters: 800,
  railRadiusMeters: 1500,
  maxCandidatesPerMode: 10,
}
```

These are starting values, not product truth.

Tune based on São Paulo geometry and real usage.

---

# Station Entrances

Where data exists, route to **station entrances**, not station centroids.

This matters especially for large stations.

Bad:

```text
user → station polygon center
```

Better:

```text
user → nearest usable entrance
```

Canonical structure:

```ts
type StationEntrance = {
  id: string
  stationId: string
  latitude: number
  longitude: number
  accessible?: boolean
}
```

If entrance data is unavailable, fall back to station coordinates and label the walking estimate as approximate.

---

# Transfers

Transfers are edges in the journey graph.

Examples:

```text
Linha 4 → Linha 2
CPTM → Metrô
bus stop → station entrance
station platform → station platform
```

Transfer cost should include:

- walking time;
- station interchange time;
- expected wait;
- accessibility constraints;
- potentially a small inconvenience penalty.

Do not optimize only for mathematically shortest duration.

A route with:

```text
42 min
1 transfer
```

may be better UX than:

```text
39 min
4 transfers
```

Journey ranking should eventually include a generalized cost:

```ts
cost =
  travelTime
  + walkingPenalty
  + transferPenalty
  + disruptionPenalty
```

For the prototype, keep this deterministic and simple.

---

# Realtime Enrichment

After routing returns a scheduled/planned journey, enrich it.

Example:

```text
planned bus leg
      ↓
SPTrans Olho Vivo
      ↓
vehicle/arrival update
      ↓
adjust displayed departure confidence
```

For rail:

```text
scheduled rail leg
      ↓
official service status
      +
crowdsourced observation
      ↓
confidence-aware UI
```

Do not silently rewrite schedules with weak estimates.

Expose confidence.

---

# ETA vs Distance

Do not derive ETA from distance alone.

Bad:

```ts
eta = distance / averageSpeed
```

for a live transit product.

ETA should consider:

```text
route geometry
current vehicle state
station dwell
headway
schedule
traffic / operating condition
historical segment time
data freshness
```

For the weekend:

- use authoritative SPTrans arrival estimates where available;
- use routing-engine scheduled durations for rail;
- use crowdsourced data only as an explicit estimate.

---

# Map Rendering

MapLibre remains purely the renderer.

```text
routing engine
      ↓
GeoJSON journey geometry
      ↓
MapLibre source/layers
```

Render:

- origin;
- destination;
- access/egress walking lines;
- transit route line;
- transfer points;
- station/stop nodes;
- live/crowdsourced vehicles where available.

Use map layers, not hundreds of React DOM elements.

---

# Route Geometry Helpers

Use Turf for lightweight transformations.

Useful operations:

```text
distance()
nearestPointOnLine()
pointToLineDistance()
along()
lineSliceAlong()
```

Do not use Turf as the multimodal routing engine.

Turf answers geometry questions.

Valhalla/OSRM answer network-routing questions.

---

# Distance Matrix

A distance/time matrix becomes useful for:

- ranking nearby stations;
- selecting access points;
- comparing walking candidates;
- future multi-destination search.

Valhalla provides a time-distance matrix service.

OSRM also provides a Table service returning route duration and/or route distance between coordinate pairs.

Use matrices instead of issuing N×M individual route requests.

---

# Geospatial API Surface

Prototype endpoints:

```http
GET /v1/places/search?q=&lat=&lon=
GET /v1/places/reverse?lat=&lon=

GET /v1/nearby?lat=&lon=&radius=

GET /v1/journeys
  ?originLat=
  &originLon=
  &destinationLat=
  &destinationLon=
  &departAt=

GET /v1/journeys/:id
```

If coordinates originate from a known `Place`, also send its canonical ID where useful.

---

# Weekend Implementation Scope — Location & Routing

## Implement

- location autocomplete;
- Nominatim adapter;
- transit-search index;
- result merging/ranking;
- current-location origin;
- reverse geocoding;
- straight-line distance;
- nearest stops/stations;
- Turf geometry helpers;
- origin/destination map pins;
- route geometry rendering;
- provider-neutral Journey model.

## Prefer to Integrate

- hosted/existing Valhalla instance for multimodal routing if practical;
- otherwise a thin temporary routing provider abstraction.

## Do Not Build

- custom geocoder;
- custom OSM graph parser;
- custom Dijkstra/A* transit engine;
- custom contraction hierarchy;
- custom pedestrian router;
- custom map-matching engine for general roads.

---

# Routing Provider Abstraction

Keep routing replaceable.

```ts
interface RoutingProvider {
  route(request: RouteRequest): Promise<Journey[]>
}
```

Possible implementations:

```text
ValhallaRoutingProvider
OSRMWalkingProvider
MockRoutingProvider      # dev-only
```

The frontend depends only on the application API.

---

# Failure Modes

Handle these explicitly:

```text
geolocation denied
geocoder unavailable
no nearby transit
routing provider timeout
origin == destination
destination outside supported area
walking route unavailable
GTFS service not running at requested time
stale realtime enrichment
```

Do not return generic 500 pages for expected transit-domain failures.

---

# Research Notes

- MapLibre GL JS is a WebGL/TypeScript map renderer; routing remains an external concern.
- Turf.js is appropriate for modular GeoJSON geometry operations such as nearest-point-on-line and point-to-line distance.
- OSRM is an open-source routing engine built around OpenStreetMap and supports fast route/table operations for street networks.
- Valhalla is an open-source OSM routing stack that additionally supports multimodal routing with user-supplied GTFS, plus matrices and map matching.

Official references:

- MapLibre GL JS: https://www.maplibre.org/maplibre-gl-js/docs/
- Turf.js: https://turfjs.org/
- Turf nearestPointOnLine: https://turfjs.org/docs/api/nearestPointOnLine
- Turf pointToLineDistance: https://turfjs.org/docs/api/pointToLineDistance
- OSRM: https://project-osrm.org/
- OSRM API: https://project-osrm.org/docs/
- Valhalla: https://valhalla.github.io/valhalla/
- Valhalla API: https://valhalla.github.io/valhalla/api/
- Valhalla Matrix: https://valhalla.github.io/valhalla/api/matrix/
- Valhalla Meili map matching: https://valhalla.github.io/valhalla/meili/


# Crowdsourced Mobility Telemetry

## Goal

Use **explicitly opt-in, privacy-preserving smartphone telemetry** to improve train/metro estimates where Metrô/CPTM do not expose a public vehicle-position feed.

This system must estimate **transit state**, not build user movement histories.

The primary derived outputs are:

```text
train / service observation
estimated segment
direction
estimated speed
station dwell time
headway
ETA confidence
relative crowding signal
```

Raw user trajectories are an implementation detail and should have a very short lifetime.

---

## Research Conclusions

### Browser geolocation is foreground-first

The W3C Geolocation API supports `watchPosition()`, including latitude, longitude, speed, heading, timestamp and accuracy where the user agent can provide them.

However, the current specification only delivers position updates to **fully active and visible documents**. When the page is hidden, updates are effectively dropped until the document becomes visible again.

Therefore:

**Do not design the browser prototype around reliable background tracking.**

For the weekend prototype, telemetry collection only runs while:

- the user explicitly enables contribution;
- the application is open;
- the relevant document is visible;
- location permission remains granted.

If continuous background sensing becomes strategically important later, evaluate a native mobile companion/application separately. Do not distort the browser architecture trying to emulate native background location.

### Smartphone sensing for metro localization is technically credible

Published research demonstrates that underground/metro localization can be inferred without direct operator telemetry by combining smartphone sensors and known transit topology.

Relevant approaches include:

- crowdsourced accelerometer, magnetometer and barometer patterns;
- accelerometer-based subway positioning;
- trajectory clustering by speed and direction;
- map matching against a constrained transit network.

This validates the broad architecture, but **does not mean we should reproduce research-grade algorithms during the weekend prototype**.

### Aggregation alone is not sufficient privacy protection

Research on mobility datasets shows that aggregate mobility data may still allow individual trajectories to be reconstructed under some conditions.

Therefore:

- do not assume "anonymous ID + aggregation" is sufficient;
- minimize collection before storage;
- rotate identifiers;
- discard raw traces quickly;
- avoid storing origin/destination histories;
- never expose contributor-level observations through public APIs;
- only publish aggregate transit-state observations after minimum contributor/confidence thresholds.

---

## User Consent UX

Telemetry participation must be a separate, explicit opt-in.

Do not rely on acceptance of Terms of Service as the only signal.

Suggested flow:

```text
Help improve train predictions

When this feature is enabled, the app can use your
location while this page is open to estimate train
movement and travel times.

Raw observations are temporary and are converted
into aggregate transit information.

[Not now] [Help improve predictions]
```

After opt-in, request browser geolocation permission.

The contribution state must remain visible while active.

Provide a one-tap way to stop contributing.

Do not request motion sensors by default.

---

## Architecture

```text
Browser
  │
  │ explicit opt-in
  │
  ├── Geolocation.watchPosition()
  │
  ▼
Telemetry Collector
  │
  ├── accuracy filtering
  ├── sampling / throttling
  ├── ephemeral session ID
  └── client timestamps
  │
  ▼
POST /v1/telemetry/samples
  │
  ▼
Telemetry Ingest
  │
  ├── schema validation
  ├── rate limiting
  ├── sanity checks
  └── duplicate rejection
  │
  ▼
Transit Map Matcher
  │
  ├── nearby railway geometries
  ├── route/direction candidates
  ├── station proximity
  └── speed consistency
  │
  ▼
Observation Window
  │
  ├── spatiotemporal clustering
  ├── direction agreement
  ├── speed agreement
  └── station event detection
  │
  ▼
Transit State Estimator
  │
  ├── vehicle/service hypothesis
  ├── segment progress
  ├── speed
  ├── dwell time
  ├── headway
  └── confidence
  │
  ▼
Aggregate Transit Observation
  │
  ├── no contributor IDs
  └── short TTL
  │
  ▼
Frontend
```

For the weekend prototype, these stages may live inside the same ElysiaJS application.

Do not create separate telemetry microservices.

---

## Raw Sample Schema

Use the smallest useful payload.

```ts
type MobilitySample = {
  sessionId: string
  observedAt: string

  latitude: number
  longitude: number
  accuracy: number

  speed?: number
  heading?: number
}
```

Rules:

- `sessionId` is random and ephemeral.
- Rotate it frequently; it must not be a permanent user identifier.
- Do not include account ID, email, advertising ID, phone number or device fingerprint.
- Reject coordinates with obviously unusable accuracy.
- Do not collect arbitrary browser/device metadata "because it may be useful later".
- Do not infer or store home/work locations.

---

## Sampling Strategy

Do not send every callback blindly.

Start conservatively.

Example logic:

```text
watchPosition()
      ↓
accuracy acceptable?
      ↓
minimum time/distance delta reached?
      ↓
likely near supported transit geometry?
      ↓
send sample
```

Initial heuristics can be simple:

```ts
const telemetryPolicy = {
  maxAccuracyMeters: 80,
  minimumIntervalMs: 5_000,
  minimumDistanceMeters: 10,
}
```

These are prototype defaults, not scientifically calibrated constants.

Tune them from real testing.

When a contributor is clearly nowhere near a rail corridor, avoid uploading unnecessary samples.

---

## Map Matching

The rail network is highly constrained compared with general road navigation.

Exploit that.

Represent each rail line as ordered geometry segments and station nodes:

```text
Station A
   │
segment A-B
   │
Station B
   │
segment B-C
   │
Station C
```

For each sample:

1. Find nearby rail segments within a bounded radius.
2. Project the sample onto candidate geometries.
3. Calculate distance from geometry.
4. Compare movement heading with line direction.
5. Compare speed with plausible transit movement.
6. Prefer continuity with the previous matched segment in the same ephemeral session.
7. Generate a match confidence.

Prototype output:

```ts
type MatchedMobilitySample = {
  sessionId: string
  observedAt: string

  network: "metro" | "cptm"
  lineId: string

  segmentId: string
  direction: 0 | 1

  progress: number
  speed?: number

  confidence: number
}
```

`progress` is normalized from `0` to `1` along the segment.

Do not expose this type publicly.

---

## Underground Behavior

GPS reliability may degrade or disappear underground.

Do not pretend otherwise.

The first version should degrade gracefully:

```text
good surface fix
      ↓
station / tunnel
      ↓
missing or poor GPS
      ↓
retain last high-confidence hypothesis briefly
      ↓
new valid observation
      ↓
reconcile with network topology
```

Do not extrapolate indefinitely.

A stale hypothesis must decay in confidence.

Later, optional sensor fusion can use:

- accelerometer;
- gyroscope;
- magnetometer;
- barometer;
- known station sequence;
- historical travel time;
- other concurrent contributors.

Research systems such as MLoc have demonstrated metro localization using crowdsourced accelerometer, magnetometer and barometer patterns, while SubwayPS demonstrated accelerometer-based underground positioning.

This is **post-MVP research**, not weekend scope.

---

## Motion Sensors

Browser motion/orientation sensors can provide acceleration and rotation information, but support and permission behavior vary.

On browsers that implement `DeviceMotionEvent.requestPermission()`, access requires a secure context and a user-triggered permission request.

Therefore:

- telemetry v0 = geolocation only;
- motion sensors = optional experimental capability later;
- never block the core transit experience on motion permission;
- never request motion permission during initial page load.

---

## Spatiotemporal Clustering

A single contributor is weak evidence.

Multiple independent observations moving together along the same line are much stronger evidence.

Conceptually:

```text
session A ─┐
session B ─┼── same line
session C ─┤   same direction
session D ─┘   similar position + velocity
             ↓
        candidate train cluster
```

For every time window:

1. Group samples by line and direction.
2. Project samples to one-dimensional progress along the route.
3. Cluster by progress/time.
4. Reject obvious outliers.
5. Calculate cluster velocity.
6. Associate the cluster with the nearest plausible train/service hypothesis.
7. Emit only when confidence crosses a minimum threshold.

Do not start with machine learning.

A deterministic clustering approach is easier to inspect, debug and calibrate.

Possible future algorithms:

```text
DBSCAN / HDBSCAN
Kalman filter
Hidden Markov Model
particle filter
```

Do not add these merely for sophistication.

---

## Aggregate Train Observation

The public product consumes derived transit observations, not user traces.

```ts
type CrowdsourcedTransitObservation = {
  network: "metro" | "cptm"
  lineId: string
  direction: 0 | 1

  segmentId: string
  progress: number

  estimatedSpeed?: number
  estimatedEtaSeconds?: number

  contributorCount: number
  confidence: number

  observedAt: string
  expiresAt: string
}
```

Never expose session IDs in this object.

Apply a minimum contributor count before presenting an observation as crowdsourced realtime.

For low density, downgrade the UI:

```text
high confidence   → LIVE ESTIMATE
medium confidence → ESTIMATED
low confidence    → scheduled data only
```

---

## Station Event Detection

Station arrivals/departures are more valuable and often easier to infer than perfect continuous coordinates.

Detect events such as:

```text
moving
  ↓
deceleration
  ↓
station geofence
  ↓
near-zero movement
  ↓
dwell
  ↓
acceleration
```

Derived event:

```ts
type StationPassageObservation = {
  lineId: string
  stationId: string
  direction: 0 | 1

  arrivedAt?: string
  departedAt?: string
  dwellSeconds?: number

  confidence: number
}
```

These events can improve:

- travel-time estimates;
- headways;
- ETAs;
- disruption detection.

For an underground network, reliable station-passage timing can be more valuable than drawing a continuously moving train icon.

---

## Relative Crowding

Do **not** attempt to infer an absolute passenger count from contributor count.

The participation rate is unknown and biased.

Instead, contributor density may eventually become one signal in a relative crowding model.

Example:

```text
expected active contributors for this service/time = 4
observed active contributors                     = 11

→ stronger-than-normal crowding signal
```

Combine with explicit user reports:

```text
How crowded is this train?

[Empty] [Comfortable] [Busy] [Packed]
```

Final product categories:

```text
LOW
NORMAL
HIGH
VERY HIGH
```

Always label this as **estimated crowding** unless authoritative occupancy telemetry is obtained.

Never display fake precision such as `83% full` without a calibrated source that justifies it.

---

## Privacy Architecture

Treat location as sensitive infrastructure.

### Principles

```text
collect less
retain less
derive quickly
aggregate early
separate identity
expire aggressively
```

### Required controls

1. Explicit telemetry opt-in.
2. No telemetry required to use the application.
3. Ephemeral rotating session identifiers.
4. No permanent contributor identity in raw telemetry.
5. Transport over HTTPS only.
6. Strict input validation.
7. Short raw-data TTL.
8. Derived aggregate data separated from raw observations.
9. No public contributor-level API.
10. User-facing ability to disable contribution.
11. Clear explanation of collection purpose and retention.
12. Do not share raw location with ad providers.

### Raw data lifetime

For the prototype, prefer an in-memory rolling observation window.

Example:

```text
raw samples:              minutes
matched ephemeral data:   minutes
aggregate train state:    short operational TTL
historical statistics:    aggregates only
```

Do not create a permanent raw trajectory database during the weekend prototype.

If raw samples must temporarily be persisted for debugging, make that an explicit development-only mode with aggressive deletion.

---

## Ad-System Isolation

Crowdsourced telemetry must have **zero coupling** to advertising.

Forbidden:

```text
location telemetry → ad targeting
session movement   → ad profile
station history    → advertising identity
```

The telemetry subsystem exists only to improve transit information.

Do not expose telemetry objects to third-party ad scripts.

---

## Telemetry API

Prototype API:

```http
POST /v1/telemetry/samples
GET  /v1/telemetry/transit-observations
```

Example ingest body:

```json
{
  "samples": [
    {
      "sessionId": "ephemeral-id",
      "observedAt": "2026-08-13T18:10:00Z",
      "latitude": -23.0,
      "longitude": -46.0,
      "accuracy": 22,
      "speed": 14.2,
      "heading": 91
    }
  ]
}
```

Batch small numbers of samples when useful to reduce request overhead.

Reject malformed or impossible values immediately.

Rate-limit by short-lived server-side signals without building a durable identity graph.

---

## Suggested Package Structure

Extend the monorepo only where the implementation earns it:

```text
packages/
├── transit/
│   ├── model/
│   ├── geometry/
│   └── schemas/
│
├── providers/
│   ├── sptrans/
│   ├── metro/
│   ├── cptm/
│   └── emtu/
│
└── telemetry/
    ├── collector-types.ts
    ├── matching.ts
    ├── clustering.ts
    ├── confidence.ts
    └── privacy.ts
```

If `packages/telemetry` contains only one or two trivial files during the prototype, keep them inside `apps/api` instead.

Do not create package boundaries prematurely.

---

## Weekend Telemetry Scope

### Implement

- explicit consent UI;
- foreground `watchPosition()`;
- ephemeral session ID;
- basic sampling/throttling;
- telemetry ingest endpoint;
- schema validation;
- short in-memory rolling buffer;
- rail-line proximity matching;
- simple segment projection;
- basic confidence score;
- development visualization of matched samples;
- derived aggregate observation type.

### Optional if time remains

- multi-user clustering;
- station passage detection;
- explicit crowding report UI;
- confidence decay.

### Do not implement this weekend

- native background tracking;
- IMU sensor fusion;
- ML models;
- differential-privacy mechanisms;
- persistent raw trajectory warehouse;
- exact train identity matching;
- absolute occupancy estimation;
- production-grade anti-fraud;
- federated learning.

---

## Future Evolution

If usage justifies the system:

```text
v0
foreground GPS
simple map matching

        ↓

v1
spatiotemporal clustering
station events
headway estimation

        ↓

v2
optional motion sensor fusion
underground inference
confidence calibration

        ↓

v3
native app capability
reliable background sensing
larger crowdsourced network

        ↓

v4
operator partnership
authoritative realtime feeds
crowdsourcing becomes validation/fallback
```

The long-term goal is **not** to permanently replace authoritative operator telemetry with phones.

The ideal architecture eventually combines:

```text
official operator feeds
        +
crowdsourced observations
        +
historical schedules
        +
service alerts
        ↓
confidence-aware transit state
```

Crowdsourcing should become an independent validation/fallback layer when better official data becomes available.

---

## Research References

- W3C, **Geolocation** (2026): https://www.w3.org/TR/geolocation/
- MDN, **DeviceMotionEvent.requestPermission()**: https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/requestPermission_static
- Ye et al., **Crowdsourced Smartphone Sensing for Localization in Metro Trains (MLoc)**: https://arxiv.org/abs/2003.10531
- Stockx, Hecht & Schöning, **SubwayPS: Smartphone Positioning in Underground Public Transportation Systems**: https://arxiv.org/abs/1904.01675
- Ben Said et al., **Mobile Crowdsourced Sensors Selection for Journey Services**: https://arxiv.org/abs/1812.08877
- Xu et al., **Trajectory Recovery From Ash: User Privacy Is NOT Preserved in Aggregated Mobility Data**: https://arxiv.org/abs/1702.06270
- Haydari et al., **Differential Privacy in Aggregated Mobility Networks**: https://arxiv.org/abs/2112.08487


# Coding Run Roadmap

> **One working vertical slice is worth more than ten half-built systems.**

Keep `NOW / NEXT / LATER / BUGS` in a scratchpad. Commit after every working milestone.

## 0 — Freeze scope · 15–20 min
Target: `open → search/use location → nearby transit → useful transit info → map`. Origin→destination is stretch. Telemetry, ads, accounts and perfect rail realtime are not blockers.

## 1 — Bootstrap · 45–60 min
Bun + Turborepo with `apps/web`, `apps/api`, `packages/transit`. Configure TanStack Start, ElysiaJS and TypeScript. **Exit:** one `bun dev`; web renders; `/health` returns 200.

## 2 — Visual shell · 1–1.5 h
Tailwind + shadcn/ui/Base UI + Geist + Lucide. Build the Vercel/Uber-style desktop split layout and mobile shell using fixture data. No custom design system.

## 3 — MapLibre · ~45 min
São Paulo viewport, responsive map, origin/destination markers, GeoJSON sources/layers. Avoid high-volume React DOM markers.

## 4 — Canonical domain · 30–45 min
Define only `Agency`, `Route`, `Stop`, `Vehicle`, `Arrival`, `ServiceAlert`, `Place`, `Journey`, `JourneyLeg`. Provider JSON never leaks through adapters.

## 5 — SPTrans real data · 1.5–2.5 h
Olho Vivo auth → line search → stops → vehicle positions → arrivals if practical. **Critical exit:** search a real line and render real buses/stops through Elysia + MapLibre.

## 6 — Location search · 1–1.5 h
Transit search + Nominatim → canonical `Place[]` → ranking. Add debounce/cancellation. `Pinheiros` should favor transit; addresses should resolve normally.

## 7 — Current location + nearby · ~1 h
Browser geolocation with denial/error fallback. Geodesic shortlist → nearby stops/stations → list + map.

## 8 — Metrô/CPTM/EMTU · 2–3 h
Add lines, stations/stops, geometry and basic service data: Metrô → CPTM → EMTU. Static is acceptable when verified realtime is absent. Never fake realtime; distinguish `LIVE`, `ESTIMATED`, `SCHEDULED`.

## 9 — Journey UI · ~1 h
With fixtures, build `JourneyCard`, `TripTimeline`, walking/transit legs, transfers and warnings. Make the canonical `Journey` contract concrete before routing.

## 10 — Routing · 2–4 h
Integrate Valhalla or another replaceable provider. Do **not** build a routing engine. If multimodal integration becomes a rabbit hole, keep the working search/map/nearby product and defer it.

## 11 — Realtime enrichment · 1–1.5 h
SPTrans planned leg + Olho Vivo; rail scheduled leg + operational status/crowdsourced estimate when justified. Preserve confidence semantics.

## 12 — Failure states · ~1 h
Provider failure, auth failure, no results, denied location, geocoder timeout, unavailable route, stale realtime, slow connection. No endless spinners.

## 13 — Mobile pass · 1–1.5 h
Test a real phone: keyboard, map gestures, safe areas, bottom nav/sheets, viewport height, scrolling and touch targets.

## 14 — Performance · 45–60 min
Fix measured problems only: duplicate requests, geocoder debounce, MapLibre layers, payloads, rerenders and layout shifts.

## 15 — Ads shell · 30–45 min
Only now: `AdSlot`, reserved dimensions, one mobile inline placeholder, optional desktop rail, protected active-journey state. Do not wait for AdSense approval.

## 16 — Telemetry spike · 1–2 h MAX · stretch
Explicit opt-in → `watchPosition()` → ephemeral session → throttle → ingest → in-memory window → basic rail map matching. If it starts consuming the day, stop.

## 17 — Ship
Remove debug/dead code and fake production data. Final phone/desktop test, README and deployment.

## Priority ladder

**P0:** monorepo, web/API, clean shell, MapLibre, real SPTrans, search, current location, nearby transit.

**P1:** Metrô/CPTM/EMTU, location search, journey UI, routing, realtime semantics, mobile polish.

**P2:** alerts, station entrances, realtime enrichment, ad slots, performance polish.

**P3:** telemetry, crowding estimation, station-passage inference, sensor fusion.

> **If P0 is incomplete, do not touch P3.**

## Anti-rabbit-hole rules

1. If a library solves 80%, use it.
2. One consumer usually does not justify an abstraction.
3. Keep ugly provider data behind adapters.
4. Missing data degrades honestly; never invent it.
5. Defer infrastructure unrelated to the demo.
6. After ~20 minutes polishing one component, move on.
7. Do not rewrite working code because another architecture looks cleaner.
8. Commit after every milestone; keep the app runnable.
9. After ~30 minutes stuck, reduce the problem to the smallest observable test.
10. P0 before P3. Always.

## Suggested Git checkpoints

```text
chore: bootstrap turbo workspace
feat(web): add application shell
feat(web): integrate maplibre
feat(transit): define canonical domain
feat(api): integrate sptrans
feat(web): render live sptrans vehicles
feat(search): add place and transit search
feat(location): add nearby transit
feat(transit): add metro and cptm datasets
feat(transit): add emtu dataset
feat(journey): add journey presentation
feat(routing): integrate routing provider
feat(realtime): enrich journey state
feat(web): polish mobile experience
feat(ads): add non-blocking ad slots
feat(telemetry): add opt-in location sampling
docs: document prototype
```


# Definition of Done

The weekend prototype is successful when a user can:

1.  Open the application in a browser.
2.  Allow or manually provide a location.
3.  See nearby public transport.
4.  Search for a destination or transit line.
5.  Understand at least one useful journey option.
6.  Inspect the journey on a clean map.
7.  View meaningful SPTrans realtime information where supported.
8.  Navigate information covering SPTrans, EMTU, CPTM and Metrô.
9.  Use the core product without creating an account.
10. Complete all of the above without an advertisement interrupting the
    task.

The prototype does not need to prove global scalability.

It needs to prove that São Paulo public transit information can be
delivered through a **faster, cleaner and substantially less hostile
user experience**.
