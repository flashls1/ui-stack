import React, { useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import '../tokens/variables.css';
import '../masterson-ui.css';
import './templates.css';
import './wizard/wizard.css';
import { GeneratedUI, detectTemplate, TemplateType } from './GeneratedUI';
import { WizardProvider, useWizard, designLevels, DesignLevel } from './wizard/WizardContext';
import { WizardModal } from './wizard/WizardModal';

// Types
type Language = 'en' | 'es';
type DevicePreset = 'phone-large' | 'phone-small' | 'desktop';

interface DeviceConfig {
    name: string;
    nameEs: string;
    width: number;
    height: number;
    icon: string;
}

// Device presets with real dimensions
const devicePresets: Record<DevicePreset, DeviceConfig> = {
    'phone-large': {
        name: 'iPhone Pro Max',
        nameEs: 'iPhone Pro Max',
        icon: '📱',
        width: 430,
        height: 932,
    },
    'phone-small': {
        name: 'iPhone SE/Small',
        nameEs: 'iPhone SE/Pequeño',
        icon: '📱',
        width: 320,
        height: 568,
    },
    'desktop': {
        name: 'Desktop 16:9',
        nameEs: 'Escritorio 16:9',
        icon: '🖥️',
        width: 1280,
        height: 720,
    },
};

interface Translations {
    title: string;
    subtitle: string;
    placeholder: string;
    generate: string;
    generating: string;
    clear: string;
    export: string;
    welcome: string;
    welcomeDesc: string;
    startDesigning: string;
    detected: string;
    designLevel: string;
    wizard: string;
}

const translations: Record<Language, Translations> = {
    en: {
        title: 'Masterson UI',
        subtitle: 'Turning Ideas Into Reality',
        placeholder: 'Describe the UI you want...\n\nTry: "A dashboard with analytics", "Login page with social auth", "Landing page for a SaaS app", "User profile page", "Settings page", or "Data table with filters"',
        generate: '✨ Generate',
        generating: 'Designing...',
        clear: 'Clear',
        export: 'Export',
        welcome: 'Welcome to Masterson UI',
        welcomeDesc: 'Describe your vision and watch it come to life',
        startDesigning: 'Start Designing',
        detected: 'Template',
        designLevel: 'Design Level',
        wizard: 'Wizard',
    },
    es: {
        title: 'Masterson UI',
        subtitle: 'Convirtiendo Ideas en Realidad',
        placeholder: 'Describe la interfaz que deseas...\n\nPrueba: "Un panel con analíticas", "Página de login con auth social", "Landing page para una app SaaS", "Página de perfil", "Página de configuración", o "Tabla de datos con filtros"',
        generate: '✨ Generar',
        generating: 'Diseñando...',
        clear: 'Limpiar',
        export: 'Exportar',
        welcome: 'Bienvenido a Masterson UI',
        welcomeDesc: 'Describe tu visión y mírala cobrar vida',
        startDesigning: 'Comenzar',
        detected: 'Plantilla',
        designLevel: 'Nivel de Diseño',
        wizard: 'Asistente',
    },
};

const LanguageContext = createContext<{
    lang: Language;
    t: Translations;
}>({
    lang: 'en',
    t: translations.en,
});

const useLanguage = () => useContext(LanguageContext);

// Design Level Selector Component
const DesignLevelSelector: React.FC = () => {
    const { lang } = useLanguage();
    const { state, setDesignLevel } = useWizard();

    return (
        <div className="design-level-selector">
            {(Object.keys(designLevels) as DesignLevel[]).map((level) => {
                const config = designLevels[level];
                const isActive = state.designLevel === level;

                return (
                    <button
                        key={level}
                        className={`level-btn ${isActive ? 'active' : ''} ${level === 'insane' ? 'insane' : ''}`}
                        onClick={() => setDesignLevel(level)}
                        title={config.description}
                    >
                        <span className="level-icon">{config.icon}</span>
                        <span className="level-name">{lang === 'es' ? config.nameEs : config.name}</span>
                    </button>
                );
            })}
        </div>
    );
};

// Device Selector Component
const DeviceSelector: React.FC<{
    device: DevicePreset;
    setDevice: (d: DevicePreset) => void;
}> = ({ device, setDevice }) => {
    const { lang } = useLanguage();

    return (
        <div className="device-selector">
            {(Object.keys(devicePresets) as DevicePreset[]).map((key) => {
                const preset = devicePresets[key];
                const name = lang === 'es' ? preset.nameEs : preset.name;
                const isActive = device === key;

                return (
                    <button
                        key={key}
                        className={`device-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setDevice(key)}
                        title={`${name} (${preset.width}×${preset.height})`}
                    >
                        <span className="device-icon">{preset.icon}</span>
                        <span className="device-name">{name}</span>
                        <span className="device-dims">{preset.width}×{preset.height}</span>
                    </button>
                );
            })}
        </div>
    );
};

// Template badge names
const templateNames: Record<TemplateType, { en: string; es: string }> = {
    dashboard: { en: 'Dashboard', es: 'Panel' },
    login: { en: 'Login', es: 'Inicio de Sesión' },
    landing: { en: 'Landing Page', es: 'Página de Inicio' },
    profile: { en: 'Profile', es: 'Perfil' },
    settings: { en: 'Settings', es: 'Configuración' },
    table: { en: 'Data Table', es: 'Tabla de Datos' },
    default: { en: 'Custom', es: 'Personalizado' },
};

// Main App Content
const MastersonUIContent: React.FC = () => {
    const [lang, setLang] = useState<Language>('en');
    const [prompt, setPrompt] = useState('');
    const [device, setDevice] = useState<DevicePreset>('desktop');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [templateType, setTemplateType] = useState<TemplateType>('default');
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const { openWizard } = useWizard();
    const t = translations[lang];
    const currentDevice = devicePresets[device];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        // Detect template type from prompt
        const detected = detectTemplate(prompt);

        // Simulate slight delay for UX
        setTimeout(() => {
            setTemplateType(detected);
            setGeneratedPrompt(prompt);
            setIsGenerating(false);
            setIsPanelOpen(false); // Auto-collapse panel
        }, 800);
    };

    const handleClear = () => {
        setPrompt('');
        setGeneratedPrompt(null);
        setTemplateType('default');
    };

    return (
        <LanguageContext.Provider value={{ lang, t }}>
            <div className="masterson-app">
                {/* Floating Header */}
                <header className={`floating-header ${!isPanelOpen ? 'panel-closed' : ''}`}>
                    <div className="header-brand">
                        <img src="/masterson-icon.png" alt="" className="header-logo" />
                        <span className="brand-name">{t.title}</span>
                    </div>

                    <div className="header-controls">
                        {/* Design Level Selector */}
                        <DesignLevelSelector />

                        {/* Device Selector */}
                        <DeviceSelector device={device} setDevice={setDevice} />

                        {/* Language Toggle */}
                        <div className="lang-toggle">
                            <button
                                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                                onClick={() => setLang('en')}
                            >
                                EN
                            </button>
                            <button
                                className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
                                onClick={() => setLang('es')}
                            >
                                ES
                            </button>
                        </div>

                        {/* Wizard Button */}
                        <button className="btn-wizard" onClick={openWizard}>
                            <span className="btn-wizard-icon">🧙</span>
                            {t.wizard}
                        </button>

                        {generatedPrompt && (
                            <button className="export-btn">📦 {t.export}</button>
                        )}
                    </div>
                </header>

                {/* Main Layout */}
                <div className="main-layout">
                    {/* Side Panel */}
                    <aside className={`side-panel ${isPanelOpen ? 'open' : 'closed'}`}>
                        <div className="panel-content">
                            <div className="panel-header">
                                <h2>🎨 Design Prompt</h2>
                                <button className="panel-close" onClick={() => setIsPanelOpen(false)}>✕</button>
                            </div>

                            <textarea
                                className="prompt-input"
                                placeholder={t.placeholder}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />

                            <div className="panel-actions">
                                <button
                                    className="btn-clear"
                                    onClick={handleClear}
                                    disabled={!prompt && !generatedPrompt}
                                >
                                    {t.clear}
                                </button>
                                <button
                                    className="btn-generate"
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isGenerating}
                                >
                                    {isGenerating ? t.generating : t.generate}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Toggle Button */}
                    {!isPanelOpen && (
                        <button className="panel-toggle" onClick={() => setIsPanelOpen(true)}>
                            ✏️
                        </button>
                    )}

                    {/* Preview Area */}
                    <main className={`preview-area ${isPanelOpen ? 'with-panel' : ''}`}>
                        {/* Device Frame */}
                        <div
                            className={`device-frame device-${device}`}
                            style={{
                                '--device-width': `${currentDevice.width}px`,
                                '--device-height': `${currentDevice.height}px`,
                            } as React.CSSProperties}
                        >
                            {/* Phone Notch */}
                            {device !== 'desktop' && (
                                <div className="device-notch">
                                    <div className="notch-inner" />
                                </div>
                            )}

                            {/* Screen Content */}
                            <div className="device-screen">
                                {generatedPrompt ? (
                                    <GeneratedUI
                                        prompt={generatedPrompt}
                                        templateType={templateType}
                                        deviceWidth={currentDevice.width}
                                        deviceHeight={currentDevice.height}
                                    />
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-icon">✨</div>
                                        <h2>{t.welcome}</h2>
                                        <p>{t.welcomeDesc}</p>
                                        {!isPanelOpen && (
                                            <button className="btn-start" onClick={() => setIsPanelOpen(true)}>
                                                {t.startDesigning}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Phone Home Indicator */}
                            {device !== 'desktop' && (
                                <div className="device-home-indicator" />
                            )}
                        </div>

                        {/* Device Label */}
                        <div className="device-label">
                            {lang === 'es' ? currentDevice.nameEs : currentDevice.name}
                            <span className="label-dims">{currentDevice.width} × {currentDevice.height}</span>
                            {generatedPrompt && (
                                <span className="template-badge">
                                    {t.detected}: {templateNames[templateType][lang]}
                                </span>
                            )}
                        </div>
                    </main>
                </div>

                {/* Wizard Modal */}
                <WizardModal lang={lang} />

                {/* Mini Footer */}
                <footer className="mini-footer">
                    Masterson Solutions © 2026
                </footer>
            </div>
        </LanguageContext.Provider>
    );
};

// Main App with Provider
const MastersonUI: React.FC = () => {
    return (
        <WizardProvider>
            <MastersonUIContent />
        </WizardProvider>
    );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<MastersonUI />);
