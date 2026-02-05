/**
 * Aurora Background Component
 * Adapted from React Bits (https://reactbits.dev)
 * 
 * Creates a beautiful, flowing Northern Lights effect
 * using CSS animations for smooth, GPU-accelerated performance.
 * 
 * Note: This is a CSS-only version. For the WebGL version using OGL,
 * see the original React Bits implementation.
 */

import React from 'react';
import './Aurora.css';

export interface AuroraProps {
    /** Additional className */
    className?: string;
    /** Color scheme */
    colorScheme?: 'default' | 'purple' | 'blue' | 'green' | 'custom';
    /** Custom colors (requires colorScheme='custom') */
    customColors?: {
        color1?: string;
        color2?: string;
        color3?: string;
    };
    /** Animation speed multiplier */
    speed?: number;
    /** Blur intensity */
    blur?: number;
    /** Opacity */
    opacity?: number;
    /** Size multiplier */
    size?: number;
    /** Children to render on top */
    children?: React.ReactNode;
}

export const Aurora: React.FC<AuroraProps> = ({
    className = '',
    colorScheme = 'default',
    customColors,
    speed = 1,
    blur = 100,
    opacity = 0.5,
    size = 1,
    children,
}) => {
    const getColors = () => {
        switch (colorScheme) {
            case 'purple':
                return {
                    color1: 'hsl(280, 75%, 50%)',
                    color2: 'hsl(250, 75%, 55%)',
                    color3: 'hsl(320, 70%, 50%)',
                };
            case 'blue':
                return {
                    color1: 'hsl(210, 80%, 50%)',
                    color2: 'hsl(190, 85%, 45%)',
                    color3: 'hsl(230, 75%, 55%)',
                };
            case 'green':
                return {
                    color1: 'hsl(145, 70%, 45%)',
                    color2: 'hsl(170, 75%, 40%)',
                    color3: 'hsl(120, 60%, 50%)',
                };
            case 'custom':
                return {
                    color1: customColors?.color1 || 'hsl(250, 75%, 56%)',
                    color2: customColors?.color2 || 'hsl(280, 70%, 52%)',
                    color3: customColors?.color3 || 'hsl(330, 75%, 54%)',
                };
            default:
                return {
                    color1: 'hsl(250, 75%, 56%)',
                    color2: 'hsl(280, 70%, 52%)',
                    color3: 'hsl(330, 75%, 54%)',
                };
        }
    };

    const colors = getColors();

    const style = {
        '--aurora-color-1': colors.color1,
        '--aurora-color-2': colors.color2,
        '--aurora-color-3': colors.color3,
        '--aurora-speed': `${15 / speed}s`,
        '--aurora-blur': `${blur}px`,
        '--aurora-opacity': opacity,
        '--aurora-size': size,
    } as React.CSSProperties;

    return (
        <div className={`aurora ${className}`} style={style}>
            <div className="aurora__container">
                <div className="aurora__blob aurora__blob--1" />
                <div className="aurora__blob aurora__blob--2" />
                <div className="aurora__blob aurora__blob--3" />
            </div>
            {children && <div className="aurora__content">{children}</div>}
        </div>
    );
};

export default Aurora;
