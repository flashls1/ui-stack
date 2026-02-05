import type { Meta, StoryObj } from '@storybook/react';
import { SpotlightCard } from './SpotlightCard';

const meta: Meta<typeof SpotlightCard> = {
    title: 'React Bits/Components/SpotlightCard',
    component: SpotlightCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        spotlightColor: { control: 'color' },
        spotlightSize: { control: { type: 'range', min: 100, max: 500, step: 50 } },
        bgColor: { control: 'color' },
        borderRadius: { control: { type: 'range', min: 0, max: 32, step: 4 } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        spotlightColor: 'rgba(120, 119, 198, 0.3)',
        children: (
            <div style={{ padding: '2rem', color: 'white' }}>
                <h3 style={{ margin: 0 }}>Spotlight Card</h3>
                <p style={{ opacity: 0.7 }}>Hover to see the spotlight effect</p>
            </div>
        ),
    },
};

export const Cyan: Story = {
    args: {
        spotlightColor: 'rgba(0, 212, 255, 0.3)',
        children: (
            <div style={{ padding: '2rem', color: 'white' }}>
                <h3 style={{ margin: 0 }}>Cyan Spotlight</h3>
                <p style={{ opacity: 0.7 }}>Cool blue glow follows your cursor</p>
            </div>
        ),
    },
};

export const Pink: Story = {
    args: {
        spotlightColor: 'rgba(255, 107, 157, 0.3)',
        children: (
            <div style={{ padding: '2rem', color: 'white' }}>
                <h3 style={{ margin: 0 }}>Pink Spotlight</h3>
                <p style={{ opacity: 0.7 }}>Warm accent for special content</p>
            </div>
        ),
    },
};

export const FeatureCard: Story = {
    render: () => (
        <SpotlightCard
            spotlightColor="rgba(120, 119, 198, 0.4)"
            style={{ width: 320 }}
        >
            <div style={{ padding: '2rem', color: 'white' }}>
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #7877c6, #00d4ff)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                }}>
                    ⚡
                </div>
                <h3 style={{ margin: '0 0 0.5rem' }}>Lightning Fast</h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Optimized for performance with zero-config setup.
                    Get started in seconds.
                </p>
            </div>
        </SpotlightCard>
    ),
};

export const Grid: Story = {
    render: () => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 280px)',
            gap: '1rem'
        }}>
            {['🎨 Design', '⚡ Speed', '🔒 Security', '📱 Responsive'].map((title) => (
                <SpotlightCard key={title} spotlightColor="rgba(120, 119, 198, 0.3)">
                    <div style={{ padding: '1.5rem', color: 'white' }}>
                        <h4 style={{ margin: 0 }}>{title}</h4>
                        <p style={{ margin: '0.5rem 0 0', opacity: 0.6, fontSize: '0.875rem' }}>
                            Feature description goes here with more details.
                        </p>
                    </div>
                </SpotlightCard>
            ))}
        </div>
    ),
};
