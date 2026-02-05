import React from 'react';
import './data-display.css';

/* ========== STAT CARD ========== */
export interface StatCardProps {
    label: string;
    value: string | number;
    change?: {
        value: string;
        positive?: boolean;
    };
    icon?: React.ReactNode;
    iconColor?: 'primary' | 'secondary' | 'accent' | 'success';
    variant?: 'default' | 'glass' | 'glow';
    gradient?: boolean;
    chart?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    change,
    icon,
    iconColor = 'primary',
    variant = 'default',
    gradient = false,
    chart,
}) => {
    const cardClasses = [
        'stat-card',
        variant !== 'default' && `stat-card--${variant}`,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClasses}>
            <div className="stat-card__header">
                <span className="stat-card__label">{label}</span>
                {icon && (
                    <div className={`stat-card__icon stat-card__icon--${iconColor}`}>
                        {icon}
                    </div>
                )}
            </div>
            <div className={`stat-card__value ${gradient ? 'stat-card__value--gradient' : ''}`}>
                {value}
            </div>
            {change && (
                <span className={`stat-card__change stat-card__change--${change.positive ? 'positive' : 'negative'}`}>
                    {change.positive ? '↑' : '↓'} {change.value}
                </span>
            )}
            {chart && <div className="stat-card__chart">{chart}</div>}
        </div>
    );
};

/* ========== DATA TABLE ========== */
export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    striped?: boolean;
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id?: string | number }>({
    columns,
    data,
    striped = false,
    onRowClick,
}: DataTableProps<T>) {
    return (
        <div className="data-table-wrapper">
            <table className={`data-table ${striped ? 'data-table--striped' : ''}`}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                style={{ textAlign: col.align || 'left' }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item.id ?? index}
                            onClick={() => onRowClick?.(item)}
                            style={{ cursor: onRowClick ? 'pointer' : undefined }}
                        >
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    style={{ textAlign: col.align || 'left' }}
                                    className={col.align === 'right' ? 'data-table__cell--number' : ''}
                                >
                                    {col.render
                                        ? col.render(item)
                                        : String((item as any)[col.key] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ========== DATA LIST ========== */
export interface DataListItemProps {
    avatar?: React.ReactNode;
    title: string;
    subtitle?: string;
    meta?: React.ReactNode;
    actions?: React.ReactNode;
    onClick?: () => void;
}

export const DataListItem: React.FC<DataListItemProps> = ({
    avatar,
    title,
    subtitle,
    meta,
    actions,
    onClick,
}) => {
    return (
        <div
            className="data-list__item"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : undefined }}
        >
            {avatar && <div className="data-list__avatar">{avatar}</div>}
            <div className="data-list__content">
                <div className="data-list__title">{title}</div>
                {subtitle && <div className="data-list__subtitle">{subtitle}</div>}
            </div>
            {meta && <div className="data-list__meta">{meta}</div>}
            {actions}
        </div>
    );
};

export interface DataListProps {
    children: React.ReactNode;
}

export const DataList: React.FC<DataListProps> = ({ children }) => {
    return <div className="data-list">{children}</div>;
};

/* ========== PROGRESS ========== */
export interface ProgressProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error';
    label?: string;
    showValue?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    label,
    showValue = false,
}) => {
    const percentage = Math.min(100, (value / max) * 100);
    const barClass = variant === 'default' ? '' : `progress__bar--${variant}`;

    if (label || showValue) {
        return (
            <div className="progress-labeled">
                <div className="progress-labeled__header">
                    {label && <span className="progress-labeled__label">{label}</span>}
                    {showValue && <span className="progress-labeled__value">{value}%</span>}
                </div>
                <div className={`progress ${size !== 'md' ? `progress--${size}` : ''}`}>
                    <div
                        className={`progress__bar ${barClass}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`progress ${size !== 'md' ? `progress--${size}` : ''}`}>
            <div
                className={`progress__bar ${barClass}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

/* ========== TIMELINE ========== */
export interface TimelineItemData {
    id: string | number;
    time: string;
    title: string;
    description?: string;
    status?: 'default' | 'success' | 'warning' | 'error';
}

export interface TimelineProps {
    items: TimelineItemData[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
        <div className="timeline">
            {items.map((item) => (
                <div key={item.id} className="timeline__item">
                    <div className={`timeline__dot ${item.status ? `timeline__dot--${item.status}` : ''}`} />
                    <div className="timeline__time">{item.time}</div>
                    <div className="timeline__title">{item.title}</div>
                    {item.description && (
                        <div className="timeline__description">{item.description}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

/* ========== SIMPLE BAR CHART ========== */
export interface BarChartProps {
    data: number[];
    maxValue?: number;
    title?: string;
    legend?: { label: string; color: string }[];
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    maxValue,
    title,
    legend,
}) => {
    const max = maxValue ?? Math.max(...data, 1);

    return (
        <div className="chart-container">
            {(title || legend) && (
                <div className="chart-container__header">
                    {title && <span className="chart-container__title">{title}</span>}
                    {legend && (
                        <div className="chart-container__legend">
                            {legend.map((item, i) => (
                                <div key={i} className="chart-container__legend-item">
                                    <span
                                        className="chart-container__legend-dot"
                                        style={{ background: item.color }}
                                    />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="chart-container__body">
                {data.map((value, index) => (
                    <div
                        key={index}
                        className="bar-chart__bar"
                        style={{ height: `${(value / max) * 100}%` }}
                        title={String(value)}
                    />
                ))}
            </div>
        </div>
    );
};

/* ========== EMPTY STATE ========== */
export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state__icon">{icon}</div>}
            <h3 className="empty-state__title">{title}</h3>
            {description && <p className="empty-state__description">{description}</p>}
            {action}
        </div>
    );
};

export default {
    StatCard,
    DataTable,
    DataList,
    DataListItem,
    Progress,
    Timeline,
    BarChart,
    EmptyState,
};
