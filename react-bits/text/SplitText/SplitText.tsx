/**
 * SplitText Component
 * Adapted from React Bits (https://reactbits.dev)
 * 
 * Animates text by splitting it into characters, words, or lines
 * and animating each element with GSAP for high-performance animations.
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import './SplitText.css';

export interface SplitTextProps {
    /** Text to animate */
    text: string;
    /** Additional className */
    className?: string;
    /** Delay between each element animation (in seconds) */
    delay?: number;
    /** Animation duration (in seconds) */
    duration?: number;
    /** Easing function */
    easing?: string;
    /** Split mode */
    splitBy?: 'chars' | 'words' | 'lines';
    /** Initial animation state */
    animationFrom?: gsap.TweenVars;
    /** Final animation state */
    animationTo?: gsap.TweenVars;
    /** Trigger animation on mount or when in view */
    trigger?: 'mount' | 'inView';
    /** Callback when animation completes */
    onComplete?: () => void;
}

export const SplitText: React.FC<SplitTextProps> = ({
    text,
    className = '',
    delay = 0.05,
    duration = 0.6,
    easing = 'power3.out',
    splitBy = 'chars',
    animationFrom = { opacity: 0, y: 40 },
    animationTo = { opacity: 1, y: 0 },
    trigger = 'mount',
    onComplete,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<HTMLSpanElement[]>([]);
    const hasAnimated = useRef(false);

    const elements = useMemo(() => {
        switch (splitBy) {
            case 'words':
                return text.split(' ').map((word, i, arr) => ({
                    content: word + (i < arr.length - 1 ? '\u00A0' : ''),
                    key: i,
                }));
            case 'lines':
                return text.split('\n').map((line, i) => ({
                    content: line,
                    key: i,
                }));
            case 'chars':
            default:
                return text.split('').map((char, i) => ({
                    content: char === ' ' ? '\u00A0' : char,
                    key: i,
                }));
        }
    }, [text, splitBy]);

    const animate = () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        gsap.fromTo(
            elementsRef.current,
            animationFrom,
            {
                ...animationTo,
                duration,
                ease: easing,
                stagger: delay,
                onComplete,
            }
        );
    };

    useEffect(() => {
        if (trigger === 'mount') {
            animate();
            return;
        }

        if (trigger === 'inView') {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animate();
                            observer.disconnect();
                        }
                    });
                },
                { threshold: 0.1 }
            );

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => observer.disconnect();
        }
    }, [trigger]);

    return (
        <div ref={containerRef} className={`split-text ${className}`}>
            {elements.map((element, index) => (
                <span
                    key={element.key}
                    ref={(el) => {
                        if (el) elementsRef.current[index] = el;
                    }}
                    className={`split-text__element split-text__${splitBy.slice(0, -1)}`}
                    style={{ ...animationFrom }}
                >
                    {element.content}
                </span>
            ))}
        </div>
    );
};

export default SplitText;
