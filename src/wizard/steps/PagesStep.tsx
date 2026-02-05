import React, { useState } from 'react';
import { useWizard } from '../WizardContext';
import { commonPages } from '../../assets/icons';

interface StepProps {
    lang: 'en' | 'es';
}

export const PagesStep: React.FC<StepProps> = ({ lang }) => {
    const { state, togglePage, addCustomPage, removeCustomPage, updatePages } = useWizard();
    const [customPageName, setCustomPageName] = useState('');

    const labels = {
        en: {
            title: 'Pages & Structure',
            subtitle: 'Select which pages you want to include in your site',
            mobileFirst: 'Mobile-First Design',
            mobileFirstDesc: 'Optimize for mobile devices first, then scale up',
            responsive: 'Responsive Breakpoints',
            responsiveDesc: 'Include tablet and desktop breakpoint styles',
            addCustom: 'Add Custom Page',
            customPlaceholder: 'Page name...',
            add: 'Add',
            selected: 'pages selected',
            required: 'Required'
        },
        es: {
            title: 'Páginas y Estructura',
            subtitle: 'Selecciona las páginas que quieres incluir en tu sitio',
            mobileFirst: 'Diseño Mobile-First',
            mobileFirstDesc: 'Optimiza para móviles primero, luego escala',
            responsive: 'Breakpoints Responsivos',
            responsiveDesc: 'Incluir estilos para tablet y desktop',
            addCustom: 'Agregar Página Personalizada',
            customPlaceholder: 'Nombre de página...',
            add: 'Agregar',
            selected: 'páginas seleccionadas',
            required: 'Requerido'
        }
    };

    const t = labels[lang];

    const handleAddCustomPage = () => {
        if (customPageName.trim()) {
            addCustomPage(customPageName.trim());
            setCustomPageName('');
        }
    };

    return (
        <div className="wizard-step-content wide">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
                <span className="selection-count">
                    {state.pages.selectedPages.length} {t.selected}
                </span>
            </div>

            {/* Mobile-First Options */}
            <div className="options-row compact">
                <div className="toggle-option">
                    <label className="checkbox-label-inline">
                        <input
                            type="checkbox"
                            checked={state.pages.mobileFirst}
                            onChange={(e) => updatePages({ mobileFirst: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        <div className="option-text">
                            <span className="option-title">📱 {t.mobileFirst}</span>
                            <span className="option-subtitle">{t.mobileFirstDesc}</span>
                        </div>
                    </label>
                </div>
                <div className="toggle-option">
                    <label className="checkbox-label-inline">
                        <input
                            type="checkbox"
                            checked={state.pages.responsiveBreakpoints}
                            onChange={(e) => updatePages({ responsiveBreakpoints: e.target.checked })}
                        />
                        <span className="checkmark"></span>
                        <div className="option-text">
                            <span className="option-title">🖥️ {t.responsive}</span>
                            <span className="option-subtitle">{t.responsiveDesc}</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Page Grid */}
            <div className="page-grid">
                {commonPages.map(page => {
                    const isSelected = state.pages.selectedPages.includes(page.id);
                    const isRequired = page.required;

                    return (
                        <div
                            key={page.id}
                            className={`page-card ${isSelected ? 'selected' : ''} ${isRequired ? 'required' : ''}`}
                            onClick={() => !isRequired && togglePage(page.id)}
                        >
                            <div className="page-icon">{page.icon}</div>
                            <div className="page-name">{lang === 'es' ? page.nameEs : page.name}</div>
                            {isRequired && <span className="required-badge">{t.required}</span>}
                            {!isRequired && (
                                <div className="page-checkbox">
                                    {isSelected ? '✓' : ''}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Custom Pages */}
                {state.pages.customPages.map(page => (
                    <div
                        key={page.id}
                        className="page-card selected custom"
                    >
                        <div className="page-icon">📝</div>
                        <div className="page-name">{page.name}</div>
                        <button
                            className="remove-page"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeCustomPage(page.id);
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Custom Page */}
            <div className="add-custom-section">
                <label>{t.addCustom}</label>
                <div className="add-custom-row">
                    <input
                        type="text"
                        className="wizard-input"
                        placeholder={t.customPlaceholder}
                        value={customPageName}
                        onChange={(e) => setCustomPageName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomPage()}
                    />
                    <button
                        className="btn-add"
                        onClick={handleAddCustomPage}
                        disabled={!customPageName.trim()}
                    >
                        + {t.add}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PagesStep;
