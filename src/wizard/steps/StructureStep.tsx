import React from 'react';
import { useWizard } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

export const StructureStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateStructure } = useWizard();

    const labels = {
        en: {
            title: 'Page Structure',
            subtitle: 'Choose the layout of your page',
            navStyle: 'Navigation Style',
            heroType: 'Hero Section Type',
            footerStyle: 'Footer Style',
            nav: {
                sticky: { name: 'Sticky', desc: 'Stays at top when scrolling' },
                minimal: { name: 'Minimal', desc: 'Simple, clean navigation' },
                mega: { name: 'Mega Menu', desc: 'Large dropdown menus' }
            },
            hero: {
                centered: { name: 'Centered', desc: 'Text centered with CTA' },
                split: { name: 'Split', desc: 'Text left, image right' },
                video: { name: 'Video', desc: 'Video background' }
            },
            footer: {
                simple: { name: 'Simple', desc: 'Just logo and copyright' },
                detailed: { name: 'Detailed', desc: 'Links and contact info' },
                multicolumn: { name: 'Multi-column', desc: 'Full navigation footer' }
            }
        },
        es: {
            title: 'Estructura de Página',
            subtitle: 'Elige el diseño de tu página',
            navStyle: 'Estilo de Navegación',
            heroType: 'Tipo de Sección Hero',
            footerStyle: 'Estilo de Pie de Página',
            nav: {
                sticky: { name: 'Fijo', desc: 'Se mantiene al hacer scroll' },
                minimal: { name: 'Mínimo', desc: 'Navegación simple y limpia' },
                mega: { name: 'Mega Menú', desc: 'Menús desplegables grandes' }
            },
            hero: {
                centered: { name: 'Centrado', desc: 'Texto centrado con CTA' },
                split: { name: 'Dividido', desc: 'Texto izquierda, imagen derecha' },
                video: { name: 'Video', desc: 'Fondo de video' }
            },
            footer: {
                simple: { name: 'Simple', desc: 'Solo logo y copyright' },
                detailed: { name: 'Detallado', desc: 'Enlaces e información' },
                multicolumn: { name: 'Multi-columna', desc: 'Navegación completa' }
            }
        }
    };

    const t = labels[lang];

    type NavStyle = 'sticky' | 'minimal' | 'mega';
    type HeroType = 'centered' | 'split' | 'video';
    type FooterStyle = 'simple' | 'detailed' | 'multicolumn';

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            <div className="form-group">
                <label>{t.navStyle}</label>
                <div className="option-cards">
                    {(['sticky', 'minimal', 'mega'] as NavStyle[]).map(style => (
                        <button
                            key={style}
                            className={`option-card ${state.structure.navStyle === style ? 'selected' : ''}`}
                            onClick={() => updateStructure({ navStyle: style })}
                        >
                            <span className="option-icon">
                                {style === 'sticky' ? '📌' : style === 'minimal' ? '➖' : '📊'}
                            </span>
                            <span className="option-name">{t.nav[style].name}</span>
                            <span className="option-desc">{t.nav[style].desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>{t.heroType}</label>
                <div className="option-cards">
                    {(['centered', 'split', 'video'] as HeroType[]).map(type => (
                        <button
                            key={type}
                            className={`option-card ${state.structure.heroType === type ? 'selected' : ''}`}
                            onClick={() => updateStructure({ heroType: type })}
                        >
                            <span className="option-icon">
                                {type === 'centered' ? '⬜' : type === 'split' ? '◧' : '▶️'}
                            </span>
                            <span className="option-name">{t.hero[type].name}</span>
                            <span className="option-desc">{t.hero[type].desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>{t.footerStyle}</label>
                <div className="option-cards">
                    {(['simple', 'detailed', 'multicolumn'] as FooterStyle[]).map(style => (
                        <button
                            key={style}
                            className={`option-card ${state.structure.footerStyle === style ? 'selected' : ''}`}
                            onClick={() => updateStructure({ footerStyle: style })}
                        >
                            <span className="option-icon">
                                {style === 'simple' ? '▁' : style === 'detailed' ? '▃' : '▅'}
                            </span>
                            <span className="option-name">{t.footer[style].name}</span>
                            <span className="option-desc">{t.footer[style].desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StructureStep;
