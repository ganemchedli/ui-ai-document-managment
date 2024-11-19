<script>
	import HeadTitle from '@components/HeadTitle.svelte';
	import Breadcrumb from '@components/Breadcrumb.svelte';
	import LucideIcon from '@components/LucideIcon.svelte';
	import Modal from '@components/Modal.svelte';
	import Dropzone from 'svelte-file-dropzone';
	import { t } from 'svelte-i18n';
	import { showErrorToast, showSuccessToast } from '@toasts';
	import { onMount } from 'svelte';
	import axios from '@config/axios';
	import { headerWithMainToken } from '@helpers/auth-helper';

	// State Variables
	let file = null;
	let fileName = '';
	let description = '';
	let currentDocumentId = null; // Tracks document ID for edits
	let isAddModal = false;
	let isEditMode = false; // Determines if we are in edit mode
	let isDeleteModal = false;
	let documentList = [];
	let _id = null; // ID for delete requests

	// Fetch documents on load
	onMount(() => fetchDocuments());

	// Toggles Add/Edit Modal
	const toggleAddModal = () => {
		isAddModal = !isAddModal;
		if (!isAddModal) resetForm();
	};

	// Toggles Delete Modal
	const toggleDelete = () => (isDeleteModal = !isDeleteModal);

	// Resets Form Fields
	const resetForm = () => {
		fileName = '';
		description = '';
		file = null;
		currentDocumentId = null;
		isEditMode = false;
	};

	// Fetch all documents
	const fetchDocuments = async () => {
		try {
			const res = await axios.get(`/documents/all`, {
				headers: headerWithMainToken()
			});
			if (res?.status === 200) {
				documentList = res.data.items;
			}
		} catch (error) {
			handleError(error);
		}
	};
	const addDocument = async (e) => {
		e.preventDefault();

		// Create FormData object
		const formData = new FormData();
		formData.append('fileName', fileName || 'Untitled'); // Field for name
		formData.append('description', description); // Field for description
		if (file) formData.append('file', file); // Attach the file only if it exists

		try {
			let res;
			if (isEditMode) {
				// Update Document
				let _id = currentDocumentId;
				res = await axios.put(`/documents/edit/${_id}`, formData, {
					headers: {
						...headerWithMainToken(), // Include authorization headers
						'Content-Type': 'multipart/form-data' // Explicitly set multipart/form-data
					}
				});
			} else {
				// Add New Document
				res = await axios.post(`/documents/create`, formData, {
					headers: {
						...headerWithMainToken(), // Include authorization headers
						'Content-Type': 'multipart/form-data' // Explicitly set multipart/form-data
					}
				});
			}

			// Handle successful response
			if (res?.status === 200 || res?.status === 204) {
				const successMessage = isEditMode
					? $t('docuementUpdatedSuccessfully')
					: $t('documentCreatedSuccessfully');
				showSuccessToast('Done!', successMessage, 'top-center');

				// Update local document list without re-fetching
				if (isEditMode) {
					const docIndex = documentList.findIndex((doc) => doc._id === currentDocumentId);
					if (docIndex !== -1) {
						documentList[docIndex] = {
							...documentList[docIndex],
							assigned_name: fileName,
							description
						};
					}
				} else {
					documentList = [...documentList, res.data];
				}
			}

			// Close modal and refresh documents
			toggleAddModal();
			fetchDocuments();
		} catch (error) {
			// Handle errors
			handleError(error);
		}
	};

	// Sets up Document for Editing
	const handleEdit = (doc) => {
		currentDocumentId = doc._id;
		fileName = doc.assigned_name;
		description = doc.description;
		file = null; // File won't be pre-filled
		isEditMode = true;
		toggleAddModal();
	};

	// Handles File Drop
	const handleFilesSelect = (event) => {
		const selectedFile = event.detail.acceptedFiles[0];
		file = selectedFile || null;
	};

	// Removes File
	const handleRemoveFile = () => {
		file = null;
	};

	// Confirms Deletion of a Document
	const confirmDelete = (id) => {
		_id = id;
		toggleDelete();
	};

	// Deletes Document
	const deleteDocument = async () => {
		try {
			const res = await axios.delete(`/documents/delete/${_id}`, {
				headers: headerWithMainToken()
			});
			if (res?.status === 200 || res?.status === 204) {
				showSuccessToast('Done!', $t('docuementDeletedSuccessfully'), 'top-center');
				// Remove document locally
				documentList = documentList.filter((doc) => doc._id !== _id);
			}
			toggleDelete();
			fetchDocuments();
		} catch (error) {
			handleError(error);
		}
	};

	// Handles API Errors
	const handleError = (error) => {
		const status = error?.response?.status;
		if (status === 404) {
			showErrorToast('Ops!', $t('appearToBeThatDocumentsDoesntExist'), 'top-center');
		} else if (status === 500) {
			showErrorToast('Ops!', $t('500ServerError'), 'top-center');
		} else {
			showErrorToast('Ops!', $t('somethingWentWrong'), 'top-center');
		}
	};
</script>

<HeadTitle title="Sellers" />

<div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto relative">
	<Breadcrumb title="Document List" pagetitle="Document Management" />

	<div class="card" id="employeeTable">
		<div class="card-body">
			<div class="flex items-center gap-3 mb-4">
				<h6 class="text-15 grow">
					Documents (<b class="total-Employs">{documentList?.length}</b>)
				</h6>
				<div class="shrink-0">
					<a
						href="#!"
						type="button"
						class="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 add-employee"
						on:click={toggleAddModal}
						><LucideIcon name="Plus" class="inline-block size-4" />
						<span class="align-middle">Add document</span></a
					>
				</div>
			</div>

			<div class="-mx-5 overflow-x-auto">
				<table class="w-full whitespace-nowrap">
					<thead class="ltr:text-left rtl:text-right">
						<tr class="bg-slate-100 dark:bg-zink-600">
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 ID"
								>Document ID</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Name"
								>Original Name</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Role"
								>Assigned Name</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Email"
								>Description</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Phone"
								>File Type</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Country"
								>File Size</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Experience"
								>Storage Provider</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Action"
								>Action</th
							>
						</tr>
					</thead>
					<tbody class="list" id="employeeList">
						{#if documentList}
							{#each documentList as doc}
								<tr>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 ID"
										><a
											href="#!"
											class="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600"
											>{doc._id}</a
										></td
									>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Name"
									>
										<a href="#!" class="flex items-center gap-3">
											<div class="size-6 rounded-full shrink-0 bg-slate-100">
												<img src="" alt="" class="h-6 rounded-full" />
											</div>
											<h6 class="grow">{doc.original_name}</h6>
										</a>
									</td>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Role"
										>{doc.assigned_name}</td
									>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Email"
										>{doc.description}</td
									>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Phone"
										>{doc.file_extension}</td
									>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Country"
										>{doc.file_size}</td
									>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Country"
										>{doc.storage_provider}</td
									>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Action"
									>
										<div class="flex gap-3">
											<a
												class="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
												href="/pages/account"
												><LucideIcon name="Eye" class="inline-block size-3" />
											</a>
											<a
												href="#!"
												class="flex items-center justify-center size-8 rounded-md edit-item-btn"
												on:click={() => handleEdit(doc)}
											>
												<LucideIcon name="Pencil" class="size-4" />
											</a>
											<a
												href="#!"
												class="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
												on:click={() => confirmDelete(doc._id)}
												><LucideIcon name="Trash2" class="size-4" /></a
											>
										</div>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
			<div class="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row" id="pagination-element">
				<div class="grow">
					<!-- <p class="text-slate-500 dark:text-zink-200">
						Showing <b class="showing">10</b> of <b class="total-records">{documentList?.length}</b> Results
					</p> -->
				</div>

				<div class="col-sm-auto mt-sm-0">
					<div class="flex gap-2 pagination-wrap justify-content-center">
						<a
							class="inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-500 dark:[&.active]:text-custom-500 [&.active]:bg-custom-50 dark:[&.active]:bg-custom-500/10 [&.active]:border-custom-50 dark:[&.active]:border-custom-500/10 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto page-item pagination-prev"
							href={'javascript:void(0)'}
						>
							<LucideIcon class="size-4 mr-1 rtl:rotate-180" name="ChevronLeft" /> Prev
						</a>
						<ul class="flex flex-wrap items-center gap-2 pagination listjs-pagination">
							<li class="active"><a class="page" href="#!" data-i="1" data-page="7">1</a></li>
							<li><a class="page" href="#!" data-i="2" data-page="7">2</a></li>
						</ul>
						<a
							class="inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-500 dark:[&.active]:text-custom-500 [&.active]:bg-custom-50 dark:[&.active]:bg-custom-500/10 [&.active]:border-custom-50 dark:[&.active]:border-custom-500/10 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto page-item pagination-next"
							href={'javascript:void(0)'}
						>
							Next <LucideIcon class="size-4 ml-1 rtl:rotate-180" name="ChevronRight" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<Modal modal-center className="-translate-y-2/4" isOpen={isAddModal} toggle={toggleAddModal}>
	<div class="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
		<div class="flex items-center justify-between p-4 border-b dark:border-zink-500">
			<h5 class="text-16">{isEditMode ? 'Edit Document' : 'Add Document'}</h5>
			<button
				data-modal-close="addEmployeeModal"
				id="addEmployee"
				class="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
				on:click={toggleAddModal}
			>
				<LucideIcon name="X" class="size-5" />
			</button>
		</div>
		<div class="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
			<form class="create-form" id="create-form" on:submit={addDocument}>
				<input type="hidden" value={isEditMode ? 'edit' : 'add'} name="action" />
				<div
					id="alert-error-msg"
					class="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"
				></div>
				<div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
					<!-- Dropzone -->
					<div class="xl:col-span-12">
						{#if !isEditMode}
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
										Remove
									</button>
								</div>
							</div>
						{/if}
					</div>
					<!-- Filename -->
					<div class="xl:col-span-12">
						<label for="fileNameInput" class="inline-block mb-2 text-base font-medium"
							>Filename</label
						>
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
						<label for="descriptionInput" class="inline-block mb-2 text-base font-medium"
							>Description</label
						>
						<input
							type="text"
							id="descriptionInput"
							class="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
							bind:value={description}
							placeholder="Description"
							required
						/>
					</div>
				</div>
				<!-- Buttons -->
				<div class="flex justify-end gap-2 mt-4">
					<button
						type="reset"
						id="close-modal"
						data-modal-close="addEmployeeModal"
						class="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
						on:click={toggleAddModal}
					>
						Cancel
					</button>
					<button
						type="submit"
						id="addNew"
						class="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
					>
						{isEditMode ? 'Update Document' : 'Add Document'}
					</button>
				</div>
			</form>
		</div>
	</div>
</Modal>
<Modal modal-center className="-translate-y-2/4" isOpen={isDeleteModal} toggle={toggleDelete}>
	<div class="w-screen md:w-[25rem] bg-white shadow rounded-md dark:bg-zink-600">
		<div class="max-h-[calc(theme('height.screen')_-_180px)] overflow-y-auto px-6 py-8">
			<div class="float-right">
				<button
					class="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500"
					on:click={toggleDelete}><LucideIcon name="X" class="size-5" /></button
				>
			</div>
			<img src="/assets/images/delete.png" alt="" class="block h-12 mx-auto" />
			<div class="mt-5 text-center">
				<h5 class="mb-1">Are you sure?</h5>
				<p class="text-slate-500 dark:text-zink-200">
					Are you certain you want to delete this record?
				</p>
				<div class="flex justify-center gap-2 mt-6">
					<button
						type="reset"
						class="bg-white text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 focus:text-slate-500 focus:bg-slate-100 active:text-slate-500 active:bg-slate-100 dark:bg-zink-600 dark:hover:bg-slate-500/10 dark:focus:bg-slate-500/10 dark:active:bg-slate-500/10"
						on:click={toggleDelete}>Cancel</button
					>
					<button
						type="button"
						class="text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
						on:click={deleteDocument}>Yes, Delete It!</button
					>
				</div>
			</div>
		</div>
	</div>
</Modal>
