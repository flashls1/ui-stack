import React from 'react';
import './GradientText.css';

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Gradient color variant */
    variant?: 'primary' | 'secondary' | 'rainbow' | 'gold';
    /** Enable gradient animation */
    animated?: boolean;
    /** Fast animation speed */
    fast?: boolean;
    /** Add glow effect */
    glow?: boolean;
    /** Shimmer effect instead of gradient shift */
    shimmer?: boolean;
    /** HTML tag to render */
    as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

export const GradientText: React.FC<GradientTextProps> = ({
    variant = 'primary',
    animated = false,
    fast = false,
    glow = false,
    shimmer = false,
    as: Component = 'span',
    className = '',
    children,
    ...props
}) => {
    const classNames = [
        'gradient-text',
        `gradient-text--${variant}`,
        animated && !shimmer && 'gradient-text--animated',
        fast && 'gradient-text--fast',
        glow && 'gradient-text--glow',
        shimmer && 'gradient-text--shimmer',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Component className={classNames} {...props}>
            {children}
        </Component>
    );
};

export default GradientText;
