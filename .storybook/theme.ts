import { create } from '@storybook/theming/create';

export default create({
    base: 'dark',

    // Brand
    brandTitle: 'UI Stack Design System',
    brandUrl: 'https://github.com/yourusername/ui-stack',
    brandTarget: '_self',

    // Colors
    colorPrimary: '#7877c6',
    colorSecondary: '#00d4ff',

    // UI
    appBg: '#0a0a0f',
    appContentBg: '#0f0f14',
    appPreviewBg: '#0a0a0f',
    appBorderColor: 'rgba(255, 255, 255, 0.1)',
    appBorderRadius: 8,

    // Typography
    fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontCode: '"Fira Code", "JetBrains Mono", monospace',

    // Text colors
    textColor: '#f0f0f0',
    textInverseColor: '#0a0a0f',
    textMutedColor: '#888888',

    // Toolbar
    barTextColor: '#999999',
    barSelectedColor: '#7877c6',
    barHoverColor: '#00d4ff',
    barBg: '#0f0f14',

    // Form colors
    inputBg: '#1a1a2e',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputTextColor: '#f0f0f0',
    inputBorderRadius: 8,
});
