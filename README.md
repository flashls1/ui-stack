# UI Stack - Design System Database

A comprehensive UI design system database with modern components, design tokens, glassmorphism effects, and Google Stitch MCP integration for AI-powered layout generation.

## ✨ Features

- **🎨 Design Tokens** - Complete token system (colors, typography, spacing, effects) with light/dark mode
- **🧩 Component Library** - React components following Atomic Design (atoms, molecules, organisms)
- **✨ Modern Effects** - Glassmorphism, gradients, glow effects, smooth animations
- **🤖 AI Integration** - Google Stitch MCP for generating layouts from prompts
- **📱 Responsive** - Mobile-first design with desktop optimizations
- **♿ Accessible** - WCAG compliant with proper focus states and ARIA

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
ui-stack/
├── tokens/                     # Design tokens
│   ├── primitives/            # Raw values (colors, typography, spacing)
│   ├── semantic/              # Purpose-based tokens (light/dark modes)
│   ├── component/             # Component-specific tokens
│   └── variables.css          # Generated CSS variables
│
├── components/                 # React components
│   ├── atoms/                 # Basic building blocks
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── ...
│   ├── molecules/             # Composite components
│   │   ├── FormField/
│   │   ├── SearchBar/
│   │   └── ...
│   ├── organisms/             # Complex components
│   │   ├── Card/
│   │   ├── Navbar/
│   │   └── ...
│   └── layouts/               # Page layouts
│
├── stitch-integration/         # Google Stitch MCP
│   ├── config.json            # MCP configuration
│   ├── design-context.ts      # Token extractor for prompts
│   └── prompts/               # Pre-built prompt templates
│
├── animations/                 # Animation components (Phase 2)
├── patterns/                   # UI patterns (Phase 2)
├── templates/                  # Page templates (Phase 2)
└── docs/                       # Documentation (Phase 3)
```

## 🎨 Design Tokens

### Colors

| Token | Light | Dark |
|-------|-------|------|
| `--primary-bg` | Blue-violet 500 | Blue-violet 500 |
| `--secondary-bg` | Cyan 500 | Cyan 500 |
| `--accent-bg` | Pink 500 | Pink 500 |
| `--bg-default` | White | Gray 950 |
| `--fg-default` | Gray 900 | Gray 50 |

### Usage

```css
/* Using CSS variables */
.my-component {
  background: var(--card-bg);
  color: var(--fg-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

/* Glassmorphism */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-xl));
  border: 1px solid var(--glass-border);
}

/* Gradient text */
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## 🧩 Components

### Button

```tsx
import { Button } from 'ui-stack';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="gradient">Gradient</Button>
<Button variant="glow">Glow Effect</Button>
<Button variant="glass">Glass</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Card

```tsx
import { Card, CardHeader, CardBody, CardFooter } from 'ui-stack';

<Card variant="glass" hoverable>
  <CardHeader 
    title="Glass Card" 
    description="With glassmorphism effect"
  />
  <CardBody>
    Content goes here
  </CardBody>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

## 🤖 Google Stitch Integration

### Setup

1. Configure your Google Cloud project
2. Add MCP configuration to your Claude Desktop settings
3. Use the design context extractor for consistent styling

### Example Workflow

```
User: Create a dashboard with analytics cards

AI Agent:
1. Extracts design tokens using design-context.ts
2. Enhances prompt with color palette, typography, effects
3. Calls Google Stitch MCP to generate layout
4. Returns code using your design system variables
```

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Design token system
- [x] Core atom components (Button, Input, Badge)
- [x] Card organism component
- [x] Google Stitch integration setup

### Phase 2: Extended Library 🚧
- [ ] Animation components (GlowEffect, GradientText, etc.)
- [ ] Pattern library (Auth, Navigation, Forms)
- [ ] Page templates (Landing, Dashboard, E-commerce)

### Phase 3: Automation 📋
- [ ] Token build pipeline
- [ ] Component generator CLI
- [ ] Storybook documentation
- [ ] Visual regression testing

## 📄 License

MIT
