# React Bits Integration

This directory contains animated components adapted from [React Bits](https://reactbits.dev) - an open source collection of animated, interactive React components.

## Categories

### Text Animations
- **SplitText** - Animates text by characters, words, or lines using GSAP
- **BlurText** - Localized blur animation on text reveal using Framer Motion
- **ShinyText** - Text with animated gradient shine effect
- **TextPressure** - Fluid, pressure-sensitive text effect

### Backgrounds
- **Aurora** - Flowing Northern Lights effect (WebGL/OGL)
- **Hyperspeed** - Star field warp effect
- **Particles** - Floating particle background
- **Waves** - Animated wave background

### Components
- **SpotlightCard** - Card with cursor-following spotlight
- **MagnetLines** - Lines that gravitate toward cursor
- **PixelCard** - Retro pixel transition effects
- **GlowBorder** - Animated glowing border effect

### Animations
- **SplashCursor** - Paint splash effect on cursor movement
- **GhostCursor** - Trailing ghost effect on cursor
- **ClickSpark** - Spark particles on click

## Dependencies

```bash
npm install gsap @gsap/react motion ogl
```

## Usage

Each component is self-contained. Import from the specific component directory:

```tsx
import { SplitText } from './react-bits/text/SplitText';
import { BlurText } from './react-bits/text/BlurText';
import { Aurora } from './react-bits/backgrounds/Aurora';
```

## Customization

All components accept styling props and can be customized to match your design tokens:

```tsx
<SplitText 
  text="Hello World"
  className="custom-class"
  delay={50}
  animationFrom={{ opacity: 0, y: 40 }}
  animationTo={{ opacity: 1, y: 0 }}
/>
```

## License

Components are adapted from React Bits (MIT License).
Attribution: [David Haz](https://github.com/DavidHDev)
