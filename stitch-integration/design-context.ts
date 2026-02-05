/**
 * Design Context Extractor
 * 
 * Extracts design tokens and generates context for Google Stitch prompts.
 * This ensures generated UI matches your design system.
 */

import * as fs from 'fs';
import * as path from 'path';

interface DesignToken {
    value: string;
    type: string;
    description?: string;
}

interface TokenFile {
    [key: string]: DesignToken | TokenFile | string;
}

interface DesignContext {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        foreground: string;
    };
    typography: {
        fontFamily: string;
        headingFont: string;
    };
    spacing: {
        base: string;
        cardPadding: string;
    };
    effects: {
        borderRadius: string;
        shadow: string;
        blur: string;
    };
    gradients: {
        primary: string;
        glass: string;
    };
}

/**
 * Load and parse a JSON token file
 */
function loadTokenFile(filePath: string): TokenFile {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Extract a specific token value from nested structure
 */
function getTokenValue(tokens: TokenFile, path: string): string | undefined {
    const parts = path.split('.');
    let current: any = tokens;

    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return undefined;
        }
    }

    if (current && typeof current === 'object' && 'value' in current) {
        return current.value as string;
    }

    return undefined;
}

/**
 * Extract design context from token files
 */
export function extractDesignContext(tokensDir: string): DesignContext {
    const colorsPath = path.join(tokensDir, 'primitives', 'colors.json');
    const typographyPath = path.join(tokensDir, 'primitives', 'typography.json');
    const spacingPath = path.join(tokensDir, 'primitives', 'spacing.json');
    const effectsPath = path.join(tokensDir, 'primitives', 'effects.json');

    const colors = loadTokenFile(colorsPath);
    const typography = loadTokenFile(typographyPath);
    const spacing = loadTokenFile(spacingPath);
    const effects = loadTokenFile(effectsPath);

    return {
        colors: {
            primary: getTokenValue(colors, 'color.primary.500') || 'hsl(250, 75%, 56%)',
            secondary: getTokenValue(colors, 'color.secondary.500') || 'hsl(185, 75%, 46%)',
            accent: getTokenValue(colors, 'color.accent.500') || 'hsl(330, 75%, 54%)',
            background: getTokenValue(colors, 'color.gray.950') || 'hsl(220, 35%, 6%)',
            foreground: getTokenValue(colors, 'color.gray.50') || 'hsl(220, 14%, 96%)',
        },
        typography: {
            fontFamily: getTokenValue(typography, 'fontFamily.sans') || 'Inter, system-ui, sans-serif',
            headingFont: getTokenValue(typography, 'fontFamily.display') || 'Outfit, Inter, sans-serif',
        },
        spacing: {
            base: getTokenValue(spacing, 'spacing.4') || '1rem',
            cardPadding: getTokenValue(spacing, 'spacing.6') || '1.5rem',
        },
        effects: {
            borderRadius: '0.75rem', // radius-xl
            shadow: getTokenValue(effects, 'shadow.lg') || '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            blur: getTokenValue(effects, 'blur.xl') || '24px',
        },
        gradients: {
            primary: getTokenValue(colors, 'gradient.primary') || 'linear-gradient(135deg, hsl(250, 75%, 56%) 0%, hsl(280, 70%, 52%) 50%, hsl(330, 75%, 54%) 100%)',
            glass: getTokenValue(colors, 'gradient.glass') || 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.1) 0%, hsla(0, 0%, 100%, 0.05) 100%)',
        },
    };
}

/**
 * Generate a design context prompt for Stitch
 */
export function generateDesignPrompt(context: DesignContext): string {
    return `
Design System Context:
- Primary color: ${context.colors.primary} - Blue violet (use for CTAs, links, highlights)
- Secondary color: ${context.colors.secondary} - Cyan (use for accents, secondary actions)
- Accent color: ${context.colors.accent} - Pink/Magenta (use for special highlights)
- Background: ${context.colors.background} - Dark theme default
- Text: ${context.colors.foreground} - Light text on dark

Typography:
- Body font: ${context.typography.fontFamily}
- Heading font: ${context.typography.headingFont}

Visual Style:
- Border radius: ${context.effects.borderRadius} for cards and containers
- Use glassmorphism: backdrop-filter blur(${context.effects.blur}) with semi-transparent backgrounds
- Primary gradient: ${context.gradients.primary}
- Add subtle glow effects on interactive elements

Requirements:
- Dark mode as default
- Responsive (mobile + desktop layouts)
- Accessible (proper contrast, focus states)
- Smooth hover transitions (150-200ms)
`.trim();
}

/**
 * Enhance a user prompt with design context
 */
export function enhancePrompt(userPrompt: string, tokensDir: string): string {
    const context = extractDesignContext(tokensDir);
    const designPrompt = generateDesignPrompt(context);

    return `${userPrompt}

${designPrompt}`;
}

// CLI usage
if (require.main === module) {
    const tokensDir = path.join(__dirname, '..', 'tokens');
    const context = extractDesignContext(tokensDir);
    console.log('Design Context:');
    console.log(JSON.stringify(context, null, 2));
    console.log('\nGenerated Prompt:');
    console.log(generateDesignPrompt(context));
}

export default {
    extractDesignContext,
    generateDesignPrompt,
    enhancePrompt,
};
