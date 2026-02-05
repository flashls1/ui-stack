import React from 'react';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Badge variant */
    variant?:
    | 'default'
    | 'primary'
    | 'primary-solid'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error'
    | 'gradient'
    | 'outline'
    | 'outline-primary'
    | 'glow';
    /** Badge size */
    size?: 'sm' | 'md' | 'lg';
    /** Show dot indicator */
    dot?: boolean;
    /** Use pill shape (less rounded) */
    pill?: boolean;
    /** Enable hover effects */
    interactive?: boolean;
    /** Pulse animation */
    pulse?: boolean;
    /** Left icon */
    leftIcon?: React.ReactNode;
    /** Right icon */
    rightIcon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    size = 'md',
    dot = false,
    pill = false,
    interactive = false,
    pulse = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...props
}) => {
    const classNames = [
        'badge',
        `badge--${variant}`,
        `badge--${size}`,
        dot && 'badge--dot',
        pill && 'badge--pill',
        interactive && 'badge--interactive',
        pulse && 'badge--pulse',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={classNames} {...props}>
            {leftIcon && <span className="badge__icon">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="badge__icon">{rightIcon}</span>}
        </span>
    );
};

export default Badge;
