import adapter from '@sveltejs/adapter-auto';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@components': path.resolve('./src/components'),
			'@layouts': path.resolve('./src/Layouts'),
			'@data': path.resolve('./src/static'),
			'@config': path.resolve('./src/config/theme.js'),
			'@axios': path.resolve('./src/config/axios.js'),
			'@auth': path.resolve('./src/helpers/auth-helper.js'),
			'@i18n': path.resolve('./src/config/i18n.js'),
			'@toasts': path.resolve('./src/helpers/toasts-helpers.js'),
			'@static': path.resolve('./src/static'),
			'@lib': path.resolve('./src/lib')
		}
	},
	onwarn: (warning, handler) => {
		if (warning.code.startsWith('a11y-')) {
			return;
		}
		handler(warning);
	}
	// preprocess: preprocess(),
};

export default config;
