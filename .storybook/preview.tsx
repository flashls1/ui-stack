import type { Preview } from '@storybook/react';
import '../tokens/variables.css';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#0a0a0f' },
                { name: 'light', value: '#fafafa' },
                { name: 'gradient', value: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)' },
            ],
        },
        layout: 'centered',
        docs: {
            toc: true,
        },
    },
    globalTypes: {
        theme: {
            name: 'Theme',
            description: 'Global theme for components',
            defaultValue: 'dark',
            toolbar: {
                icon: 'circlehollow',
                items: [
                    { value: 'light', icon: 'sun', title: 'Light' },
                    { value: 'dark', icon: 'moon', title: 'Dark' },
                ],
                showName: true,
            },
        },
    },
    decorators: [
        (Story, context) => {
            const theme = context.globals.theme || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            return <Story />;
        },
    ],
};

export default preview;
