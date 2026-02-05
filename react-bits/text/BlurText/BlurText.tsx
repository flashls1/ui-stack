/**
 * BlurText Component
 * Adapted from React Bits (https://reactbits.dev)
 * 
 * Creates a localized blur animation on text as it appears,
 * using Framer Motion for smooth transitions.
 */

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'motion';
import './BlurText.css';

export interface BlurTextProps {
    /** Text to animate */
    text: string;
    /** Additional className */
    className?: string;
    /** Delay between each word animation (in seconds) */
    delay?: number;
    /** Animation duration (in seconds) */
    duration?: number;
    /** Initial blur amount (px) */
    blurAmount?: number;
    /** Animate when in view */
    animateOnView?: boolean;
    /** Threshold for in-view trigger (0-1) */
    threshold?: number;
    /** Callback when animation completes */
    onComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
    text,
    className = '',
    delay = 0.05,
    duration = 0.5,
    blurAmount = 10,
    animateOnView = true,
    threshold = 0.1,
    onComplete,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, {
        once: true,
        amount: threshold,
    });

    const words = text.split(' ');

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: delay,
            },
        },
    };

    const wordVariants: Variants = {
        hidden: {
            opacity: 0,
            filter: `blur(${blurAmount}px)`,
            y: 20,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                duration,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const shouldAnimate = animateOnView ? isInView : true;

    return (
        <motion.div
            ref={containerRef}
            className={`blur-text ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate={shouldAnimate ? 'visible' : 'hidden'}
            onAnimationComplete={() => {
                if (shouldAnimate && onComplete) {
                    onComplete();
                }
            }}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    className="blur-text__word"
                    variants={wordVariants}
                >
                    {word}
                    {index < words.length - 1 && '\u00A0'}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default BlurText;
