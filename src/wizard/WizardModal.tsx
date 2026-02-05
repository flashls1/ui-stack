import React from 'react';
import { useWizard, wizardSteps, WizardStep } from './WizardContext';
import { BusinessStep } from './steps/BusinessStep';
import { PagesStep } from './steps/PagesStep';
import { ContactStep } from './steps/ContactStep';
import { StructureStep } from './steps/StructureStep';
import { FeaturesStep } from './steps/FeaturesStep';
import { ContentStep } from './steps/ContentStep';
import { DesignStep } from './steps/DesignStep';
import { MediaStep } from './steps/MediaStep';
import { SocialStep } from './steps/SocialStep';
import { TechnicalStep } from './steps/TechnicalStep';

interface WizardModalProps {
    lang: 'en' | 'es';
}

export const WizardModal: React.FC<WizardModalProps> = ({ lang }) => {
    const { state, closeWizard, setCurrentStep, nextStep, prevStep, toggleVoiceMode } = useWizard();

    if (!state.isWizardOpen) return null;

    const currentStepIndex = wizardSteps.findIndex(s => s.id === state.currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === wizardSteps.length - 1;

    const renderStep = () => {
        switch (state.currentStep) {
            case 'business': return <BusinessStep lang={lang} />;
            case 'pages': return <PagesStep lang={lang} />;
            case 'contact': return <ContactStep lang={lang} />;
            case 'structure': return <StructureStep lang={lang} />;
            case 'features': return <FeaturesStep lang={lang} />;
            case 'content': return <ContentStep lang={lang} />;
            case 'design': return <DesignStep lang={lang} />;
            case 'media': return <MediaStep lang={lang} />;
            case 'social': return <SocialStep lang={lang} />;
            case 'technical': return <TechnicalStep lang={lang} />;
            default: return null;
        }
    };

    const stepLabels = {
        en: {
            back: 'Back',
            next: 'Next',
            finish: 'Generate Site',
            close: 'Cancel',
            voice: 'Voice Mode',
            voiceActive: 'Voice Active'
        },
        es: {
            back: 'Atrás',
            next: 'Siguiente',
            finish: 'Generar Sitio',
            close: 'Cancelar',
            voice: 'Modo Voz',
            voiceActive: 'Voz Activa'
        }
    };

    const t = stepLabels[lang];

    return (
        <div className="wizard-overlay" onClick={(e) => e.target === e.currentTarget && closeWizard()}>
            <div className="wizard-modal wide">
                {/* Header */}
                <header className="wizard-header">
                    <h1>🧙 {lang === 'es' ? 'Asistente de Diseño' : 'Design Wizard'}</h1>
                    <div className="wizard-header-actions">
                        <button
                            className={`btn-voice-mode ${state.isVoiceMode ? 'active' : ''}`}
                            onClick={toggleVoiceMode}
                        >
                            🎤 {state.isVoiceMode ? t.voiceActive : t.voice}
                        </button>
                        <button className="wizard-close" onClick={closeWizard}>✕</button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="wizard-body">
                    {/* Step Navigation - Now scrollable for more steps */}
                    <aside className="wizard-steps">
                        {wizardSteps.map((step, index) => {
                            const isActive = step.id === state.currentStep;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <button
                                    key={step.id}
                                    className={`wizard-step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                    onClick={() => setCurrentStep(step.id)}
                                >
                                    <span className="step-number">{isCompleted ? '✓' : index + 1}</span>
                                    <span className="step-icon">{step.icon}</span>
                                    <span className="step-name">{lang === 'es' ? step.nameEs : step.name}</span>
                                </button>
                            );
                        })}
                    </aside>

                    {/* Step Content */}
                    <main className="wizard-content">
                        {renderStep()}
                    </main>

                    {/* Live Preview */}
                    <aside className="wizard-preview">
                        <div className="preview-frame">
                            <div className="preview-header">
                                <span className="preview-dot"></span>
                                <span className="preview-dot"></span>
                                <span className="preview-dot"></span>
                            </div>
                            <div className="preview-screen">
                                <div className="preview-nav">
                                    {state.business.logo ? (
                                        <img src={state.business.logo} alt="" className="preview-logo" />
                                    ) : (
                                        <div className="preview-logo-placeholder">Logo</div>
                                    )}
                                    <span className="preview-brand">{state.business.name || 'Your Brand'}</span>
                                    <div className="preview-nav-links">
                                        {state.pages.selectedPages.slice(0, 4).map(pageId => (
                                            <span key={pageId} className="preview-nav-link">{pageId}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="preview-hero">
                                    <h2>{state.business.name || 'Business Name'}</h2>
                                    <p>{state.business.tagline || 'Your tagline here'}</p>
                                    <button className="preview-cta">Get Started</button>
                                </div>
                                {state.content.about && <div className="preview-section about">About</div>}
                                {state.content.services && <div className="preview-section services">Services</div>}
                                {state.content.testimonials && <div className="preview-section testimonials">Testimonials</div>}
                                {state.content.pricing && <div className="preview-section pricing">Pricing</div>}
                                {state.content.faq && <div className="preview-section faq">FAQ</div>}
                                {state.content.cta && <div className="preview-section cta">CTA</div>}
                                <div className="preview-footer">
                                    <div className="preview-footer-content">
                                        {state.contact.email && <span>📧 {state.contact.email}</span>}
                                        {state.contact.phone && <span>📞 {state.contact.phone}</span>}
                                    </div>
                                    <span>Footer</span>
                                </div>
                            </div>
                        </div>
                        <div className="preview-info">
                            <span className="pages-count">📄 {state.pages.selectedPages.length} pages</span>
                            {state.pages.mobileFirst && <span className="mobile-badge">📱 Mobile-first</span>}
                        </div>
                    </aside>
                </div>

                {/* Footer Navigation */}
                <footer className="wizard-footer">
                    <button
                        className="btn-wizard-secondary"
                        onClick={closeWizard}
                    >
                        {t.close}
                    </button>
                    <div className="wizard-progress">
                        <span className="progress-text">
                            Step {currentStepIndex + 1} of {wizardSteps.length}
                        </span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentStepIndex + 1) / wizardSteps.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="wizard-nav-buttons">
                        <button
                            className="btn-wizard-secondary"
                            onClick={prevStep}
                            disabled={isFirstStep}
                        >
                            ← {t.back}
                        </button>
                        <button
                            className="btn-wizard-primary"
                            onClick={isLastStep ? () => { /* TODO: Generate */ closeWizard(); } : nextStep}
                        >
                            {isLastStep ? `✨ ${t.finish}` : `${t.next} →`}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WizardModal;
