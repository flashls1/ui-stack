import React, { useRef, useEffect, useState } from 'react';
import './Spotlight.css';

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Color variant */
    color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gradient';
    /** Size of the spotlight */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Intense glow effect */
    intense?: boolean;
    /** Add border glow effect */
    borderGlow?: boolean;
    /** Disable the effect */
    disabled?: boolean;
}

export const Spotlight: React.FC<SpotlightProps> = ({
    color = 'primary',
    size = 'md',
    intense = false,
    borderGlow = false,
    disabled = false,
    className = '',
    children,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (disabled) return;

        const container = containerRef.current;
        const spotlight = spotlightRef.current;
        if (!container || !spotlight) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Position spotlight centered on cursor
            const spotlightWidth = spotlight.offsetWidth;
            const spotlightHeight = spotlight.offsetHeight;
            spotlight.style.left = `${x - spotlightWidth / 2}px`;
            spotlight.style.top = `${y - spotlightHeight / 2}px`;

            // Update CSS variables for border glow
            if (borderGlow) {
                container.style.setProperty('--spotlight-x', `${x}px`);
                container.style.setProperty('--spotlight-y', `${y}px`);
            }
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [disabled, borderGlow]);

    const containerClasses = [
        'spotlight-container',
        borderGlow && 'spotlight-container--border',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const spotlightClasses = [
        'spotlight',
        `spotlight--${color}`,
        `spotlight--${size}`,
        intense && 'spotlight--intense',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div ref={containerRef} className={containerClasses} {...props}>
            {!disabled && <div ref={spotlightRef} className={spotlightClasses} />}
            {children}
        </div>
    );
};

export default Spotlight;
