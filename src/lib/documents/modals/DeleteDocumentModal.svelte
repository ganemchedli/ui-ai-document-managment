<script>
	// translations
	import { t } from 'svelte-i18n';

	// Components
	import Modal from '@components/Modal.svelte';
	import LucideIcon from '@components/LucideIcon.svelte';

	// Helpers
	import { headerWithMainToken, logOutWhenSessionExpires } from '@auth';
	import { showErrorToast, showSuccessToast } from '@toasts';

	// Axios
	import axios from '@axios';

	// Props
	export let visibility = false;
	export let closeModal;
	export let refresh;
	export let documentId;

	// ------------------------------------------------------------------------------
	// @utility: handle deleting a document
	const handleDeletingDocument = async () => {
		try {
			const res = await axios.delete(`/documents/delete/${documentId}`, {
				headers: headerWithMainToken()
			});
			if (res?.status === 202) {
				// trigger refresh()
				refresh();

				// display toast
				showSuccessToast('Done!', $t('docuementDeletedSuccessfully'));

				// Close modal
				closeModal();
			}
		} catch (error) {
			const status = error?.response?.status;
			// 1. document doesn't exist
			if (status === 404) {
				showErrorToast('Ops!', $t('appearToBeThatDocumentsDoesntExist'));
			}
			// 2. server error
			else if (status === 500) {
				showErrorToast('Ops!', $t('500ServerError'));
			}
			// 3. token expired
			else if (status === 403 || status === 401) {
				logOutWhenSessionExpires();
			}
			// something else
			else {
				showErrorToast('Ops!', $t('somethingWentWrong'));
			}
		}
	};
</script>

<Modal modal-center className="-translate-y-2/4" isOpen={visibility} toggle={closeModal}>
	<div class="w-screen md:w-[25rem] bg-white shadow rounded-md dark:bg-zink-600">
		<div class="max-h-[calc(theme('height.screen')_-_180px)] overflow-y-auto px-6 py-8">
			<div class="float-right">
				<button
					class="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500"
					on:click={closeModal}><LucideIcon name="X" class="size-5" /></button
				>
			</div>
			<img src="/assets/images/delete.png" alt="" class="block h-12 mx-auto" />
			<div class="mt-5 text-center">
				<h5 class="mb-1">{$t('areYouSure')}</h5>
				<p class="text-slate-500 dark:text-zink-200">
					{$t('areYouCertainYouWantToDeleteThisDocument')}
				</p>
				<div class="flex justify-center gap-2 mt-6">
					<button
						type="reset"
						class="bg-white text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 focus:text-slate-500 focus:bg-slate-100 active:text-slate-500 active:bg-slate-100 dark:bg-zink-600 dark:hover:bg-slate-500/10 dark:focus:bg-slate-500/10 dark:active:bg-slate-500/10"
						on:click={closeModal}>{$t('cancel')}</button
					>
					<button
						type="button"
						class="text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
						on:click={handleDeletingDocument}>{$t('yesDelete')}!</button
					>
				</div>
			</div>
		</div>
	</div>
</Modal>
