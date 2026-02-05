import React from 'react';
import { useWizard } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

export const TechnicalStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateTechnical } = useWizard();

    const labels = {
        en: {
            title: 'Technical & SEO',
            subtitle: 'Configure meta tags and technical options',
            pageTitle: 'Page Title (SEO)',
            pageTitlePlaceholder: 'Your Business | Tagline',
            metaDescription: 'Meta Description',
            metaDescriptionPlaceholder: 'A brief description of your business for search engines (150-160 characters)',
            seoOptions: 'SEO & Technical Options',
            generateOgImage: 'Auto-generate Open Graph image for social sharing',
            includeRobots: 'Include robots.txt file',
            includeSitemap: 'Include sitemap.xml file',
            analyticsPlaceholder: 'Add Google Analytics placeholder',
            charCount: 'characters'
        },
        es: {
            title: 'Técnico y SEO',
            subtitle: 'Configura meta tags y opciones técnicas',
            pageTitle: 'Título de Página (SEO)',
            pageTitlePlaceholder: 'Tu Negocio | Eslogan',
            metaDescription: 'Meta Descripción',
            metaDescriptionPlaceholder: 'Una breve descripción de tu negocio para buscadores (150-160 caracteres)',
            seoOptions: 'Opciones SEO y Técnicas',
            generateOgImage: 'Auto-generar imagen Open Graph para redes sociales',
            includeRobots: 'Incluir archivo robots.txt',
            includeSitemap: 'Incluir archivo sitemap.xml',
            analyticsPlaceholder: 'Agregar placeholder de Google Analytics',
            charCount: 'caracteres'
        }
    };

    const t = labels[lang];
    const descLength = state.technical.metaDescription.length;

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            {/* Page Title */}
            <div className="form-group">
                <label>{t.pageTitle}</label>
                <input
                    type="text"
                    className="wizard-input"
                    value={state.technical.pageTitle}
                    onChange={(e) => updateTechnical({ pageTitle: e.target.value })}
                    placeholder={t.pageTitlePlaceholder}
                />
            </div>

            {/* Meta Description */}
            <div className="form-group">
                <label>
                    {t.metaDescription}
                    <span className={`char-count ${descLength > 160 ? 'over' : descLength > 140 ? 'close' : ''}`}>
                        {descLength}/160 {t.charCount}
                    </span>
                </label>
                <textarea
                    className="wizard-textarea"
                    value={state.technical.metaDescription}
                    onChange={(e) => updateTechnical({ metaDescription: e.target.value })}
                    placeholder={t.metaDescriptionPlaceholder}
                    rows={3}
                />
            </div>

            {/* SEO Options */}
            <div className="form-group">
                <label>{t.seoOptions}</label>
                <div className="checkbox-list">
                    <label className="checkbox-label-item">
                        <input
                            type="checkbox"
                            checked={state.technical.generateOgImage}
                            onChange={(e) => updateTechnical({ generateOgImage: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        🖼️ {t.generateOgImage}
                    </label>

                    <label className="checkbox-label-item">
                        <input
                            type="checkbox"
                            checked={state.technical.includeRobots}
                            onChange={(e) => updateTechnical({ includeRobots: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        🤖 {t.includeRobots}
                    </label>

                    <label className="checkbox-label-item">
                        <input
                            type="checkbox"
                            checked={state.technical.includeSitemap}
                            onChange={(e) => updateTechnical({ includeSitemap: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        🗺️ {t.includeSitemap}
                    </label>

                    <label className="checkbox-label-item">
                        <input
                            type="checkbox"
                            checked={state.technical.analyticsPlaceholder}
                            onChange={(e) => updateTechnical({ analyticsPlaceholder: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        📊 {t.analyticsPlaceholder}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TechnicalStep;
