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
			'@components': path.resolve('./src/common/components'),
			'@data': path.resolve('./src/common/data'),
			'@view': path.resolve('./src/lib/view'),
			'@config': path.resolve('./src/config'),
			'@helpers': path.resolve('./src/helpers'),
			'@toasts': path.resolve('./src/helpers/toasts-helpers.js'),
		}
	},
	onwarn: (warning, handler) => {
		if (warning.code.startsWith('a11y-')) {
			return;
		}
		handler(warning);
	},
	// preprocess: preprocess(),
};

export default config;
