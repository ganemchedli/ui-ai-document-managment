// toast.js
import { toasts } from 'svelte-toasts';

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