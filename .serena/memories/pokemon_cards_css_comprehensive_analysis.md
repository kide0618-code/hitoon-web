# Pokemon Cards CSS - Comprehensive Analysis

## Project Overview
- **Framework**: Svelte (Vite build tool)
- **Language**: JavaScript + CSS
- **Purpose**: Advanced CSS effects for realistic Pokemon trading card animations
- **Location**: `/Users/hidenari-yuda/hitoon-web/pokemon-cards-css/`

## 1. Overall Structure

### Root Components
- `src/App.svelte` - Main app with card categories and showcase
- `src/Cards.svelte` - Card list component
- `src/Search.svelte` - Search functionality
- `src/app.css` - App-level styles
- `index.html` - HTML entry point

### Component Architecture
```
src/lib/components/
├── Card.svelte (main card component - Svelte 19, React equivalent)
├── CardProxy.svelte (wrapper)
└── promos.json / alternate-arts.json (card data)

src/lib/stores/
├── activeCard.js (writable store for selected card)
└── orientation.js (readable store for device orientation)

src/lib/helpers/
└── Math.js (utility functions: round, clamp, adjust)
```

### CSS Architecture
```
public/css/
├── global.css (base styles, layout)
├── cards.css (main card CSS variables)
└── cards/ (rarity-specific styles)
    ├── base.css (core card structure, transforms, 3D)
    ├── basic.css (no-holo cards)
    ├── regular-holo.css (standard holographic effect)
    ├── rainbow-holo.css (rainbow rare, glitter, secret rare)
    ├── cosmos-holo.css (galaxy/cosmos effect)
    ├── radiant-holo.css (radiant rare with cross-hatch pattern)
    ├── secret-rare.css (gold secret rare)
    ├── v-regular.css (V cards with diagonal gradients)
    ├── v-full-art.css (ultra rare full art)
    ├── v-max.css
    ├── v-star.css
    ├── shiny-rare.css
    ├── trainer-gallery-*.css (multiple trainer gallery variants)
    ├── amazing-rare.css
    ├── reverse-holo.css
    └── [additional rarity variants]

public/img/ (foil/texture assets)
├── glitter.png (sparkle effect texture)
├── grain.webp (subtle grain overlay)
├── geometric.png, illusion.png, illusion-mask.png (foil textures)
├── cosmos-*.png, cosmos-*.gif (layered galaxy images)
├── galaxy.jpg (background)
└── [various texture patterns]
```

---

## 2. CSS Effects Implementation

### Core Techniques Used

#### A. 3D Transforms
- **Device**: 3d perspective with 600px depth
- **Rotations**: `rotateX()` and `rotateY()` based on mouse/device position
- **Transform Style**: `preserve-3d` for depth layering
- **Hardware Acceleration**: `translate3d()` for GPU rendering
- **Backface Visibility**: Controls front/back rendering (card flip effect)

#### B. Gradient Systems
- **Multiple Overlaid Gradients**: 3-4 layers per rarity type
- **Repeating Gradients**: Create scanline, bar, and stripe effects
- **Linear Gradients**: Used for holo beams at various angles (0°, 45°, 82°, 110°, 133°)
- **Radial Gradients**: For glare, glow, and pointer-following effects
- **Conic Gradients**: Used for secret rare spinning gold effect
- **Dynamic Positioning**: Background-position updates via CSS variables based on mouse position

#### C. Blend Modes
Common blend modes used:
- `color-dodge` - Main effect for shininess, creates bright glow
- `hard-light` - Creates metallic intensity
- `overlay` - Combines multiple effects
- `soft-light` - Subtle blending of textures
- `multiply` - Darkening effects
- `screen` - Lightening effects
- `lighten` - Maximum lightness between layers
- `darken` - Maximum darkness between layers
- `exclusion` - Creates unique color interactions
- `difference` - Creates contrast effects
- `color-burn` - Darkens with color intensity

#### D. Filters
- `brightness()` - 0.2 to 2.5 range for intensity control
- `contrast()` - 1 to 4 for depth/pop
- `saturate()` - 0.35 to 2.7 for color intensity
- All can be dynamic via CSS variables based on pointer position

#### E. Mask & Clip Paths
- **Clipping**: Different shapes for Pokemon vs Trainer cards
  - Pokemon: `inset(9.85% 8% 52.85% 8%)` (art area only)
  - Stage Pokemon: Custom polygon for smaller art
  - Trainers: `inset(14.5% 8.5% 48.2% 8.5%)` (full art)
- **Masking**: SVG/image masks for texture application
- **Border Clipping**: `inset(2.8% 4% round 2.55% / 1.5%)` for radiant effect

#### F. Background Images & Textures
- Glitter patterns (25% size, tiled)
- Grain overlays (webp format for compression)
- Foil textures (illusion.png, geometric.png)
- Galaxy/cosmos layered PNG images
- All positioned relative to pointer with `background-position`

---

## 3. Card Component Structure (Svelte)

### HTML Hierarchy
```html
<div class="card {types} interactive" data-rarity={rarity} data-supertype={supertype} ...>
  <div class="card__translater">
    <button class="card__rotator">
      <img class="card__back" /> (Pokemon card back, hidden with rotateY(180deg))
      <div class="card__front">
        <img /> (front image)
        <div class="card__shine"></div> (holographic effect)
        <div class="card__glare"></div> (glare/reflection)
      </div>
    </button>
  </div>
</div>
```

### Layer Structure (Front)
1. **Card Back**: rotated 180° on Y-axis, shown during loading
2. **Card Front Image**: Main artwork
3. **Card Shine**: Holographic effects (multiple pseudo-elements ::before, ::after)
4. **Card Glare**: Reflection/highlight that follows pointer

### CSS Variables System
Dynamically set via Svelte:
- `--pointer-x`, `--pointer-y` (0-100%) - cursor/device position
- `--pointer-from-center` (0-1) - distance from center
- `--pointer-from-top`, `--pointer-from-left` (0-1) - directional ratios
- `--rotate-x`, `--rotate-y` (degrees) - 3D rotation
- `--background-x`, `--background-y` (%) - background position mapping
- `--card-scale` (1-2.5) - zoom level when active
- `--card-opacity` (0-1) - shine/glare visibility
- `--translate-x`, `--translate-y` (px) - centering in viewport
- `--card-glow` (color) - Type-based glow color

---

## 4. Mouse/Device Interaction

### Svelte Motion (Spring Physics)
Uses Svelte's `spring()` store with custom stiffness/damping:
- **Interaction Settings**: stiffness 0.066, damping 0.25 (snappy)
- **Popover Settings**: stiffness 0.033, damping 0.45 (smooth)
- **Snap Back**: stiffness 0.01, damping 0.06 (slow return)

### Interaction Events
1. **pointermove**: Updates spring values continuously
2. **mouseout**: Starts snap-back animation
3. **click**: Activates popover (expand to full screen)
4. **blur**: Closes popover
5. **deviceorientation**: Mobile tilt control

### Pointer Math
```javascript
// Mouse position in card coordinates
percent = (100 / cardWidth) * absoluteX
center = percent - 50

// Rotation: X axis inverted (3D perspective)
--rotate-x = -(center / 3.5)deg
--rotate-y = (center / 3.5)deg

// Background position adjustment
--background-x = remap(percent, 0, 100, 37, 63)
--background-y = remap(percent, 0, 100, 33, 67)

// Glare follows pointer exactly
--pointer-x = percent
--pointer-y = percent
```

### Mobile Support
- Device orientation API for tilt
- Touch events converted to mouse events
- Visibility detection (stops animation if tab hidden)

---

## 5. Rarity Styles (9 Major Types)

### Basic / Common (NO EFFECT)
- Just 3D rotation with glare
- Simple radial gradient glare only

### Reverse Holo
- Foil texture masked to reverse areas
- Vertical beam effect with scanlines
- Different from regular holo (inverted areas have effect)

### Regular Holo (Rare)
- **Shine**: Repeating rainbow gradient (110° angle) + scanlines + horizontal bars
- **Scanlines**: 1-2px spacing, overlay blend mode
- **Bars**: 3% width, screen blend mode at different positions
- **Glare**: Radial gradient at pointer position with overlay blend
- **Filter**: brightness(1.1) contrast(1.1) saturate(1.2)
- **Key Technique**: Multiple background-position updates based on pointer

### Cosmos/Galaxy Holo
- **Three Layers**: bottom, middle-transparent, top-transparent PNGs
- **Shine**: Repeating 82° rainbow gradient with color-dodge
- **Stack**: Each layer at different z-index with unique blend mode
- **Background Position**: Fixed to random cosmos position + animated with pointer
- **Effect**: Multiple overlay/color-dodge blends create nebula effect

### Amazing Rare
- **Sparkle**: Double glitter layer with lighten filter
- **Shine**: Masked to specific areas only
- **Brightness**: calc((pointer-from-center * 0.6) + 0.6)
- **Key**: Glitter outside normal card boundaries

### Radiant Rare
- **Pattern**: Criss-cross diagonal gradients (45° & -45°)
- **Bar Width**: 1.2% with 10 grayscale steps for cross-hatch
- **Foil Image**: trainerbg.png at 25% opacity
- **Glare**: Hard-light blend with opacity based on pointer distance
- **Most Complex**: 3 background images + double before/after layers

### Rainbow Rare (Secret)
- **Pastel Gradients**: Multi-color linear gradients at -30°/-60° angle
- **Glitter**: Soft-light + color-dodge blend
- **Opacity**: Varies with pointer-from-center
- **Key**: Vibrant, pastel-colored rainbows with heavy glitter

### Secret Rare (Gold)
- **Conic Gradient**: Spinning gold color wheel
- **Triple Shine**: Glitter layers + foil image + radial gradients
- **Color**: Gold (hsl(46-52, 95-100%, 50-69%))
- **Saturation**: 2.7 (maximum) for vibrant gold
- **Shift**: Glitter positions offset with --shift variable
- **Effect**: Extreme shimmer and sparkle

### V Cards (Holo V)
- **Diagonal Gradients**: 133° angle with opposing color beams
- **Grain Texture**: 500px background size
- **Two Gradient Layers**: One normal, one inverted via negative positions
- **Soft-light + Hard-light**: Blend modes for metallic effect
- **Brightness**: calc((pointer-from-center * 0.8) + 0.8)

### V Full Art / Ultra Rare
- **Multiple Techniques**: Foil + repeating gradients (vertical + diagonal) + radial
- **Foil Textures**: illusion.png or illusion2.png
- **Exclusion Blend**: Creates unique color shift
- **Overlay**: White radial gradient in ::before
- **Key**: Most complex, combines many techniques

### V-Max
- **Similar to V**: But larger background gradient (more subtle movement)
- **More Pronounced Texture**: Combined with subtle gradient
- **Radial Glare**: Hard-light blend

### V-Star
- **Back to Diagonals**: Similar to full art but brighter
- **Pastel Hues**: Softer appearance
- **Same Texture Technique**: With less intense saturation

### Trainer Gallery Variants
- **Metallic Effect**: Color-dodge linear gradient
- **Iridescent Shine**: Hard-light radial gradient
- **Shimmer**: Changes based on pointer position

### Shiny Vault (Silver Foil)
- **Special**: Silver/white foil appearance
- **Radial Darkening**: Creates subtle metallic silver effect
- **Most Effective in Firefox**: Browser rendering differences

---

## 6. Dynamic CSS Variables (All Computed in JavaScript)

### Static Variables (Set Once at Mount)
- `--seedx`, `--seedy`: Random seed for cosmos positioning
- `--cosmosbg`: Cosmos layer position (randomized)

### Dynamic Variables (Updated on Pointer Move)
- `--pointer-x`: 0-100% (mouse/center position)
- `--pointer-y`: 0-100% (mouse/center position)
- `--pointer-from-center`: 0-1 (distance ratio)
- `--pointer-from-top`: 0-1 (vertical ratio)
- `--pointer-from-left`: 0-1 (horizontal ratio)
- `--rotate-x`: degrees (Y-axis rotation)
- `--rotate-y`: degrees (X-axis rotation)
- `--background-x`: % (remapped for gradient movement)
- `--background-y`: % (remapped for gradient movement)
- `--card-scale`: 1-2.5 (zoom)
- `--translate-x`: px (center offset)
- `--translate-y`: px (center offset)
- `--card-opacity`: 0-1 (shine/glare visibility)

### Type-Dependent Variables
- `--card-glow`: Color based on Pokemon type (Water, Fire, Grass, etc.)
- `--sunpillar-clr-1` through `--sunpillar-clr-6`: Rainbow colors for holo beams

---

## 7. Performance Optimizations

### Hardware Acceleration
- `translate3d(0, 0, 0.01px)` on all cards for GPU layer
- `will-change: transform, visibility, z-index` for cards
- `will-change: transform, opacity, background-*` for shine/glare

### Rendering Optimization
- `transform-style: preserve-3d` prevents layout recalculation
- `pointer-events: auto` only on interactive layer
- `backface-visibility` controls what renders
- `image-rendering: optimizeQuality` for card images

### Animation Performance
- Uses `requestAnimationFrame` for pointer updates
- Debounces spring updates to prevent excessive calculations
- Visibility detection stops animations when tab inactive

### CSS Specificity Patterns
- Data attributes for rarity (`[data-rarity]`)
- Pseudo-elements for layering (::before, ::after)
- Adjacent sibling selectors for related layers
- Class combinations for states (.card.active, .card.interacting)

---

## 8. Key Techniques Summary

| Technique | Purpose | Implementation |
|-----------|---------|-----------------|
| 3D Perspective | Depth illusion | perspective: 600px; transform-style: preserve-3d |
| Radial Gradients | Glare at pointer | farthest-corner circle at var(--pointer-x) var(--pointer-y) |
| Repeating Gradients | Holo beams | repeating-linear-gradient at various angles with color stops |
| Blend Modes | Effect combination | color-dodge (shine), overlay (glow), hard-light (intensity) |
| Masks/Clips | Shape areas | clip-path polygons, -webkit-mask-image for textures |
| Background Position | Dynamic movement | Linked to pointer position via CSS variables |
| Filters | Intensity control | brightness, contrast, saturate dynamically calculated |
| Transform Layers | Separation | translate3d, z-index, transform-origin center |
| Spring Animation | Smooth motion | Svelte stores with physics-based easing |
| Device Orientation | Mobile tilt | window.deviceorientation API |

---

## 9. Data Flow

```
Card.svelte (component)
  ├── @pointermove
  │   └── interact() function
  │       ├── Calculate percent position
  │       ├── Map to rotation/background
  │       └── Update springs (Svelte stores)
  │
  ├── @click
  │   └── activate() / popover()
  │       └── Set --card-scale, translate
  │
  └── Reactive: $springRotate, $springGlare, $springBackground
      └── dynamicStyles (interpolated HTML)
          └── Applied to card element style attribute
```

All effects are CSS-driven, with JavaScript only calculating the position values.
