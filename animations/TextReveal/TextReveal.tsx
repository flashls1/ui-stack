import React, { useEffect, useState, useRef } from 'react';
import './TextReveal.css';

export type TextRevealVariant =
    | 'fade-up'
    | 'slide-left'
    | 'slide-right'
    | 'blur'
    | 'typewriter'
    | 'words'
    | 'chars'
    | 'glitch'
    | 'highlight';

export interface TextRevealProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Animation variant */
    variant?: TextRevealVariant;
    /** Text content (required for typewriter, words, chars, glitch) */
    text?: string;
    /** Animation speed */
    speed?: 'fast' | 'normal' | 'slow';
    /** Delay before animation starts (ms) */
    delay?: number;
    /** Stagger delay for word/char animations (ms) */
    staggerDelay?: number;
    /** Trigger animation when element enters viewport */
    triggerOnScroll?: boolean;
    /** HTML tag to render */
    as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

export const TextReveal: React.FC<TextRevealProps> = ({
    variant = 'fade-up',
    text,
    speed = 'normal',
    delay = 0,
    staggerDelay = 50,
    triggerOnScroll = false,
    as: Component = 'div',
    className = '',
    children,
    style,
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(!triggerOnScroll);
    const [isComplete, setIsComplete] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Intersection Observer for scroll trigger
    useEffect(() => {
        if (!triggerOnScroll) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [triggerOnScroll]);

    // Handle typewriter completion
    useEffect(() => {
        if (variant === 'typewriter' && isVisible) {
            const charCount = (text || '').length;
            const duration = charCount * 100; // ~100ms per character
            const timer = setTimeout(() => setIsComplete(true), duration);
            return () => clearTimeout(timer);
        }
    }, [variant, text, isVisible]);

    const containerClasses = [
        'text-reveal',
        isVisible && `text-reveal--${variant}`,
        speed !== 'normal' && `text-reveal--${speed}`,
        isComplete && 'text-reveal--complete',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const contentStyle = {
        ...style,
        animationDelay: delay ? `${delay}ms` : undefined,
        '--char-count': text?.length,
    } as React.CSSProperties;

    // Render based on variant
    const renderContent = () => {
        const content = text || children;

        switch (variant) {
            case 'words':
                if (!text) return <span className="text-reveal__content">{children}</span>;
                const words = text.split(' ');
                return (
                    <>
                        {words.map((word, i) => (
                            <span
                                key={i}
                                className="text-reveal__word"
                                style={{ animationDelay: `${delay + i * staggerDelay}ms` }}
                            >
                                {word}{i < words.length - 1 ? '\u00A0' : ''}
                            </span>
                        ))}
                    </>
                );

            case 'chars':
                if (!text) return <span className="text-reveal__content">{children}</span>;
                const chars = text.split('');
                return (
                    <>
                        {chars.map((char, i) => (
                            <span
                                key={i}
                                className="text-reveal__char"
                                style={{ animationDelay: `${delay + i * (staggerDelay / 2)}ms` }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </>
                );

            case 'glitch':
                return (
                    <span className="text-reveal__content" data-text={text || ''}>
                        {content}
                    </span>
                );

            default:
                return <span className="text-reveal__content">{content}</span>;
        }
    };

    return (
        <Component
            ref={ref}
            className={containerClasses}
            style={contentStyle}
            {...props}
        >
            {isVisible && renderContent()}
        </Component>
    );
};

export default TextReveal;
