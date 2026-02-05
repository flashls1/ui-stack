/**
 * ShinyText Component
 * Adapted from React Bits (https://reactbits.dev)
 * 
 * Text with an animated gradient shine effect
 * that creates a premium, eye-catching appearance.
 */

import React from 'react';
import './ShinyText.css';

export interface ShinyTextProps {
    /** Text to display */
    text: string;
    /** Additional className */
    className?: string;
    /** Animation duration (in seconds) */
    duration?: number;
    /** Shine color */
    shineColor?: string;
    /** Background color */
    bgColor?: string;
    /** Disable animation */
    disabled?: boolean;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
    text,
    className = '',
    duration = 3,
    shineColor = 'rgba(255, 255, 255, 0.8)',
    bgColor = 'transparent',
    disabled = false,
}) => {
    const style = {
        '--shine-duration': `${duration}s`,
        '--shine-color': shineColor,
        '--bg-color': bgColor,
    } as React.CSSProperties;

    return (
        <span
            className={`shiny-text ${disabled ? 'shiny-text--disabled' : ''} ${className}`}
            style={style}
        >
            {text}
            {!disabled && <span className="shiny-text__shine" aria-hidden="true" />}
        </span>
    );
};

export default ShinyText;
