import React from 'react';
import { useWizard } from '../WizardContext';

interface StepProps {
    lang: 'en' | 'es';
}

export const ContactStep: React.FC<StepProps> = ({ lang }) => {
    const { state, updateContact } = useWizard();

    const labels = {
        en: {
            title: 'Contact Information',
            subtitle: 'Enter your business contact details for the footer and contact page',
            email: 'Business Email',
            emailPlaceholder: 'contact@yourbusiness.com',
            phone: 'Primary Phone',
            phonePlaceholder: '+1 (555) 123-4567',
            phoneSecondary: 'Secondary Phone',
            phoneSecondaryPlaceholder: '+1 (555) 987-6543',
            address: 'Street Address',
            addressPlaceholder: '123 Business Street, Suite 100',
            city: 'City',
            cityPlaceholder: 'San Francisco',
            state: 'State/Province',
            statePlaceholder: 'California',
            zipCode: 'ZIP/Postal Code',
            zipCodePlaceholder: '94102',
            country: 'Country',
            countryPlaceholder: 'United States',
            businessHours: 'Business Hours',
            businessHoursPlaceholder: 'Mon-Fri: 9AM - 5PM',
            mapEmbed: 'Show Google Maps embed',
            mapUrl: 'Google Maps Embed URL',
            mapUrlPlaceholder: 'Paste your Google Maps embed URL here'
        },
        es: {
            title: 'Información de Contacto',
            subtitle: 'Ingresa los datos de contacto de tu negocio para el pie de página y página de contacto',
            email: 'Email Comercial',
            emailPlaceholder: 'contacto@tunegocio.com',
            phone: 'Teléfono Principal',
            phonePlaceholder: '+52 (55) 1234-5678',
            phoneSecondary: 'Teléfono Secundario',
            phoneSecondaryPlaceholder: '+52 (55) 9876-5432',
            address: 'Dirección',
            addressPlaceholder: 'Calle Ejemplo 123, Oficina 100',
            city: 'Ciudad',
            cityPlaceholder: 'Ciudad de México',
            state: 'Estado',
            statePlaceholder: 'CDMX',
            zipCode: 'Código Postal',
            zipCodePlaceholder: '06600',
            country: 'País',
            countryPlaceholder: 'México',
            businessHours: 'Horario de Atención',
            businessHoursPlaceholder: 'Lun-Vie: 9AM - 5PM',
            mapEmbed: 'Mostrar mapa de Google Maps',
            mapUrl: 'URL de Google Maps',
            mapUrlPlaceholder: 'Pega tu URL de inserción de Google Maps aquí'
        }
    };

    const t = labels[lang];

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            {/* Email & Phone Row */}
            <div className="form-row">
                <div className="form-group">
                    <label>📧 {t.email}</label>
                    <input
                        type="email"
                        className="wizard-input"
                        value={state.contact.email}
                        onChange={(e) => updateContact({ email: e.target.value })}
                        placeholder={t.emailPlaceholder}
                    />
                </div>
                <div className="form-group">
                    <label>📞 {t.phone}</label>
                    <input
                        type="tel"
                        className="wizard-input"
                        value={state.contact.phone}
                        onChange={(e) => updateContact({ phone: e.target.value })}
                        placeholder={t.phonePlaceholder}
                    />
                </div>
            </div>

            {/* Secondary Phone */}
            <div className="form-group">
                <label>📱 {t.phoneSecondary}</label>
                <input
                    type="tel"
                    className="wizard-input"
                    value={state.contact.phoneSecondary}
                    onChange={(e) => updateContact({ phoneSecondary: e.target.value })}
                    placeholder={t.phoneSecondaryPlaceholder}
                />
            </div>

            {/* Address */}
            <div className="form-group">
                <label>🏢 {t.address}</label>
                <input
                    type="text"
                    className="wizard-input"
                    value={state.contact.address}
                    onChange={(e) => updateContact({ address: e.target.value })}
                    placeholder={t.addressPlaceholder}
                />
            </div>

            {/* City, State, ZIP Row */}
            <div className="form-row three-col">
                <div className="form-group">
                    <label>{t.city}</label>
                    <input
                        type="text"
                        className="wizard-input"
                        value={state.contact.city}
                        onChange={(e) => updateContact({ city: e.target.value })}
                        placeholder={t.cityPlaceholder}
                    />
                </div>
                <div className="form-group">
                    <label>{t.state}</label>
                    <input
                        type="text"
                        className="wizard-input"
                        value={state.contact.state}
                        onChange={(e) => updateContact({ state: e.target.value })}
                        placeholder={t.statePlaceholder}
                    />
                </div>
                <div className="form-group">
                    <label>{t.zipCode}</label>
                    <input
                        type="text"
                        className="wizard-input"
                        value={state.contact.zipCode}
                        onChange={(e) => updateContact({ zipCode: e.target.value })}
                        placeholder={t.zipCodePlaceholder}
                    />
                </div>
            </div>

            {/* Country */}
            <div className="form-group">
                <label>🌍 {t.country}</label>
                <input
                    type="text"
                    className="wizard-input"
                    value={state.contact.country}
                    onChange={(e) => updateContact({ country: e.target.value })}
                    placeholder={t.countryPlaceholder}
                />
            </div>

            {/* Business Hours */}
            <div className="form-group">
                <label>🕐 {t.businessHours}</label>
                <input
                    type="text"
                    className="wizard-input"
                    value={state.contact.businessHours}
                    onChange={(e) => updateContact({ businessHours: e.target.value })}
                    placeholder={t.businessHoursPlaceholder}
                />
            </div>

            {/* Map Embed */}
            <div className="form-group checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={state.contact.showMapEmbed}
                        onChange={(e) => updateContact({ showMapEmbed: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    🗺️ {t.mapEmbed}
                </label>
            </div>

            {state.contact.showMapEmbed && (
                <div className="form-group">
                    <label>{t.mapUrl}</label>
                    <input
                        type="text"
                        className="wizard-input"
                        value={state.contact.mapEmbedUrl}
                        onChange={(e) => updateContact({ mapEmbedUrl: e.target.value })}
                        placeholder={t.mapUrlPlaceholder}
                    />
                </div>
            )}
        </div>
    );
};

export default ContactStep;
