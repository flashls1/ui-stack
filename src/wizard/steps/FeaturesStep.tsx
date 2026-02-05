import React from 'react';
import { useWizard, Features } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

interface FeatureOption {
    key: keyof Features;
    icon: string;
    name: { en: string; es: string };
    desc: { en: string; es: string };
}

const featureOptions: FeatureOption[] = [
    { key: 'authentication', icon: '🔐', name: { en: 'Authentication', es: 'Autenticación' }, desc: { en: 'Login/Signup forms', es: 'Formularios de login' } },
    { key: 'socialLinks', icon: '📱', name: { en: 'Social Links', es: 'Redes Sociales' }, desc: { en: 'Social media icons', es: 'Iconos de redes' } },
    { key: 'contactForm', icon: '📧', name: { en: 'Contact Form', es: 'Formulario de Contacto' }, desc: { en: 'Email contact form', es: 'Formulario de email' } },
    { key: 'newsletter', icon: '📬', name: { en: 'Newsletter', es: 'Boletín' }, desc: { en: 'Email subscription', es: 'Suscripción por email' } },
    { key: 'chatWidget', icon: '💬', name: { en: 'Chat Widget', es: 'Widget de Chat' }, desc: { en: 'Live chat placeholder', es: 'Chat en vivo' } },
    { key: 'cookieConsent', icon: '🍪', name: { en: 'Cookie Banner', es: 'Banner de Cookies' }, desc: { en: 'GDPR consent banner', es: 'Banner de consentimiento' } },
    { key: 'backToTop', icon: '⬆️', name: { en: 'Back to Top', es: 'Volver Arriba' }, desc: { en: 'Scroll to top button', es: 'Botón de scroll arriba' } },
    { key: 'darkModeToggle', icon: '🌙', name: { en: 'Dark Mode', es: 'Modo Oscuro' }, desc: { en: 'Light/Dark toggle', es: 'Cambiar tema' } },
];

export const FeaturesStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateFeatures } = useWizard();

    const labels = {
        en: {
            title: 'Features & Functionality',
            subtitle: 'Select the features you want on your landing page',
            selectAll: 'Select All',
            clearAll: 'Clear All'
        },
        es: {
            title: 'Funciones y Características',
            subtitle: 'Selecciona las funciones que quieres en tu página',
            selectAll: 'Seleccionar Todo',
            clearAll: 'Limpiar Todo'
        }
    };

    const t = labels[lang];

    const toggleFeature = (key: keyof Features) => {
        updateFeatures({ [key]: !state.features[key] });
    };

    const selectAll = () => {
        const allTrue = featureOptions.reduce((acc, f) => ({ ...acc, [f.key]: true }), {});
        updateFeatures(allTrue);
    };

    const clearAll = () => {
        const allFalse = featureOptions.reduce((acc, f) => ({ ...acc, [f.key]: false }), {});
        updateFeatures(allFalse);
    };

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
                <div className="bulk-actions">
                    <button className="btn-small" onClick={selectAll}>{t.selectAll}</button>
                    <button className="btn-small secondary" onClick={clearAll}>{t.clearAll}</button>
                </div>
            </div>

            <div className="checkbox-grid">
                {featureOptions.map(feature => (
                    <div
                        key={feature.key}
                        className={`checkbox-card ${state.features[feature.key] ? 'checked' : ''}`}
                        onClick={() => toggleFeature(feature.key)}
                    >
                        <div className="checkbox-indicator">
                            {state.features[feature.key] ? '✓' : ''}
                        </div>
                        <span className="checkbox-icon">{feature.icon}</span>
                        <span className="checkbox-name">{feature.name[lang]}</span>
                        <span className="checkbox-desc">{feature.desc[lang]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesStep;
