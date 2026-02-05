# Google Stitch MCP Integration

This directory contains the integration layer for Google Stitch, enabling AI-powered UI generation that leverages your design system.

## Overview

Google Stitch is an AI-powered UI design tool from Google Labs that generates responsive interfaces from text prompts or sketches. Through the MCP (Model Context Protocol), we can:

1. **Generate UI layouts** from natural language descriptions
2. **Extract design context** from existing screens
3. **Create desktop and mobile variants** automatically
4. **Export clean HTML/CSS code** that uses our design tokens

## Setup

### Prerequisites

1. A Google Cloud project with Stitch API enabled
2. Google Cloud credentials configured
3. Node.js 18+ installed

### Installation

```bash
npm install @anthropic-ai/mcp google-stitch-mcp
```

### MCP Configuration

Add to your `mcp_config.json` or Claude Desktop settings:

```json
{
  "mcpServers": {
    "google-stitch": {
      "command": "npx",
      "args": ["google-stitch-mcp"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "your-project-id",
        "GOOGLE_CLOUD_LOCATION": "us-central1"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `stitch_generate_screen` | Generate UI from a text prompt |
| `stitch_extract_context` | Extract design patterns from existing screens |
| `stitch_get_code` | Get HTML/CSS code for a generated screen |
| `stitch_list_projects` | List all Stitch projects |
| `stitch_create_project` | Create a new Stitch project |

## Usage with Design System

The integration automatically injects your design tokens into Stitch prompts to ensure consistent styling.

### Example Prompt Enhancement

**Your prompt:**
```
Create a modern dashboard with analytics cards and a sidebar
```

**Enhanced prompt (with design context):**
```
Create a modern dashboard with analytics cards and a sidebar.

Design System Context:
- Primary color: hsl(250, 75%, 56%) - Blue violet
- Secondary color: hsl(185, 75%, 46%) - Cyan
- Accent color: hsl(330, 75%, 54%) - Pink/Magenta
- Font family: Inter, system-ui
- Border radius: 0.75rem for cards
- Use glassmorphism effects with backdrop-blur
- Dark mode support required
```

## Directory Structure

```
stitch-integration/
├── README.md           # This file
├── config.json         # MCP configuration template
├── design-context.ts   # Design token extractor
├── prompts/           # Pre-built prompt templates
│   ├── dashboard.md
│   ├── landing.md
│   ├── auth.md
│   └── ecommerce.md
└── utils/             # Helper utilities
    ├── code-transformer.ts
    └── responsive-helper.ts
```

## Creating Custom Prompts

See the `prompts/` directory for template examples. Each prompt file should include:

1. **Description** - What the layout achieves
2. **Components Used** - Which design system components to incorporate
3. **Layout Structure** - Desktop and mobile considerations
4. **Special Effects** - Animations, glassmorphism, glows, etc.

## Best Practices

1. **Always specify responsive behavior** in prompts
2. **Reference design tokens** instead of raw values
3. **Include accessibility requirements** (ARIA, keyboard nav)
4. **Test generated code** against the design system
