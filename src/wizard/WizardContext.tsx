import React, { createContext, useContext, useState, ReactNode } from 'react';

// Design Levels
export type DesignLevel = 'simple' | 'professional' | 'premium' | 'insane';

export const designLevels: Record<DesignLevel, { name: string; nameEs: string; icon: string; description: string }> = {
    simple: {
        name: 'Simple',
        nameEs: 'Simple',
        icon: '○',
        description: 'Clean & minimal'
    },
    professional: {
        name: 'Professional',
        nameEs: 'Profesional',
        icon: '◐',
        description: 'Standard sections'
    },
    premium: {
        name: 'Premium',
        nameEs: 'Premium',
        icon: '◉',
        description: 'Rich features'
    },
    insane: {
        name: 'INSANE',
        nameEs: 'INSANE',
        icon: '★',
        description: 'Everything + AI'
    }
};

// Wizard Steps - Now with Pages and Contact steps
export type WizardStep =
    | 'business'
    | 'pages'
    | 'contact'
    | 'structure'
    | 'features'
    | 'content'
    | 'design'
    | 'media'
    | 'social'
    | 'technical';

export const wizardSteps: { id: WizardStep; name: string; nameEs: string; icon: string }[] = [
    { id: 'business', name: 'Business', nameEs: 'Negocio', icon: '🏢' },
    { id: 'pages', name: 'Pages', nameEs: 'Páginas', icon: '📄' },
    { id: 'contact', name: 'Contact', nameEs: 'Contacto', icon: '📞' },
    { id: 'structure', name: 'Structure', nameEs: 'Estructura', icon: '🏗️' },
    { id: 'features', name: 'Features', nameEs: 'Funciones', icon: '⚡' },
    { id: 'content', name: 'Content', nameEs: 'Contenido', icon: '📝' },
    { id: 'design', name: 'Design', nameEs: 'Diseño', icon: '🎨' },
    { id: 'media', name: 'Media', nameEs: 'Medios', icon: '🖼️' },
    { id: 'social', name: 'Social', nameEs: 'Redes', icon: '🔗' },
    { id: 'technical', name: 'Technical', nameEs: 'Técnico', icon: '⚙️' }
];

// Business Info
export interface BusinessInfo {
    name: string;
    tagline: string;
    logo: string | null;
    generateLogo: boolean;
    faviconFromLogo: boolean;
    browserTitle: string;
    industry: string;
}

// Page Selection
export interface PageInfo {
    id: string;
    name: string;
    enabled: boolean;
    customName?: string;
}

export interface PagesConfig {
    selectedPages: string[];
    customPages: { id: string; name: string }[];
    mobileFirst: boolean;
    responsiveBreakpoints: boolean;
}

// Contact Details
export interface ContactInfo {
    email: string;
    phone: string;
    phoneSecondary: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    businessHours: string;
    showMapEmbed: boolean;
    mapEmbedUrl: string;
}

// Page Structure
export interface PageStructure {
    navStyle: 'sticky' | 'minimal' | 'mega' | 'hamburger';
    heroType: 'centered' | 'split' | 'video' | 'slideshow' | 'animated';
    footerStyle: 'simple' | 'detailed' | 'multicolumn';
    showBreadcrumbs: boolean;
}

// Features (checkboxes)
export interface Features {
    authentication: boolean;
    socialLinks: boolean;
    contactForm: boolean;
    newsletter: boolean;
    chatWidget: boolean;
    cookieConsent: boolean;
    backToTop: boolean;
    darkModeToggle: boolean;
    searchBar: boolean;
    multiLanguage: boolean;
    accessibilityWidget: boolean;
    liveChat: boolean;
    bookingCalendar: boolean;
    priceCalculator: boolean;
}

// Content Sections (checkboxes)
export interface ContentSections {
    about: boolean;
    services: boolean;
    testimonials: boolean;
    team: boolean;
    pricing: boolean;
    faq: boolean;
    portfolio: boolean;
    blog: boolean;
    stats: boolean;
    partners: boolean;
    cta: boolean;
    timeline: boolean;
    features: boolean;
    comparison: boolean;
    video: boolean;
    awards: boolean;
}

// Design Choices
export interface DesignChoices {
    colorScheme: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontPairing: string;
    darkMode: boolean;
    animationLevel: 'none' | 'subtle' | 'dynamic' | 'extreme';
    borderRadius: 'sharp' | 'rounded' | 'pill';
    shadowStyle: 'flat' | 'soft' | 'dramatic' | 'neon';
    glassmorphism: boolean;
    gradientButtons: boolean;
}

// Media Options
export interface MediaOptions {
    heroImage: string | null;
    generateHeroImage: boolean;
    heroImagePrompt: string;
    backgroundPattern: 'none' | 'dots' | 'grid' | 'gradient' | 'waves' | 'geometric';
    sectionDividers: 'none' | 'waves' | 'angles' | 'curves' | 'mountains';
    iconStyle: 'outline' | 'solid' | 'duotone' | 'gradient';
    imageStyle: 'rounded' | 'circle' | 'square' | 'blob';
}

// Social Media Links
export interface SocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    pinterest: string;
    github: string;
    discord: string;
    whatsapp: string;
    telegram: string;
    snapchat: string;
}

// Technical/SEO
export interface TechnicalOptions {
    pageTitle: string;
    metaDescription: string;
    generateOgImage: boolean;
    includeRobots: boolean;
    includeSitemap: boolean;
    analyticsPlaceholder: boolean;
    structuredData: boolean;
    lazyLoading: boolean;
    minifyAssets: boolean;
    pwaSupport: boolean;
}

// Voice AI Configuration
export interface VoiceAIConfig {
    enabled: boolean;
    agentId: string;
    welcomeMessage: string;
    voiceType: 'male' | 'female' | 'neutral';
}

// Complete Wizard State
export interface WizardState {
    designLevel: DesignLevel;
    currentStep: WizardStep;
    isWizardOpen: boolean;
    isVoiceMode: boolean;
    business: BusinessInfo;
    pages: PagesConfig;
    contact: ContactInfo;
    structure: PageStructure;
    features: Features;
    content: ContentSections;
    design: DesignChoices;
    media: MediaOptions;
    social: SocialLinks;
    technical: TechnicalOptions;
    voiceAI: VoiceAIConfig;
}

// Initial State
const initialState: WizardState = {
    designLevel: 'professional',
    currentStep: 'business',
    isWizardOpen: false,
    isVoiceMode: false,
    business: {
        name: '',
        tagline: '',
        logo: null,
        generateLogo: false,
        faviconFromLogo: true,
        browserTitle: '',
        industry: ''
    },
    pages: {
        selectedPages: ['home', 'about', 'contact'],
        customPages: [],
        mobileFirst: true,
        responsiveBreakpoints: true
    },
    contact: {
        email: '',
        phone: '',
        phoneSecondary: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        businessHours: '',
        showMapEmbed: false,
        mapEmbedUrl: ''
    },
    structure: {
        navStyle: 'sticky',
        heroType: 'centered',
        footerStyle: 'simple',
        showBreadcrumbs: false
    },
    features: {
        authentication: false,
        socialLinks: true,
        contactForm: true,
        newsletter: false,
        chatWidget: false,
        cookieConsent: true,
        backToTop: true,
        darkModeToggle: false,
        searchBar: false,
        multiLanguage: false,
        accessibilityWidget: false,
        liveChat: false,
        bookingCalendar: false,
        priceCalculator: false
    },
    content: {
        about: true,
        services: true,
        testimonials: false,
        team: false,
        pricing: false,
        faq: false,
        portfolio: false,
        blog: false,
        stats: false,
        partners: false,
        cta: true,
        timeline: false,
        features: false,
        comparison: false,
        video: false,
        awards: false
    },
    design: {
        colorScheme: 'ocean',
        primaryColor: '#0077B6',
        secondaryColor: '#F5A623',
        accentColor: '#00D4FF',
        fontPairing: 'inter-outfit',
        darkMode: true,
        animationLevel: 'subtle',
        borderRadius: 'rounded',
        shadowStyle: 'soft',
        glassmorphism: false,
        gradientButtons: true
    },
    media: {
        heroImage: null,
        generateHeroImage: false,
        heroImagePrompt: '',
        backgroundPattern: 'none',
        sectionDividers: 'waves',
        iconStyle: 'outline',
        imageStyle: 'rounded'
    },
    social: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
        pinterest: '',
        github: '',
        discord: '',
        whatsapp: '',
        telegram: '',
        snapchat: ''
    },
    technical: {
        pageTitle: '',
        metaDescription: '',
        generateOgImage: true,
        includeRobots: true,
        includeSitemap: true,
        analyticsPlaceholder: true,
        structuredData: true,
        lazyLoading: true,
        minifyAssets: true,
        pwaSupport: false
    },
    voiceAI: {
        enabled: false,
        agentId: '',
        welcomeMessage: 'Hi! I\'m your AI design assistant. Let\'s build your perfect website together.',
        voiceType: 'female'
    }
};

// Context Type
interface WizardContextType {
    state: WizardState;
    setDesignLevel: (level: DesignLevel) => void;
    setCurrentStep: (step: WizardStep) => void;
    openWizard: () => void;
    closeWizard: () => void;
    toggleVoiceMode: () => void;
    updateBusiness: (updates: Partial<BusinessInfo>) => void;
    updatePages: (updates: Partial<PagesConfig>) => void;
    updateContact: (updates: Partial<ContactInfo>) => void;
    updateStructure: (updates: Partial<PageStructure>) => void;
    updateFeatures: (updates: Partial<Features>) => void;
    updateContent: (updates: Partial<ContentSections>) => void;
    updateDesign: (updates: Partial<DesignChoices>) => void;
    updateMedia: (updates: Partial<MediaOptions>) => void;
    updateSocial: (updates: Partial<SocialLinks>) => void;
    updateTechnical: (updates: Partial<TechnicalOptions>) => void;
    updateVoiceAI: (updates: Partial<VoiceAIConfig>) => void;
    togglePage: (pageId: string) => void;
    addCustomPage: (name: string) => void;
    removeCustomPage: (id: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (!context) {
        throw new Error('useWizard must be used within WizardProvider');
    }
    return context;
};

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<WizardState>(initialState);

    const setDesignLevel = (level: DesignLevel) => {
        setState(prev => ({ ...prev, designLevel: level }));
    };

    const setCurrentStep = (step: WizardStep) => {
        setState(prev => ({ ...prev, currentStep: step }));
    };

    const openWizard = () => {
        setState(prev => ({ ...prev, isWizardOpen: true }));
    };

    const closeWizard = () => {
        setState(prev => ({ ...prev, isWizardOpen: false }));
    };

    const toggleVoiceMode = () => {
        setState(prev => ({ ...prev, isVoiceMode: !prev.isVoiceMode }));
    };

    const updateBusiness = (updates: Partial<BusinessInfo>) => {
        setState(prev => ({ ...prev, business: { ...prev.business, ...updates } }));
    };

    const updatePages = (updates: Partial<PagesConfig>) => {
        setState(prev => ({ ...prev, pages: { ...prev.pages, ...updates } }));
    };

    const updateContact = (updates: Partial<ContactInfo>) => {
        setState(prev => ({ ...prev, contact: { ...prev.contact, ...updates } }));
    };

    const updateStructure = (updates: Partial<PageStructure>) => {
        setState(prev => ({ ...prev, structure: { ...prev.structure, ...updates } }));
    };

    const updateFeatures = (updates: Partial<Features>) => {
        setState(prev => ({ ...prev, features: { ...prev.features, ...updates } }));
    };

    const updateContent = (updates: Partial<ContentSections>) => {
        setState(prev => ({ ...prev, content: { ...prev.content, ...updates } }));
    };

    const updateDesign = (updates: Partial<DesignChoices>) => {
        setState(prev => ({ ...prev, design: { ...prev.design, ...updates } }));
    };

    const updateMedia = (updates: Partial<MediaOptions>) => {
        setState(prev => ({ ...prev, media: { ...prev.media, ...updates } }));
    };

    const updateSocial = (updates: Partial<SocialLinks>) => {
        setState(prev => ({ ...prev, social: { ...prev.social, ...updates } }));
    };

    const updateTechnical = (updates: Partial<TechnicalOptions>) => {
        setState(prev => ({ ...prev, technical: { ...prev.technical, ...updates } }));
    };

    const updateVoiceAI = (updates: Partial<VoiceAIConfig>) => {
        setState(prev => ({ ...prev, voiceAI: { ...prev.voiceAI, ...updates } }));
    };

    const togglePage = (pageId: string) => {
        setState(prev => {
            const current = prev.pages.selectedPages;
            const updated = current.includes(pageId)
                ? current.filter(p => p !== pageId)
                : [...current, pageId];
            return { ...prev, pages: { ...prev.pages, selectedPages: updated } };
        });
    };

    const addCustomPage = (name: string) => {
        const id = `custom-${Date.now()}`;
        setState(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                customPages: [...prev.pages.customPages, { id, name }],
                selectedPages: [...prev.pages.selectedPages, id]
            }
        }));
    };

    const removeCustomPage = (id: string) => {
        setState(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                customPages: prev.pages.customPages.filter(p => p.id !== id),
                selectedPages: prev.pages.selectedPages.filter(p => p !== id)
            }
        }));
    };

    const nextStep = () => {
        const currentIndex = wizardSteps.findIndex(s => s.id === state.currentStep);
        if (currentIndex < wizardSteps.length - 1) {
            setState(prev => ({ ...prev, currentStep: wizardSteps[currentIndex + 1].id }));
        }
    };

    const prevStep = () => {
        const currentIndex = wizardSteps.findIndex(s => s.id === state.currentStep);
        if (currentIndex > 0) {
            setState(prev => ({ ...prev, currentStep: wizardSteps[currentIndex - 1].id }));
        }
    };

    const resetWizard = () => {
        setState(initialState);
    };

    return (
        <WizardContext.Provider value={{
            state,
            setDesignLevel,
            setCurrentStep,
            openWizard,
            closeWizard,
            toggleVoiceMode,
            updateBusiness,
            updatePages,
            updateContact,
            updateStructure,
            updateFeatures,
            updateContent,
            updateDesign,
            updateMedia,
            updateSocial,
            updateTechnical,
            updateVoiceAI,
            togglePage,
            addCustomPage,
            removeCustomPage,
            nextStep,
            prevStep,
            resetWizard
        }}>
            {children}
        </WizardContext.Provider>
    );
};

export default WizardContext;
