import React from 'react';
import { useWizard } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

const colorSchemes = [
    { id: 'ocean', name: 'Ocean Blue', colors: ['#0077B6', '#F5A623', '#00D4FF'] },
    { id: 'forest', name: 'Forest', colors: ['#2D5A27', '#8B4513', '#90EE90'] },
    { id: 'sunset', name: 'Sunset', colors: ['#FF6B6B', '#FFE66D', '#4ECDC4'] },
    { id: 'midnight', name: 'Midnight', colors: ['#1A1A2E', '#E94560', '#533483'] },
    { id: 'minimal', name: 'Minimal', colors: ['#2C3E50', '#ECF0F1', '#3498DB'] },
    { id: 'warm', name: 'Warm Earth', colors: ['#D4A373', '#CCD5AE', '#FAEDCD'] },
    { id: 'neon', name: 'Neon Nights', colors: ['#FF00FF', '#00FFFF', '#FFFF00'] },
    { id: 'custom', name: 'Custom', colors: ['#000000', '#888888', '#FFFFFF'] },
];

const fontPairings = [
    { id: 'inter-outfit', name: 'Inter + Outfit', sample: 'Modern & Clean' },
    { id: 'playfair-lato', name: 'Playfair + Lato', sample: 'Elegant & Classic' },
    { id: 'montserrat-opensans', name: 'Montserrat + Open Sans', sample: 'Bold & Friendly' },
    { id: 'poppins-roboto', name: 'Poppins + Roboto', sample: 'Tech & Professional' },
    { id: 'dmserif-dmsans', name: 'DM Serif + DM Sans', sample: 'Editorial & Modern' },
];

export const DesignStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateDesign } = useWizard();

    const labels = {
        en: {
            title: 'Design Choices',
            subtitle: 'Define the look and feel of your page',
            colorScheme: 'Color Scheme',
            fontPairing: 'Font Pairing',
            darkMode: 'Dark Mode',
            animations: 'Animation Level',
            borderRadius: 'Border Style',
            shadows: 'Shadow Style',
            animLevels: { none: 'None', subtle: 'Subtle', dynamic: 'Dynamic' },
            radiusLevels: { sharp: 'Sharp', rounded: 'Rounded', pill: 'Pill' },
            shadowLevels: { flat: 'Flat', soft: 'Soft', dramatic: 'Dramatic' }
        },
        es: {
            title: 'Opciones de Diseño',
            subtitle: 'Define el aspecto de tu página',
            colorScheme: 'Esquema de Colores',
            fontPairing: 'Combinación de Fuentes',
            darkMode: 'Modo Oscuro',
            animations: 'Nivel de Animación',
            borderRadius: 'Estilo de Bordes',
            shadows: 'Estilo de Sombras',
            animLevels: { none: 'Ninguno', subtle: 'Sutil', dynamic: 'Dinámico' },
            radiusLevels: { sharp: 'Recto', rounded: 'Redondeado', pill: 'Píldora' },
            shadowLevels: { flat: 'Plano', soft: 'Suave', dramatic: 'Dramático' }
        }
    };

    const t = labels[lang];

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            {/* Color Scheme */}
            <div className="form-group">
                <label>{t.colorScheme}</label>
                <div className="color-schemes">
                    {colorSchemes.map(scheme => (
                        <button
                            key={scheme.id}
                            className={`color-scheme-btn ${state.design.colorScheme === scheme.id ? 'selected' : ''}`}
                            onClick={() => updateDesign({ colorScheme: scheme.id })}
                        >
                            <div className="color-swatches">
                                {scheme.colors.map((color, i) => (
                                    <span key={i} className="swatch" style={{ background: color }} />
                                ))}
                            </div>
                            <span className="scheme-name">{scheme.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Pairing */}
            <div className="form-group">
                <label>{t.fontPairing}</label>
                <div className="font-pairings">
                    {fontPairings.map(font => (
                        <button
                            key={font.id}
                            className={`font-pairing-btn ${state.design.fontPairing === font.id ? 'selected' : ''}`}
                            onClick={() => updateDesign({ fontPairing: font.id })}
                        >
                            <span className="font-name">{font.name}</span>
                            <span className="font-sample">{font.sample}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Three Option Groups */}
            <div className="options-row">
                {/* Animation Level */}
                <div className="form-group compact">
                    <label>{t.animations}</label>
                    <div className="toggle-group">
                        {(['none', 'subtle', 'dynamic'] as const).map(level => (
                            <button
                                key={level}
                                className={`toggle-btn ${state.design.animationLevel === level ? 'active' : ''}`}
                                onClick={() => updateDesign({ animationLevel: level })}
                            >
                                {t.animLevels[level]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Border Radius */}
                <div className="form-group compact">
                    <label>{t.borderRadius}</label>
                    <div className="toggle-group">
                        {(['sharp', 'rounded', 'pill'] as const).map(radius => (
                            <button
                                key={radius}
                                className={`toggle-btn ${state.design.borderRadius === radius ? 'active' : ''}`}
                                onClick={() => updateDesign({ borderRadius: radius })}
                            >
                                {t.radiusLevels[radius]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shadow Style */}
                <div className="form-group compact">
                    <label>{t.shadows}</label>
                    <div className="toggle-group">
                        {(['flat', 'soft', 'dramatic'] as const).map(shadow => (
                            <button
                                key={shadow}
                                className={`toggle-btn ${state.design.shadowStyle === shadow ? 'active' : ''}`}
                                onClick={() => updateDesign({ shadowStyle: shadow })}
                            >
                                {t.shadowLevels[shadow]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="form-group checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={state.design.darkMode}
                        onChange={(e) => updateDesign({ darkMode: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    🌙 {t.darkMode}
                </label>
            </div>
        </div>
    );
};

export default DesignStep;
