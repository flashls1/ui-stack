/**
 * ClickSpark Component
 * Adapted from React Bits (https://reactbits.dev)
 * 
 * Creates spark particles on click events,
 * adding satisfying micro-interactions.
 */

import React, { useRef, useCallback } from 'react';
import './ClickSpark.css';

export interface ClickSparkProps {
    /** Spark color */
    sparkColor?: string;
    /** Number of sparks per click */
    sparkCount?: number;
    /** Spark size range [min, max] in px */
    sparkSize?: [number, number];
    /** Spark travel distance */
    spreadDistance?: number;
    /** Animation duration (ms) */
    duration?: number;
    /** Children to wrap */
    children: React.ReactNode;
}

interface Spark {
    id: number;
    x: number;
    y: number;
    size: number;
    angle: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
    sparkColor = '#fbbf24',
    sparkCount = 8,
    sparkSize = [4, 8],
    spreadDistance = 40,
    duration = 400,
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sparkIdRef = useRef(0);

    const createSpark = useCallback((x: number, y: number): Spark => {
        const [minSize, maxSize] = sparkSize;
        return {
            id: sparkIdRef.current++,
            x,
            y,
            size: Math.random() * (maxSize - minSize) + minSize,
            angle: Math.random() * 360,
        };
    }, [sparkSize]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create spark elements
        const sparks: Spark[] = [];
        for (let i = 0; i < sparkCount; i++) {
            sparks.push(createSpark(x, y));
        }

        // Render sparks
        sparks.forEach((spark) => {
            const sparkEl = document.createElement('div');
            sparkEl.className = 'click-spark__particle';
            sparkEl.style.cssText = `
        left: ${spark.x}px;
        top: ${spark.y}px;
        width: ${spark.size}px;
        height: ${spark.size}px;
        background: ${sparkColor};
        --angle: ${spark.angle}deg;
        --distance: ${spreadDistance}px;
        --duration: ${duration}ms;
      `;

            containerRef.current?.appendChild(sparkEl);

            // Remove after animation
            setTimeout(() => {
                sparkEl.remove();
            }, duration);
        });
    }, [sparkCount, sparkColor, spreadDistance, duration, createSpark]);

    return (
        <div
            ref={containerRef}
            className="click-spark"
            onClick={handleClick}
        >
            {children}
        </div>
    );
};

export default ClickSpark;
