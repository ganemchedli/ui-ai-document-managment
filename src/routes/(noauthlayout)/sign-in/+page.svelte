<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	// translations
	import { t } from 'svelte-i18n';
	// helpers
	import { setDataForSignInUser } from '@helpers/auth-helper';

	// ui states
	let spinning = false;

	// redirect to home page
	onMount(async () => {
		// retrieve the queries from path
		const queryParams = new URLSearchParams(window.location.search);
		const status = queryParams.get('status');
        const token = queryParams.get('token');
        const avatar = queryParams.get('avatar');
        const fullName = queryParams.get('fullName');
        const language = queryParams.get('language');

        // check for success
		if (status === 'success' && token) {
            console.log('Login successful:', { token, avatar, fullName, language });
			spinning = true;
			
			// set user data
			setDataForSignInUser(token, {
				avatar,
				fullName,
				language
			});

			// navigate to the home page
			setTimeout(() => {
				goto('/pages/chat');
			}, 500);

			// finish the spinning
			spinning = false;
		}
		// 1. internal_server_error
		else if (status === 'internal_server_error') {
			showAlert = true;
			alertMessage = $t('500ServerError');
			showErrorToast = $t('Ops!', $t('500ServerError'), 'top-center');
		}

		// 2. email_already_used
		else if (status === 'email_already_used') {
			showAlert = true;
			alertMessage = $t('emailAlreadyUsedByAnOtherAccount');
			showErrorToast = $t('Ops!', $t('emailAlreadyUsedByAnOtherAccount'), 'top-center');
		}

		// 3. email_already_used
		else if (status === 'unauthorized_scopes') {
			showAlert = true;
			alertMessage = $t('googleConnectionDenied');
			showErrorToast = $t(
				'Ops!',
				$t('googleConnectionDeniedMakeSureAcceptAccessToInformations'),
				'top-center'
			);
		}

	});
</script>

<div class="flex justify-center items-center h-screen">
	{#if spinning}
		<div
			class="inline-block size-8 border-2 rounded-full animate-spin border-l-transparent border-custom-500"
		></div>
	{/if}
</div>
