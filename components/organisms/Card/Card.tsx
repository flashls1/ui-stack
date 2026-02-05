import React, { forwardRef, useRef, useEffect } from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Card variant */
    variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'glow' | 'outline' | 'filled' | 'spotlight' | 'border-gradient';
    /** Padding size */
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    /** Enable hover lift effect */
    hoverable?: boolean;
    /** Render as a link or button */
    as?: React.ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'default',
            padding = 'none',
            hoverable = false,
            as: Component = 'div',
            className = '',
            children,
            onMouseMove,
            ...props
        },
        ref
    ) => {
        const cardRef = useRef<HTMLDivElement>(null);

        // Spotlight effect tracking
        useEffect(() => {
            if (variant !== 'spotlight') return;

            const card = cardRef.current;
            if (!card) return;

            const handleMouseMove = (e: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            };

            card.addEventListener('mousemove', handleMouseMove);
            return () => card.removeEventListener('mousemove', handleMouseMove);
        }, [variant]);

        const classNames = [
            'card',
            `card--${variant}`,
            `card--padding-${padding}`,
            hoverable && 'card--hoverable',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <Component
                ref={ref || cardRef}
                className={classNames}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Card.displayName = 'Card';

/* ========== CARD SUB-COMPONENTS ========== */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    description,
    action,
    className = '',
    children,
    ...props
}) => {
    return (
        <div className={`card__header ${className}`} {...props}>
            {(title || description) && (
                <div className="card__header-content">
                    {title && <h3 className="card__title">{title}</h3>}
                    {description && <p className="card__description">{description}</p>}
                </div>
            )}
            {children}
            {action && <div className="card__header-action">{action}</div>}
        </div>
    );
};

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardBody: React.FC<CardBodyProps> = ({
    className = '',
    children,
    ...props
}) => {
    return (
        <div className={`card__body ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardFooter: React.FC<CardFooterProps> = ({
    className = '',
    children,
    ...props
}) => {
    return (
        <div className={`card__footer ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    ratio?: '16-9' | '4-3' | '1-1';
    overlay?: boolean;
    position?: 'top';
}

export const CardImage: React.FC<CardImageProps> = ({
    ratio = '16-9',
    overlay = false,
    position = 'top',
    className = '',
    alt = '',
    ...props
}) => {
    const classNames = [
        'card__image',
        `card__image--ratio-${ratio}`,
        position === 'top' && 'card__image--top',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames}>
            <img alt={alt} {...props} />
            {overlay && <div className="card__image-overlay" />}
        </div>
    );
};

export default Card;
