import React from 'react';
import './Marquee.css';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Animation speed */
    speed?: 'slow' | 'normal' | 'fast';
    /** Custom duration in seconds */
    duration?: number;
    /** Reverse direction */
    reverse?: boolean;
    /** Vertical scrolling */
    vertical?: boolean;
    /** Height for vertical marquee */
    height?: string;
    /** Pause animation on hover */
    pauseOnHover?: boolean;
    /** Show separator dots between items */
    separator?: boolean;
    /** Style variant */
    variant?: 'default' | 'logos' | 'testimonials' | 'tags';
    /** Glass effect for testimonials */
    glass?: boolean;
    /** Number of times to repeat content (for seamless loop) */
    repeat?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({
    speed = 'normal',
    duration,
    reverse = false,
    vertical = false,
    height = '400px',
    pauseOnHover = true,
    separator = false,
    variant = 'default',
    glass = false,
    repeat = 2,
    className = '',
    children,
    style,
    ...props
}) => {
    const containerClasses = [
        'marquee',
        speed !== 'normal' && `marquee--${speed}`,
        reverse && 'marquee--reverse',
        vertical && 'marquee--vertical',
        pauseOnHover && 'marquee--pause-on-hover',
        separator && 'marquee--separator',
        variant !== 'default' && `marquee--${variant}`,
        glass && 'marquee--glass',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const containerStyle = {
        ...style,
        '--marquee-duration': duration ? `${duration}s` : undefined,
        '--marquee-height': vertical ? height : undefined,
    } as React.CSSProperties;

    // Create array of content for seamless looping
    const contentArray = Array.from({ length: repeat }, (_, i) => (
        <div key={i} className="marquee__content">
            {React.Children.map(children, (child, j) => (
                <div key={j} className="marquee__item">
                    {child}
                </div>
            ))}
        </div>
    ));

    return (
        <div className={containerClasses} style={containerStyle} {...props}>
            {contentArray}
        </div>
    );
};

export default Marquee;
