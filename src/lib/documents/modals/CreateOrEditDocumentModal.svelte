<script>
	// translations
	import { t } from 'svelte-i18n';

	// Components
	import Modal from '@components/Modal.svelte';
	import LucideIcon from '@components/LucideIcon.svelte';

	// Packages
	import Dropzone from 'svelte-file-dropzone';

	// Helpers
	import { headerWithMainToken, logOutWhenSessionExpires } from '@auth';
	import { showErrorToast, showSuccessToast } from '@toasts';

	// Axios
	import axios from '@axios';

	// Props
	export let visibility = false;
	export let closeModal = () => {};
	export let createMode = false;
	export let editMode = false;
	//export let selected = null;
	//export let selectedDocument = null;
	export let refresh = () => {};

	// ------------------------------------------
	// ui states
	let loading = false;

	// data states
	let file = null;
	let fileName = '';
	let description = '';

	// @utility: handle the create document
	const handleSubmitCreateDocument = async () => {
		// Create FormData object
		if (!file) {
			showErrorToast('Ops!', $t('pleaseUploadFileFirst'));
			return;
		}
		const formData = new FormData();
		formData.append('fileName', fileName);
		formData.append('description', description);
		if (file) formData.append('file', file);

		try {
			loading = true;
			// Add New Document
			const res = await axios.post(`/documents/create`, formData, {
				headers: {
					...headerWithMainToken(), // Include authorization headers
					'Content-Type': 'multipart/form-data' // Explicitly set multipart/form-data
				}
			});

			// Handle successful response
			if (res?.status === 201) {
				// refresh the data
				refresh();

				// Display toast
				showSuccessToast('Done!', $t('documentCreatedSuccessfully'));

				// Close modal
				closeModal();
			}
		} catch (error) {
			console.log('error : ', error);
			// Handle errors
			handleError(error);
		}
		loading = false;
	};

	// @utility: handle the edit document
	const handleSubmitEditDocument = () => {
		// content
	};

	// @utility: handle the submit
	const handleSubmit = (event) => {
		event.preventDefault();
		// create mode
		if (createMode) {
			handleSubmitCreateDocument();
		}

		// edit mode
		else if (editMode) {
			handleSubmitEditDocument();
		}
	};

	// @utility: Handles File Drop

	const handleFilesSelect = (event) => {
		const selectedFile = event.detail.acceptedFiles[0];

		if (selectedFile) {
			// Check file format
			const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
			if (!acceptedFormats.includes(`.${fileExtension}`)) {
				showErrorToast('Ops!', $t('invalidFileFormat'));
				return;
			}

			// Check file size
			if (selectedFile.size > maxFileSize) {
				showErrorToast('Ops!', $t('fileSizeExceeded'));
				return;
			}

			// If valid, set the file
			file = selectedFile;
		}
	};

	// @utility: remove selected file
	const handleRemoveFile = () => {
		if (file != null) {
			file = null;
		}
	};

	// @utility: Handles API Errors
	const handleError = (error) => {
		const status = error?.response?.status;
		// 1.document doesn't exist
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
		// 4. token expired
		else if (status === 406) {
			showErrorToast('Ops!', $t('pleaseUploadFileFirst'));
		}
		// 5.
		else if (status === 406) {
			showErrorToast('Ops!', $t('pleaseUploadFileFirst'));
		}
		// 6. check for format error
		else if (status === 400) {
			const errorCode = error?.response?.data?.errorCode;

			// 1. FORMAT_ERROR
			if (errorCode === 'FORMAT_ERROR') {
				showErrorToast('Ops!', $t('invalidFileFormat'));
			}
			// 2. file size
			else if (errorCode === 'LIMIT_FILE_SIZE') {
				showErrorToast('Ops!', $t('fileSizeExceeded'));
			}
		}
		// 6. something else
		else {
			showErrorToast('Ops!', $t('somethingWentWrong'));
		}
	};
</script>

<Modal modal-center className="-translate-y-2/4" isOpen={visibility} toggle={closeModal}>
	<div class="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
		<div class="flex items-center justify-between p-4 border-b dark:border-zink-500">
			<h5 class="text-16">{editMode ? $t('editDocument') : $t('addDocument')}</h5>
			<button
				data-modal-close="addEmployeeModal"
				id="addEmployee"
				class="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
				on:click={closeModal}
			>
				<LucideIcon name="X" class="size-5" />
			</button>
		</div>
		<div class="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
			<form class="create-form" id="create-form" on:submit={handleSubmit}>
				<input type="hidden" value={editMode ? 'edit' : 'add'} name="action" />
				<div
					id="alert-error-msg"
					class="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"
				></div>
				<div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
					<!-- Filename -->
					<div class="xl:col-span-12">
						<label for="fileNameInput" class="text-15 inline-block mb-2 text-base font-medium"
							>{$t('filename') + ' : '}<span class="text-red-500 fw-bolder">*</span>
						</label>
						<input
							type="text"
							id="fileNameInput"
							class="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
							bind:value={fileName}
							placeholder="File name"
							required
						/>
					</div>
					<!-- Description -->
					<div class="xl:col-span-12">
						<label for="descriptionInput" class="text-15 inline-block mb-2 text-base font-medium"
							>{$t('description') + ' : '}<span class="text-yellow-600 fw-bolder"
								>{$t('optional')}</span
							></label
						>
						<input
							type="textarea"
							id="descriptionInput"
							class="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
							bind:value={description}
							placeholder="Description"
							required
						/>
					</div>
				</div>
				<!-- Dropzone -->
				<div class="xl:col-span-12 pt-3">
					{#if !editMode}
						<h6 class="mb-4 text-15">Dropzone</h6>
						<Dropzone
							on:drop={handleFilesSelect}
							maxFiles={1}
							containerClasses="flex items-center justify-center border rounded-md cursor-pointer !bg-slate-100 dropzone !border-slate-200 dark:!bg-zink-600 dark:!border-zink-500 dz-clickable"
						>
							<div class="w-full py-5 text-lg text-center dz-message needsclick">
								<div class="mb-3">
									<LucideIcon
										name="UploadCloud"
										class="block size-12 mx-auto text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500"
									/>
								</div>
								<h5 class="mb-0 font-normal text-slate-500 text-15">
									Drag and drop your files or <a href="#!">browse</a> your files
								</h5>
							</div>
						</Dropzone>
					{/if}
					{#if file}
						<div class="mt-4">
							<div
								class="border rounded border-slate-200 dark:border-zink-500 p-2 flex items-center"
							>
								<img
									class="w-12 h-12 rounded mr-3"
									src="/assets/images/new-document.png"
									alt="File Preview"
								/>
								<div>
									<p class="text-slate-500">{file.name}</p>
									<p class="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
								</div>
								<button
									type="button"
									class="ml-auto px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
									on:click={handleRemoveFile}
								>
									{$t('remove')}
								</button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Buttons -->
				<div class="flex justify-end gap-2 mt-4">
					<button
						type="reset"
						id="close-modal"
						data-modal-close="addEmployeeModal"
						class="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
						on:click={closeModal}
					>
						{$t('cancel')}
					</button>
					<button
						type="submit"
						id="addNew"
						class="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
					>
						{editMode ? $t('update') : $t('create')}
					</button>
				</div>
			</form>
		</div>
	</div>
</Modal>
