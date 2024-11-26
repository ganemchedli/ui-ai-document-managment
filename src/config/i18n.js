import { init, dictionary, locale } from 'svelte-i18n';

const MESSAGE_FILES = {
	en: () => import('../static/en.json'),
	fr: () => import('../static/fr.json')
	// Add other locales here
};

let cachedLocale;

function initializeI18n({ initialLocale = 'en', fallbackLocale = 'en' } = {}) {
	// Initialize global i18n settings
	init({
		fallbackLocale,
		initialLocale
	});

	// Load and set the initial locale
	if (!MESSAGE_FILES[initialLocale]) {
		console.warn(
			`Locale "${initialLocale}" is not supported. Falling back to "${fallbackLocale}".`
		);
		initialLocale = fallbackLocale;
	}

	return MESSAGE_FILES[initialLocale]()
		.then((messages) => {
			dictionary.set({ [initialLocale]: messages });
			cachedLocale = initialLocale;
			locale.set(initialLocale);
		})
		.catch((error) => {
			console.error(`Failed to load messages for locale "${initialLocale}":`, error);
		});
}

export default initializeI18n;
