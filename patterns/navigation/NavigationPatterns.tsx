import React, { useState, useEffect } from 'react';
import './navigation.css';

/* ========== NAVBAR ========== */
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    /** Navbar visual variant */
    variant?: 'default' | 'glass' | 'transparent' | 'floating';
    /** Brand/logo section */
    brand?: React.ReactNode;
    /** Navigation links */
    links?: React.ReactNode;
    /** Right side actions */
    actions?: React.ReactNode;
    /** Mobile menu content */
    mobileMenu?: React.ReactNode;
    /** Show scrolled state automatically */
    scrollEffect?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
    variant = 'default',
    brand,
    links,
    actions,
    mobileMenu,
    scrollEffect = false,
    className = '',
    ...props
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        if (!scrollEffect) return;

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollEffect]);

    const classNames = [
        'navbar',
        `navbar--${variant}`,
        scrollEffect && isScrolled && 'navbar--scrolled',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <nav className={classNames} {...props}>
                {brand && <div className="navbar__brand">{brand}</div>}
                {links && <div className="navbar__nav">{links}</div>}
                <div className="navbar__actions">
                    {actions}
                    {mobileMenu && (
                        <button
                            className="navbar__menu-toggle"
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {isMobileOpen ? (
                                    <path d="M18 6L6 18M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    )}
                </div>
            </nav>
            {mobileMenu && isMobileOpen && (
                <Drawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)}>
                    {mobileMenu}
                </Drawer>
            )}
        </>
    );
};

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
    active = false,
    className = '',
    children,
    ...props
}) => {
    return (
        <a
            className={`navbar__link ${active ? 'navbar__link--active' : ''} ${className}`}
            {...props}
        >
            {children}
        </a>
    );
};

/* ========== SIDEBAR ========== */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
    variant?: 'default' | 'glass' | 'dark';
    isOpen?: boolean;
    isCollapsed?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
    variant = 'default',
    isOpen = false,
    isCollapsed = false,
    header,
    footer,
    className = '',
    children,
    ...props
}) => {
    const classNames = [
        'sidebar',
        `sidebar--${variant}`,
        isOpen && 'sidebar--open',
        isCollapsed && 'sidebar--collapsed',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <aside className={classNames} {...props}>
            {header && <div className="sidebar__header">{header}</div>}
            <div className="sidebar__content">
                {children}
            </div>
            {footer && <div className="sidebar__footer">{footer}</div>}
        </aside>
    );
};

export interface SidebarSectionProps {
    title?: string;
    children: React.ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
    return (
        <div className="sidebar__section">
            {title && <div className="sidebar__section-title">{title}</div>}
            <nav className="sidebar__nav">{children}</nav>
        </div>
    );
};

export interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    active?: boolean;
    href?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
    icon,
    badge,
    active = false,
    href = '#',
    className = '',
    children,
    ...props
}) => {
    return (
        <a
            href={href}
            className={`sidebar__item ${active ? 'sidebar__item--active' : ''} ${className}`}
            {...props}
        >
            {icon && <span className="sidebar__item-icon">{icon}</span>}
            <span>{children}</span>
            {badge && <span className="sidebar__item-badge">{badge}</span>}
        </a>
    );
};

/* ========== DRAWER ========== */
export interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    position?: 'left' | 'right';
    variant?: 'default' | 'glass';
    children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    position = 'left',
    variant = 'default',
    children,
}) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const drawerClasses = [
        'drawer',
        isOpen && 'drawer--open',
        position === 'right' && 'drawer--right',
        variant === 'glass' && 'drawer--glass',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? 'drawer-overlay--open' : ''}`}
                onClick={onClose}
            />
            <div className={drawerClasses}>
                {children}
            </div>
        </>
    );
};

/* ========== BREADCRUMBS ========== */
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    separator = '/',
}) => {
    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            {items.map((item, index) => (
                <div key={index} className="breadcrumbs__item">
                    {index > 0 && (
                        <span className="breadcrumbs__separator">{separator}</span>
                    )}
                    {index === items.length - 1 ? (
                        <span className="breadcrumbs__current">{item.label}</span>
                    ) : (
                        <a href={item.href} className="breadcrumbs__link">
                            {item.label}
                        </a>
                    )}
                </div>
            ))}
        </nav>
    );
};

/* ========== TABS ========== */
export interface Tab {
    id: string;
    label: string;
    content?: React.ReactNode;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'default' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    variant = 'default',
}) => {
    return (
        <div className={`tabs ${variant === 'pills' ? 'tabs--pills' : ''}`} role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`tabs__tab ${activeTab === tab.id ? 'tabs__tab--active' : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default {
    Navbar,
    NavLink,
    Sidebar,
    SidebarSection,
    SidebarItem,
    Drawer,
    Breadcrumbs,
    Tabs,
};
