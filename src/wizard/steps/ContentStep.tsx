import React from 'react';
import { useWizard, ContentSections } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

interface ContentOption {
    key: keyof ContentSections;
    icon: string;
    name: { en: string; es: string };
    desc: { en: string; es: string };
}

const contentOptions: ContentOption[] = [
    { key: 'about', icon: '📖', name: { en: 'About Section', es: 'Sección Acerca' }, desc: { en: 'Company story', es: 'Historia de la empresa' } },
    { key: 'services', icon: '⚡', name: { en: 'Services/Features', es: 'Servicios' }, desc: { en: 'Feature cards grid', es: 'Tarjetas de servicios' } },
    { key: 'testimonials', icon: '💬', name: { en: 'Testimonials', es: 'Testimonios' }, desc: { en: 'Customer reviews', es: 'Reseñas de clientes' } },
    { key: 'team', icon: '👥', name: { en: 'Team', es: 'Equipo' }, desc: { en: 'Team members', es: 'Miembros del equipo' } },
    { key: 'pricing', icon: '💰', name: { en: 'Pricing', es: 'Precios' }, desc: { en: 'Pricing table', es: 'Tabla de precios' } },
    { key: 'faq', icon: '❓', name: { en: 'FAQ', es: 'Preguntas Frecuentes' }, desc: { en: 'Questions accordion', es: 'Acordeón de preguntas' } },
    { key: 'portfolio', icon: '🖼️', name: { en: 'Portfolio/Gallery', es: 'Portafolio' }, desc: { en: 'Image gallery', es: 'Galería de imágenes' } },
    { key: 'blog', icon: '📝', name: { en: 'Blog Preview', es: 'Vista de Blog' }, desc: { en: 'Latest posts', es: 'Últimas publicaciones' } },
    { key: 'stats', icon: '📊', name: { en: 'Stats/Numbers', es: 'Estadísticas' }, desc: { en: 'Animated counters', es: 'Contadores animados' } },
    { key: 'partners', icon: '🤝', name: { en: 'Partners/Logos', es: 'Socios' }, desc: { en: 'Logo carousel', es: 'Carrusel de logos' } },
    { key: 'cta', icon: '🎯', name: { en: 'CTA Banner', es: 'Banner CTA' }, desc: { en: 'Call to action', es: 'Llamado a la acción' } },
];

export const ContentStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateContent } = useWizard();

    const labels = {
        en: {
            title: 'Content Sections',
            subtitle: 'Choose which sections to include on your page',
            selectAll: 'Select All',
            clearAll: 'Clear All',
            selected: 'selected'
        },
        es: {
            title: 'Secciones de Contenido',
            subtitle: 'Elige qué secciones incluir en tu página',
            selectAll: 'Seleccionar Todo',
            clearAll: 'Limpiar Todo',
            selected: 'seleccionadas'
        }
    };

    const t = labels[lang];

    const toggleContent = (key: keyof ContentSections) => {
        updateContent({ [key]: !state.content[key] });
    };

    const selectAll = () => {
        const allTrue = contentOptions.reduce((acc, c) => ({ ...acc, [c.key]: true }), {});
        updateContent(allTrue);
    };

    const clearAll = () => {
        const allFalse = contentOptions.reduce((acc, c) => ({ ...acc, [c.key]: false }), {});
        updateContent(allFalse);
    };

    const selectedCount = Object.values(state.content).filter(Boolean).length;

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
                <div className="bulk-actions">
                    <span className="selection-count">{selectedCount} {t.selected}</span>
                    <button className="btn-small" onClick={selectAll}>{t.selectAll}</button>
                    <button className="btn-small secondary" onClick={clearAll}>{t.clearAll}</button>
                </div>
            </div>

            <div className="checkbox-grid">
                {contentOptions.map(content => (
                    <div
                        key={content.key}
                        className={`checkbox-card ${state.content[content.key] ? 'checked' : ''}`}
                        onClick={() => toggleContent(content.key)}
                    >
                        <div className="checkbox-indicator">
                            {state.content[content.key] ? '✓' : ''}
                        </div>
                        <span className="checkbox-icon">{content.icon}</span>
                        <span className="checkbox-name">{content.name[lang]}</span>
                        <span className="checkbox-desc">{content.desc[lang]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentStep;
