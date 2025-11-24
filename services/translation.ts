import * as Localization from "expo-localization";
let cachedTranslations: { primary: any, fallback: any } | null = null;

export const loadTranslations = async (languageCode: string) => {
    if (cachedTranslations) {
        return cachedTranslations;
    }

    const en = await import('../assets/data/i18n/en.json');
    let primary = en;

    if (languageCode === "fr") {
        try {
            primary = await import('../assets/data/i18n/fr.json');
        } catch {
        }
    }

    cachedTranslations = { primary: primary.default, fallback: en.default };
    return cachedTranslations;
};

export const getUITranslation = async (key: string): Promise<string> => {
    const languageCode = getLanguageCode();
    const translations = await loadTranslations(languageCode);

    const uiKey = `ui.${key}`;

    return getTranslatedValue(uiKey, translations);
};

export const getTranslatedValue = async (key: string, { primary, fallback }: { primary: any, fallback: any }): Promise<string> => {
    let value = getNestedValue(key, primary);

    if (value === undefined) {
        value = getNestedValue(key, fallback);
    }

    return value !== undefined ? value : key;
};

export const getLanguageCode = (): string => {
    const locales = Localization.getLocales();

    if (locales && locales.length > 0) {
        const locale = locales[0];
        if (locale.languageCode) {
            return locale.languageCode;
        }
    }
    return 'en';
};

const getNestedValue = (key: string, translations: any): string | undefined => {
    const parts = key.split(".");
    let value: any = translations;
    for (let part of parts) {
        if (!value || typeof value !== 'object' || !value.hasOwnProperty(part)) {
            return undefined;
        }
        value = value[part];
    }
    return typeof value === 'string' || typeof value === 'number' ? value.toString() : undefined;
};