import React from 'react';
import './GlowEffect.css';

export interface GlowEffectProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Color variant */
    color?: 'primary' | 'secondary' | 'accent' | 'multi' | 'white';
    /** Size of the glow */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Position relative to parent */
    position?: 'center' | 'top' | 'bottom';
    /** Enable pulse animation */
    pulse?: boolean;
    /** Enable breathing animation */
    breathe?: boolean;
    /** Intensity level */
    intensity?: 'subtle' | 'normal' | 'intense';
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
    color = 'primary',
    size = 'md',
    position = 'center',
    pulse = false,
    breathe = false,
    intensity = 'normal',
    className = '',
    ...props
}) => {
    const classNames = [
        'glow-effect',
        `glow-effect--${color}`,
        `glow-effect--${size}`,
        `glow-effect--${position}`,
        pulse && 'glow-effect--pulse',
        breathe && 'glow-effect--breathe',
        intensity !== 'normal' && `glow-effect--${intensity}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classNames} {...props} />;
};

/* Wrapper component for easy usage */
export interface GlowWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Glow effect props */
    glowProps?: GlowEffectProps;
}

export const GlowWrapper: React.FC<GlowWrapperProps> = ({
    glowProps = {},
    className = '',
    children,
    ...props
}) => {
    return (
        <div className={`glow-wrapper ${className}`} {...props}>
            <GlowEffect {...glowProps} />
            {children}
        </div>
    );
};

export default GlowEffect;
