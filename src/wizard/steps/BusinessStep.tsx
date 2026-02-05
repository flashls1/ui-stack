import React from 'react';
import { useWizard } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

export const BusinessStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateBusiness } = useWizard();

    const labels = {
        en: {
            title: 'Business Identity',
            subtitle: 'Tell us about your business',
            name: 'Business Name',
            namePlaceholder: 'Enter your business name',
            tagline: 'Tagline / Slogan',
            taglinePlaceholder: 'A catchy phrase that describes what you do',
            browserTitle: 'Browser Tab Title',
            browserTitlePlaceholder: 'What shows in the browser tab',
            logo: 'Logo',
            uploadLogo: 'Upload Logo',
            generateLogo: 'Generate with AI',
            faviconFromLogo: 'Auto-generate favicon from logo'
        },
        es: {
            title: 'Identidad del Negocio',
            subtitle: 'Cuéntanos sobre tu negocio',
            name: 'Nombre del Negocio',
            namePlaceholder: 'Ingresa el nombre de tu negocio',
            tagline: 'Eslogan',
            taglinePlaceholder: 'Una frase que describa lo que haces',
            browserTitle: 'Título de Pestaña',
            browserTitlePlaceholder: 'Lo que aparece en la pestaña del navegador',
            logo: 'Logo',
            uploadLogo: 'Subir Logo',
            generateLogo: 'Generar con IA',
            faviconFromLogo: 'Generar favicon del logo automáticamente'
        }
    };

    const t = labels[lang];

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateBusiness({ logo: event.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            <div className="form-group">
                <label>{t.name}</label>
                <input
                    type="text"
                    value={state.business.name}
                    onChange={(e) => updateBusiness({ name: e.target.value })}
                    placeholder={t.namePlaceholder}
                    className="wizard-input"
                />
            </div>

            <div className="form-group">
                <label>{t.tagline}</label>
                <input
                    type="text"
                    value={state.business.tagline}
                    onChange={(e) => updateBusiness({ tagline: e.target.value })}
                    placeholder={t.taglinePlaceholder}
                    className="wizard-input"
                />
            </div>

            <div className="form-group">
                <label>{t.browserTitle}</label>
                <input
                    type="text"
                    value={state.business.browserTitle}
                    onChange={(e) => updateBusiness({ browserTitle: e.target.value })}
                    placeholder={t.browserTitlePlaceholder}
                    className="wizard-input"
                />
            </div>

            <div className="form-group">
                <label>{t.logo}</label>
                <div className="logo-options">
                    {state.business.logo ? (
                        <div className="logo-preview">
                            <img src={state.business.logo} alt="Logo preview" />
                            <button
                                className="btn-remove-logo"
                                onClick={() => updateBusiness({ logo: null })}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <>
                            <label className="btn-upload">
                                📁 {t.uploadLogo}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    hidden
                                />
                            </label>
                            <button
                                className="btn-generate"
                                onClick={() => updateBusiness({ generateLogo: true })}
                            >
                                ✨ {t.generateLogo}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="form-group checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={state.business.faviconFromLogo}
                        onChange={(e) => updateBusiness({ faviconFromLogo: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    {t.faviconFromLogo}
                </label>
            </div>
        </div>
    );
};

export default BusinessStep;
