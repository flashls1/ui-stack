import React from 'react';
import { useWizard, SocialLinks } from '../WizardContext';
import { socialPlatforms } from '../../assets/icons';

interface StepProps {
    lang: 'en' | 'es';
}

export const SocialStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateSocial } = useWizard();

    const labels = {
        en: {
            title: 'Social Media Links',
            subtitle: 'Enter your social media profile URLs to display in the footer and header',
            placeholder: 'Enter your profile URL',
            optional: 'Leave blank to hide'
        },
        es: {
            title: 'Redes Sociales',
            subtitle: 'Ingresa las URLs de tus perfiles para mostrar en el pie de página y encabezado',
            placeholder: 'Ingresa la URL de tu perfil',
            optional: 'Deja en blanco para ocultar'
        }
    };

    const t = labels[lang];

    const getSocialIcon = (id: string) => {
        const icons: Record<string, string> = {
            facebook: '📘',
            twitter: '🐦',
            instagram: '📷',
            linkedin: '💼',
            youtube: '▶️',
            tiktok: '🎵',
            pinterest: '📌',
            github: '💻',
            discord: '🎮',
            whatsapp: '💬',
            telegram: '✈️',
            snapchat: '👻'
        };
        return icons[id] || '🔗';
    };

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
                <span className="help-text">{t.optional}</span>
            </div>

            <div className="social-grid">
                {socialPlatforms.map(platform => (
                    <div key={platform.id} className="social-input-group">
                        <label className="social-label">
                            <span
                                className="social-icon-dot"
                                style={{ backgroundColor: platform.color }}
                            />
                            {getSocialIcon(platform.id)} {platform.name}
                        </label>
                        <input
                            type="url"
                            className="wizard-input"
                            value={state.social[platform.id as keyof SocialLinks] || ''}
                            onChange={(e) => updateSocial({ [platform.id]: e.target.value })}
                            placeholder={`https://${platform.id}.com/yourprofile`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialStep;
