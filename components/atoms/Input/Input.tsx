import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Input size */
    size?: 'sm' | 'md' | 'lg';
    /** Error state */
    error?: boolean;
    /** Success state */
    success?: boolean;
    /** Glass variant */
    glass?: boolean;
    /** Left icon */
    leftIcon?: React.ReactNode;
    /** Right icon */
    rightIcon?: React.ReactNode;
    /** Full width */
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            size = 'md',
            error = false,
            success = false,
            glass = false,
            leftIcon,
            rightIcon,
            fullWidth = true,
            className = '',
            ...props
        },
        ref
    ) => {
        const inputClassNames = [
            'input',
            `input--${size}`,
            error && 'input--error',
            success && 'input--success',
            glass && 'input--glass',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // If no icons, return simple input
        if (!leftIcon && !rightIcon) {
            return (
                <input
                    ref={ref}
                    className={inputClassNames}
                    {...props}
                />
            );
        }

        // With icons, wrap in container
        const wrapperClassNames = [
            'input-wrapper',
            leftIcon && 'input-wrapper--icon-left',
            rightIcon && 'input-wrapper--icon-right',
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={wrapperClassNames}>
                {leftIcon && (
                    <span className="input-icon input-icon--left">{leftIcon}</span>
                )}
                <input
                    ref={ref}
                    className={inputClassNames}
                    {...props}
                />
                {rightIcon && (
                    <span className="input-icon input-icon--right">{rightIcon}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
