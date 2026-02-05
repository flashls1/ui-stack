import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: [
        '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../animations/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../patterns/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../react-bits/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../docs/**/*.mdx',
    ],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-links',
        '@storybook/addon-a11y',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    staticDirs: ['../public'],
    viteFinal: async (config) => {
        // Apply custom Vite config
        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve?.alias,
                    '@': new URL('..', import.meta.url).pathname,
                    '@components': new URL('../components', import.meta.url).pathname,
                    '@animations': new URL('../animations', import.meta.url).pathname,
                    '@patterns': new URL('../patterns', import.meta.url).pathname,
                    '@react-bits': new URL('../react-bits', import.meta.url).pathname,
                    '@tokens': new URL('../tokens', import.meta.url).pathname,
                },
            },
        };
    },
};

export default config;
