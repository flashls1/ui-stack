import React, { useMemo } from 'react';
import './FloatingParticles.css';

export interface FloatingParticlesProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Number of particles */
    count?: number;
    /** Color variant */
    color?: 'primary' | 'secondary' | 'accent' | 'white' | 'mixed';
    /** Size distribution */
    sizes?: ('xs' | 'sm' | 'md' | 'lg' | 'xl')[];
    /** Animation duration range [min, max] in seconds */
    durationRange?: [number, number];
    /** Particle opacity */
    opacity?: number;
    /** Direction of float */
    direction?: 'vertical' | 'horizontal' | 'random';
    /** Enable blur for depth effect */
    blur?: boolean;
}

interface ParticleConfig {
    id: number;
    size: string;
    left: string;
    top: string;
    duration: number;
    delay: number;
    blur: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
    count = 20,
    color = 'mixed',
    sizes = ['xs', 'sm', 'md'],
    durationRange = [15, 30],
    opacity = 0.6,
    direction = 'vertical',
    blur = true,
    className = '',
    ...props
}) => {
    // Generate particle configurations
    const particles = useMemo<ParticleConfig[]>(() => {
        return Array.from({ length: count }, (_, i) => {
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            const duration = durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]);
            const delay = Math.random() * duration;
            const blurLevel = blur
                ? ['', 'blur-sm', 'blur-md', 'blur-lg'][Math.floor(Math.random() * 4)]
                : '';

            return {
                id: i,
                size,
                left: `${Math.random() * 100}%`,
                top: direction === 'random' ? `${Math.random() * 100}%` : '0',
                duration,
                delay,
                blur: blurLevel,
            };
        });
    }, [count, sizes, durationRange, blur, direction]);

    const containerClasses = [
        'particles-container',
        direction !== 'vertical' && `particles-container--${direction}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClasses} {...props}>
            {particles.map((particle) => {
                const particleClasses = [
                    'particle',
                    `particle--${particle.size}`,
                    `particle--${color}`,
                    particle.blur && `particle--${particle.blur}`,
                ]
                    .filter(Boolean)
                    .join(' ');

                const style = {
                    left: particle.left,
                    top: particle.top,
                    '--particle-duration': `${particle.duration}s`,
                    '--particle-delay': `${particle.delay}s`,
                    '--particle-opacity': opacity,
                } as React.CSSProperties;

                return (
                    <div
                        key={particle.id}
                        className={particleClasses}
                        style={style}
                    />
                );
            })}
        </div>
    );
};

export default FloatingParticles;
