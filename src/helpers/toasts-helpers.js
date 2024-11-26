// toast.js
import { toasts } from 'svelte-toasts';

// @utility: custom success toast
export function showSuccessToast(title = '', description = '', placement = 'bottom-right') {
	toasts.add({
		title,
		description,
		type: 'success',
		duration: 3500,
		placement,
		theme: 'light'
	});
}

// @utility: custom error toast
export function showErrorToast(title = '', description = '', placement = 'bottom-right') {
	toasts.add({
		title,
		description,
		type: 'error',
		duration: 3500,
		placement,
		theme: 'light'
	});
}
