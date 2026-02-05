/**
 * Magnet Component
 * Adapted from React Bits (https://reactbits.dev)
 * 
 * Creates a magnetic hover effect that draws
 * elements toward the cursor position.
 */

import React, { useRef, useState, useCallback } from 'react';
import './Magnet.css';

export interface MagnetProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Magnet strength (0-1) */
    strength?: number;
    /** Padding around the trigger area */
    padding?: number;
    /** Transition duration */
    duration?: number;
    /** Disable the magnetic effect */
    disabled?: boolean;
    /** Children to apply the effect to */
    children: React.ReactNode;
}

export const Magnet: React.FC<MagnetProps> = ({
    strength = 0.3,
    padding = 40,
    duration = 300,
    disabled = false,
    className = '',
    children,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        setTransform({
            x: distX * strength,
            y: distY * strength,
        });
    }, [disabled, strength]);

    const handleMouseEnter = useCallback(() => {
        if (!disabled) {
            setIsHovering(true);
        }
    }, [disabled]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        setTransform({ x: 0, y: 0 });
    }, []);

    const style = {
        '--magnet-x': `${transform.x}px`,
        '--magnet-y': `${transform.y}px`,
        '--magnet-duration': `${duration}ms`,
        '--magnet-padding': `${padding}px`,
    } as React.CSSProperties;

    return (
        <div
            ref={containerRef}
            className={`magnet ${isHovering ? 'magnet--active' : ''} ${disabled ? 'magnet--disabled' : ''} ${className}`}
            style={style}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <div className="magnet__content">
                {children}
            </div>
        </div>
    );
};

export default Magnet;
