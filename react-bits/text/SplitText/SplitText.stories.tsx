import type { Meta, StoryObj } from '@storybook/react';
import { SplitText } from './SplitText';

const meta: Meta<typeof SplitText> = {
    title: 'React Bits/Text/SplitText',
    component: SplitText,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        splitBy: {
            control: 'select',
            options: ['chars', 'words', 'lines'],
        },
        trigger: {
            control: 'select',
            options: ['mount', 'inView'],
        },
        delay: { control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 } },
        duration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ByCharacters: Story = {
    args: {
        text: 'Hello World',
        splitBy: 'chars',
        delay: 0.05,
    },
};

export const ByWords: Story = {
    args: {
        text: 'Animate each word separately',
        splitBy: 'words',
        delay: 0.1,
    },
};

export const SlideUp: Story = {
    args: {
        text: 'Slide up animation',
        splitBy: 'chars',
        animationFrom: { opacity: 0, y: 40 },
        animationTo: { opacity: 1, y: 0 },
    },
};

export const ScaleIn: Story = {
    args: {
        text: 'Scale in effect',
        splitBy: 'chars',
        animationFrom: { opacity: 0, scale: 0 },
        animationTo: { opacity: 1, scale: 1 },
    },
};

export const Headline: Story = {
    render: () => (
        <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>
            <SplitText
                text="Premium Design System"
                splitBy="chars"
                delay={0.03}
                duration={0.8}
            />
        </h1>
    ),
};
