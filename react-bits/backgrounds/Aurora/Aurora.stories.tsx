import type { Meta, StoryObj } from '@storybook/react';
import { Aurora } from './Aurora';

const meta: Meta<typeof Aurora> = {
    title: 'React Bits/Backgrounds/Aurora',
    component: Aurora,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        colorScheme: {
            control: 'select',
            options: ['default', 'purple', 'blue', 'green', 'custom'],
        },
        speed: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
        blur: { control: { type: 'range', min: 50, max: 200, step: 10 } },
        opacity: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } },
        size: { control: { type: 'range', min: 0.5, max: 2, step: 0.1 } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        colorScheme: 'default',
    },
    render: (args) => (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Aurora {...args}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: 700,
                }}>
                    Aurora Background
                </div>
            </Aurora>
        </div>
    ),
};

export const Purple: Story = {
    args: {
        colorScheme: 'purple',
        opacity: 0.6,
    },
    render: Default.render,
};

export const Blue: Story = {
    args: {
        colorScheme: 'blue',
        opacity: 0.5,
    },
    render: Default.render,
};

export const Green: Story = {
    args: {
        colorScheme: 'green',
        opacity: 0.4,
    },
    render: Default.render,
};

export const Subtle: Story = {
    args: {
        colorScheme: 'default',
        blur: 150,
        opacity: 0.3,
    },
    render: Default.render,
};

export const Intense: Story = {
    args: {
        colorScheme: 'purple',
        blur: 80,
        opacity: 0.7,
        speed: 2,
    },
    render: Default.render,
};
