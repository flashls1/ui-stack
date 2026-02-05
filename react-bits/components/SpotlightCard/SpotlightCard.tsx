/**
 * SpotlightCard Component
 * Adapted from React Bits (https://reactbits.dev)
 * 
 * A card component where a gradient spotlight follows
 * the user's cursor, creating an interactive hover effect.
 */

import React, { useRef, useState, useCallback } from 'react';
import './SpotlightCard.css';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Spotlight color */
    spotlightColor?: string;
    /** Spotlight size (px) */
    spotlightSize?: number;
    /** Background color */
    bgColor?: string;
    /** Border color */
    borderColor?: string;
    /** Border width */
    borderWidth?: number;
    /** Border radius */
    borderRadius?: number;
    /** Children content */
    children: React.ReactNode;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
    spotlightColor = 'rgba(120, 119, 198, 0.3)',
    spotlightSize = 300,
    bgColor = 'rgba(15, 15, 20, 0.8)',
    borderColor = 'rgba(255, 255, 255, 0.1)',
    borderWidth = 1,
    borderRadius = 16,
    className = '',
    children,
    ...props
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
    }, []);

    const style = {
        '--spotlight-color': spotlightColor,
        '--spotlight-size': `${spotlightSize}px`,
        '--spotlight-x': `${position.x}px`,
        '--spotlight-y': `${position.y}px`,
        '--bg-color': bgColor,
        '--border-color': borderColor,
        '--border-width': `${borderWidth}px`,
        '--border-radius': `${borderRadius}px`,
    } as React.CSSProperties;

    return (
        <div
            ref={cardRef}
            className={`spotlight-card ${isHovering ? 'spotlight-card--hovering' : ''} ${className}`}
            style={style}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <div className="spotlight-card__spotlight" aria-hidden="true" />
            <div className="spotlight-card__content">
                {children}
            </div>
        </div>
    );
};

export default SpotlightCard;
