import React from 'react';
import { useWizard } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

export const MediaStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateMedia } = useWizard();

    const labels = {
        en: {
            title: 'Media & Images',
            subtitle: 'Configure visual elements for your page',
            heroImage: 'Hero Image',
            uploadImage: 'Upload Image',
            generateImage: 'Generate with AI',
            imagePrompt: 'Describe the image you want...',
            backgroundPattern: 'Background Pattern',
            sectionDividers: 'Section Dividers',
            iconStyle: 'Icon Style',
            patterns: { none: 'None', dots: 'Dots', grid: 'Grid', gradient: 'Gradient' },
            dividers: { none: 'None', waves: 'Waves', angles: 'Angles', curves: 'Curves' },
            icons: { outline: 'Outline', solid: 'Solid', duotone: 'Duotone' }
        },
        es: {
            title: 'Medios e Imágenes',
            subtitle: 'Configura los elementos visuales de tu página',
            heroImage: 'Imagen Principal',
            uploadImage: 'Subir Imagen',
            generateImage: 'Generar con IA',
            imagePrompt: 'Describe la imagen que quieres...',
            backgroundPattern: 'Patrón de Fondo',
            sectionDividers: 'Divisores de Sección',
            iconStyle: 'Estilo de Iconos',
            patterns: { none: 'Ninguno', dots: 'Puntos', grid: 'Cuadrícula', gradient: 'Degradado' },
            dividers: { none: 'Ninguno', waves: 'Ondas', angles: 'Ángulos', curves: 'Curvas' },
            icons: { outline: 'Contorno', solid: 'Sólido', duotone: 'Duotono' }
        }
    };

    const t = labels[lang];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateMedia({ heroImage: event.target?.result as string });
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

            {/* Hero Image */}
            <div className="form-group">
                <label>{t.heroImage}</label>
                {state.media.heroImage ? (
                    <div className="image-preview">
                        <img src={state.media.heroImage} alt="Hero preview" />
                        <button
                            className="btn-remove"
                            onClick={() => updateMedia({ heroImage: null })}
                        >
                            ✕ Remove
                        </button>
                    </div>
                ) : (
                    <div className="image-options">
                        <label className="btn-upload-large">
                            📁 {t.uploadImage}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                hidden
                            />
                        </label>
                        <div className="ai-generate-section">
                            <button
                                className="btn-generate-large"
                                onClick={() => updateMedia({ generateHeroImage: true })}
                            >
                                ✨ {t.generateImage}
                            </button>
                            {state.media.generateHeroImage && (
                                <input
                                    type="text"
                                    className="wizard-input"
                                    placeholder={t.imagePrompt}
                                    value={state.media.heroImagePrompt}
                                    onChange={(e) => updateMedia({ heroImagePrompt: e.target.value })}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Background Pattern */}
            <div className="form-group">
                <label>{t.backgroundPattern}</label>
                <div className="toggle-group wide">
                    {(['none', 'dots', 'grid', 'gradient'] as const).map(pattern => (
                        <button
                            key={pattern}
                            className={`toggle-btn ${state.media.backgroundPattern === pattern ? 'active' : ''}`}
                            onClick={() => updateMedia({ backgroundPattern: pattern })}
                        >
                            <span className={`pattern-icon pattern-${pattern}`}></span>
                            {t.patterns[pattern]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Dividers */}
            <div className="form-group">
                <label>{t.sectionDividers}</label>
                <div className="toggle-group wide">
                    {(['none', 'waves', 'angles', 'curves'] as const).map(divider => (
                        <button
                            key={divider}
                            className={`toggle-btn ${state.media.sectionDividers === divider ? 'active' : ''}`}
                            onClick={() => updateMedia({ sectionDividers: divider })}
                        >
                            <span className={`divider-icon divider-${divider}`}></span>
                            {t.dividers[divider]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Icon Style */}
            <div className="form-group">
                <label>{t.iconStyle}</label>
                <div className="toggle-group">
                    {(['outline', 'solid', 'duotone'] as const).map(iconStyle => (
                        <button
                            key={iconStyle}
                            className={`toggle-btn ${state.media.iconStyle === iconStyle ? 'active' : ''}`}
                            onClick={() => updateMedia({ iconStyle: iconStyle })}
                        >
                            {t.icons[iconStyle]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MediaStep;
