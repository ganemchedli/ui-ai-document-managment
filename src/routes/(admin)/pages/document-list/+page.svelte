<script>
	import HeadTitle from '@components/HeadTitle.svelte';
	import Breadcrumb from '@components/Breadcrumb.svelte';
	import LucideIcon from '@components/LucideIcon.svelte';
	import Modal from '@components/Modal.svelte';
	import employeeList from '@data/employee';
	import Dropzone from 'svelte-file-dropzone';
	import { t } from 'svelte-i18n';
	import 'flatpickr/dist/flatpickr.css';
	import { showErrorToast, showSuccessToast } from '@toasts';

	let preview = '/assets/images/users/user-dummy-img.jpg';
	let file = null; // Single file reference
	let fileRequest = {
		uploadfile: null,
		assigned_name: '',
		description: ''
	};

	const handleFilesSelect = (event) => {
		const selectedFile = event.detail.acceptedFiles[0]; // Only allow one file
		if (selectedFile) {
			file = selectedFile;
		} else {
			file = null;
		}
	};

	const handleRemoveFile = () => {
		file = null;
		filePreview = null;
	};

	const uploadfile = () => {
		const fileInput = document.querySelector('#profile-img-file-input');
		const file = fileInput.files[0];
		const reader = new FileReader();

		reader.addEventListener(
			'load',
			function () {
				preview = reader.result;
			},
			false
		);

		if (file) {
			reader.readAsDataURL(file);
		}
	};

	let isDeleteModal = false;
	const toggleDelete = () => (isDeleteModal = !isDeleteModal);

	let isAddModal = false;
	const toggleAddModal = () => (isAddModal = !isAddModal);

	let documentList = [];
	const fetchDocuments = async () => {
		loading = true;
		try {
			const res = await axios.get(`/docuements/all`, {
				headers: headerWithMainToken()
			});
			if (res?.status === 200) {
				documentList = res?.data?.item;
			}
			// content
		} catch (error) {
			const status = error?.response?.status;
			// 1.
			if (status === 404) {
				showErrorToast('Ops!', $t('appearToBeThatDocumentsDoesntExist'), 'top-center'); // TODO add transltion laters
				headTitle = $t('docuemntsNotFound'); // TODO add translations
				eventNotFound = true;
			}

			// 2.
			else if (status === 500) {
				showErrorToast('Ops!', $t('500ServerError'), 'top-center');
				headTitle = $t('opsServerError'); // TODO add translations
				eventNotFound = true;
			}
		}
		loading = false;
	};

	const deleteDocument = async () => {
		try {
			const res = await axios.delete(`/documents/delete/`, {
				params: id,
				headers: headerWithMainToken()
			});
			if (res?.status === 200 || res?.status === 204) {
				showSuccessToast('Done!', $t('docuementDeletedSuccessfully'), 'top-center');
			}
		} catch (error) {
			const status = error?.response?.status;
			// 1.
			if (status === 404) {
				showErrorToast('Ops!', $t('appearToBeThatDocumentsDoesntExist'), 'top-center'); // TODO add transltion laters
				headTitle = $t('docuemntsNotFound'); // TODO add translations
				eventNotFound = true;
			}

			// 2.
			else if (status === 500) {
				showErrorToast('Ops!', $t('500ServerError'), 'top-center');
				headTitle = $t('opsServerError'); // TODO add translations
				eventNotFound = true;
			}
		}
	};

	const updateDocument = async () => {
		try {
			const res = await axios.put(`/documents/edit/`, fileRequest, {
				params: id,
				headers: headerWithMainToken()
			});
			if (res?.status === 200 || res?.status === 204) {
				showSuccessToast('Done!', $t('docuementUpdatedSuccessfully'), 'top-center');
			}
		} catch (error) {
			const status = error?.response?.status;
			// 1.
			if (status === 404) {
				showErrorToast('Ops!', $t('appearToBeThatDocumentsDoesntExist'), 'top-center'); // TODO add transltion laters
				headTitle = $t('docuemntsNotFound'); // TODO add translations
				eventNotFound = true;
			}

			// 2.
			else if (status === 500) {
				showErrorToast('Ops!', $t('500ServerError'), 'top-center');
				headTitle = $t('opsServerError'); // TODO add translations
				eventNotFound = true;
			}
		}
	};

	const addDocument = async () => {
		try {
			const res = await axios.post(`/documents/create`, fileRequest, {
				headers: headerWithMainToken()
			});
			if (res?.status === 200 || res?.status === 204) {
				showSuccessToast('Done!', $t('docuementUpdatedSuccessfully'), 'top-center');
			}
		} catch (error) {
			const status = error?.response?.status;
			// 1.
			if (status === 500) {
				showErrorToast('Ops!', $t('500ServerError'), 'top-center');
				headTitle = $t('opsServerError'); // TODO add translations
				eventNotFound = true;
			}
		}
	};
</script>

<HeadTitle title="Sellers" />

<div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto relative">
	<Breadcrumb title="Document List" pagetitle="Document Management" />

	<div class="card" id="employeeTable">
		<div class="card-body">
			<div class="flex items-center gap-3 mb-4">
				<h6 class="text-15 grow">Documents (<b class="total-Employs">{documentList.length}</b>)</h6>
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
						{#each documentList as doc}
							<tr>
								<td
									class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 ID"
									><a
										href="#!"
										class="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600"
										>{doc.id}</a
									></td
								>
								<td
									class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Name"
								>
									<a href="#!" class="flex items-center gap-3">
										<div class="size-6 rounded-full shrink-0 bg-slate-100">
											<img src={doc.original_name} alt="" class="h-6 rounded-full" />
										</div>
										<h6 class="grow">{doc.assigned_name}</h6>
									</a>
								</td>
								<td
									class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Role"
									>{doc.description}</td
								>
								<td
									class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Email"
									>{doc.file_extension}</td
								>
								<td
									class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Phone"
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
											class="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md edit-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
											><LucideIcon name="Pencil" class="size-4" /></a
										>
										<a
											href="#!"
											class="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
											on:click={toggleDelete}><LucideIcon name="Trash2" class="size-4" /></a
										>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row" id="pagination-element">
				<div class="grow">
					<p class="text-slate-500 dark:text-zink-200">
						Showing <b class="showing">10</b> of <b class="total-records">{documentList.length}</b> Results
					</p>
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
			<h5 class="text-16" id="addEmployeeLabel">Add Document</h5>
			<button
				data-modal-close="addEmployeeModal"
				id="addEmployee"
				class="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
				><LucideIcon name="X" class="size-5" /></button
			>
		</div>
		<div class="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
			<form class="create-form" id="create-form">
				<input type="hidden" value="" name="id" id="id" />
				<input type="hidden" value="add" name="action" id="action" />
				<input type="hidden" id="id-field" />
				<div
					id="alert-error-msg"
					class="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"
				></div>
				<div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
					<div class="xl:col-span-12">
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
						{#if file}
							<div class="mt-4">
								<div
									class="border rounded border-slate-200 dark:border-zink-500 p-2 flex items-center"
								>
									<img class="w-12 h-12 rounded mr-3" src="/assets/images/new-document.png" alt="File Preview" />
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

					<div class="xl:col-span-12">
						<label for="fileNameInput" class="inline-block mb-2 text-base font-medium"
							>Filename</label
						>
						<input
							type="text"
							id="fileNameInput"
							class="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
							placeholder="File name"
						/>
					</div>
					<div class="xl:col-span-12">
						<label for="descriptionInput" class="inline-block mb-2 text-base font-medium"
							>Description</label
						>
						<input
							type="text"
							id="descriptionInput"
							class="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
							placeholder="Description"
							required
						/>
					</div>
				</div>
				<div class="flex justify-end gap-2 mt-4">
					<button
						type="reset"
						id="close-modal"
						data-modal-close="addEmployeeModal"
						class="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
						on:click={toggleAddModal}>Cancel</button
					>
					<button
						type="submit"
						id="addNew"
						class="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
						>Add Document</button
					>
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
						type="submit"
						class="text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
						>Yes, Delete It!</button
					>
				</div>
			</div>
		</div>
	</div>
</Modal>
