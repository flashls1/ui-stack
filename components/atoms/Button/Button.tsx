import React, { forwardRef } from 'react';
import './Button.css';

/**
 * Button component with multiple variants and sizes
 * 
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="gradient" size="lg">Premium Action</Button>
 * <Button variant="glass">Glass Effect</Button>
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'gradient' | 'glow' | 'glass';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon-only button (equal width/height) */
  iconOnly?: boolean;
  /** Enable ripple effect on click */
  ripple?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Render as a different element (for links) */
  as?: React.ElementType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      iconOnly = false,
      ripple = false,
      leftIcon,
      rightIcon,
      as: Component = 'button',
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth && 'btn--full',
      loading && 'btn--loading',
      iconOnly && 'btn--icon',
      ripple && 'btn--ripple',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component
        ref={ref}
        className={classNames}
        disabled={disabled || loading}
        {...props}
      >
        {leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
