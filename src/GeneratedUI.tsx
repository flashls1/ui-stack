import React from 'react';

// Template Types
export type TemplateType =
    | 'dashboard'
    | 'login'
    | 'landing'
    | 'profile'
    | 'settings'
    | 'table'
    | 'default';

export interface GeneratedUIProps {
    prompt: string;
    templateType: TemplateType;
    deviceWidth: number;
    deviceHeight: number;
}

// Detect template type from prompt keywords
export function detectTemplate(prompt: string): TemplateType {
    const lower = prompt.toLowerCase();

    if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('chart')) {
        return 'dashboard';
    }
    if (lower.includes('login') || lower.includes('sign in') || lower.includes('auth') || lower.includes('register')) {
        return 'login';
    }
    if (lower.includes('landing') || lower.includes('homepage') || lower.includes('hero')) {
        return 'landing';
    }
    if (lower.includes('profile') || lower.includes('account') || lower.includes('user')) {
        return 'profile';
    }
    if (lower.includes('settings') || lower.includes('preferences') || lower.includes('config')) {
        return 'settings';
    }
    if (lower.includes('table') || lower.includes('data') || lower.includes('list')) {
        return 'table';
    }

    return 'default';
}

// Dashboard Template
const DashboardTemplate: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="template template-dashboard">
        <aside className="dash-sidebar">
            <div className="sidebar-logo">📊</div>
            <nav className="sidebar-nav">
                <div className="nav-item active">🏠</div>
                <div className="nav-item">📈</div>
                <div className="nav-item">👥</div>
                <div className="nav-item">⚙️</div>
            </nav>
        </aside>
        <main className="dash-main">
            <header className="dash-header">
                <h1>Dashboard</h1>
                <div className="header-actions">
                    <span className="avatar">👤</span>
                </div>
            </header>
            <div className="dash-grid">
                <div className="stat-card">
                    <span className="stat-icon">📈</span>
                    <div className="stat-content">
                        <span className="stat-value">12,456</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-content">
                        <span className="stat-value">$45,678</span>
                        <span className="stat-label">Revenue</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-content">
                        <span className="stat-value">1,234</span>
                        <span className="stat-label">Orders</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <div className="stat-content">
                        <span className="stat-value">4.8</span>
                        <span className="stat-label">Rating</span>
                    </div>
                </div>
            </div>
            <div className="dash-chart">
                <h3>Weekly Activity</h3>
                <div className="chart-bars">
                    <div className="bar" style={{ height: '60%' }}><span>M</span></div>
                    <div className="bar" style={{ height: '80%' }}><span>T</span></div>
                    <div className="bar" style={{ height: '45%' }}><span>W</span></div>
                    <div className="bar" style={{ height: '90%' }}><span>T</span></div>
                    <div className="bar" style={{ height: '70%' }}><span>F</span></div>
                    <div className="bar" style={{ height: '50%' }}><span>S</span></div>
                    <div className="bar" style={{ height: '30%' }}><span>S</span></div>
                </div>
            </div>
        </main>
    </div>
);

// Login Template
const LoginTemplate: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="template template-login">
        <div className="login-card">
            <div className="login-logo">🔐</div>
            <h1>Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>
            <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="you@example.com" readOnly />
            </div>
            <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" readOnly />
            </div>
            <div className="login-options">
                <label className="checkbox">
                    <input type="checkbox" readOnly /> Remember me
                </label>
                <a href="#">Forgot password?</a>
            </div>
            <button className="btn-primary">Sign In</button>
            <div className="login-divider">
                <span>or continue with</span>
            </div>
            <div className="social-buttons">
                <button className="btn-social">G</button>
                <button className="btn-social">f</button>
                <button className="btn-social">🍎</button>
            </div>
            <p className="login-footer">
                Don't have an account? <a href="#">Sign up</a>
            </p>
        </div>
    </div>
);

// Landing Template
const LandingTemplate: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="template template-landing">
        <nav className="landing-nav">
            <div className="nav-logo">🚀 Brand</div>
            <div className="nav-links">
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">About</a>
            </div>
            <button className="btn-cta">Get Started</button>
        </nav>
        <section className="hero">
            <h1>Build Amazing Products<br /><span>Faster Than Ever</span></h1>
            <p>The all-in-one platform for modern teams to design, build, and ship.</p>
            <div className="hero-buttons">
                <button className="btn-primary">Start Free Trial</button>
                <button className="btn-secondary">Watch Demo</button>
            </div>
        </section>
        <section className="features">
            <div className="feature-card">
                <span className="feature-icon">⚡</span>
                <h3>Lightning Fast</h3>
                <p>Optimized for speed and performance</p>
            </div>
            <div className="feature-card">
                <span className="feature-icon">🔒</span>
                <h3>Secure</h3>
                <p>Enterprise-grade security built in</p>
            </div>
            <div className="feature-card">
                <span className="feature-icon">🎨</span>
                <h3>Beautiful UI</h3>
                <p>Stunning designs out of the box</p>
            </div>
        </section>
    </div>
);

// Profile Template
const ProfileTemplate: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="template template-profile">
        <div className="profile-header">
            <div className="profile-cover" />
            <div className="profile-avatar">👤</div>
        </div>
        <div className="profile-info">
            <h1>Alex Johnson</h1>
            <p className="profile-bio">Product Designer & Developer</p>
            <div className="profile-stats">
                <div className="stat"><strong>1.2k</strong> Followers</div>
                <div className="stat"><strong>348</strong> Following</div>
                <div className="stat"><strong>56</strong> Projects</div>
            </div>
            <div className="profile-actions">
                <button className="btn-primary">Follow</button>
                <button className="btn-secondary">Message</button>
            </div>
        </div>
        <div className="profile-tabs">
            <button className="tab active">Posts</button>
            <button className="tab">Media</button>
            <button className="tab">Likes</button>
        </div>
        <div className="profile-content">
            <div className="post-card">
                <p>Just launched my new portfolio! Check it out 🎨</p>
                <div className="post-meta">2h ago • 42 likes</div>
            </div>
        </div>
    </div>
);

// Settings Template
const SettingsTemplate: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="template template-settings">
        <aside className="settings-sidebar">
            <h2>Settings</h2>
            <nav>
                <a className="active">👤 Profile</a>
                <a>🔔 Notifications</a>
                <a>🔒 Privacy</a>
                <a>🎨 Appearance</a>
                <a>💳 Billing</a>
            </nav>
        </aside>
        <main className="settings-main">
            <h1>Profile Settings</h1>
            <div className="settings-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                    <div className="input-group">
                        <label>First Name</label>
                        <input type="text" placeholder="Alex" readOnly />
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" placeholder="Johnson" readOnly />
                    </div>
                </div>
                <div className="input-group full">
                    <label>Email</label>
                    <input type="email" placeholder="alex@example.com" readOnly />
                </div>
            </div>
            <div className="settings-section">
                <h3>Preferences</h3>
                <div className="toggle-row">
                    <span>Dark Mode</span>
                    <div className="toggle active" />
                </div>
                <div className="toggle-row">
                    <span>Email Notifications</span>
                    <div className="toggle" />
                </div>
            </div>
            <div className="settings-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Changes</button>
            </div>
        </main>
    </div>
);

// Table Template
const TableTemplate: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="template template-table">
        <header className="table-header">
            <h1>Data Overview</h1>
            <div className="table-actions">
                <input type="search" placeholder="Search..." readOnly />
                <button className="btn-primary">+ Add New</button>
            </div>
        </header>
        <div className="table-filters">
            <button className="filter active">All</button>
            <button className="filter">Active</button>
            <button className="filter">Pending</button>
            <button className="filter">Archived</button>
        </div>
        <table className="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Project Alpha</td>
                    <td><span className="badge success">Active</span></td>
                    <td>Jan 15, 2026</td>
                    <td><button className="btn-icon">⋮</button></td>
                </tr>
                <tr>
                    <td>Project Beta</td>
                    <td><span className="badge warning">Pending</span></td>
                    <td>Jan 12, 2026</td>
                    <td><button className="btn-icon">⋮</button></td>
                </tr>
                <tr>
                    <td>Project Gamma</td>
                    <td><span className="badge success">Active</span></td>
                    <td>Jan 10, 2026</td>
                    <td><button className="btn-icon">⋮</button></td>
                </tr>
            </tbody>
        </table>
        <div className="table-pagination">
            <span>Showing 1-3 of 24</span>
            <div className="pagination-buttons">
                <button disabled>←</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>→</button>
            </div>
        </div>
    </div>
);

// Default Template
const DefaultTemplate: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="template template-default">
        <div className="default-content">
            <div className="default-icon">🎨</div>
            <h2>Custom UI Generation</h2>
            <p className="default-prompt">"{prompt}"</p>
            <p className="default-hint">
                Try using keywords like: dashboard, login, landing, profile, settings, or table
            </p>
        </div>
    </div>
);

// Main Generated UI Component
export const GeneratedUI: React.FC<GeneratedUIProps> = ({
    prompt,
    templateType,
    deviceWidth,
    deviceHeight
}) => {
    const templates: Record<TemplateType, React.FC<{ prompt: string }>> = {
        dashboard: DashboardTemplate,
        login: LoginTemplate,
        landing: LandingTemplate,
        profile: ProfileTemplate,
        settings: SettingsTemplate,
        table: TableTemplate,
        default: DefaultTemplate,
    };

    const Template = templates[templateType];

    return (
        <div
            className="generated-ui-wrapper"
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto'
            }}
        >
            <Template prompt={prompt} />
        </div>
    );
};

export default GeneratedUI;
