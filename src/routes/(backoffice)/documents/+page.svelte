<script>
	// Components
	import HeadTitle from '@components/HeadTitle.svelte';
	import Breadcrumb from '@components/Breadcrumb.svelte';
	import LucideIcon from '@components/LucideIcon.svelte';

	// Modals
	import DeleteDocumentModal from '@lib/documents/modals/DeleteDocumentModal.svelte';
	import CreateOrEditDocumentModal from '@lib/documents/modals/CreateOrEditDocumentModal.svelte';

	// Translations
	import { t } from 'svelte-i18n';

	// Svelte imports
	import { onMount } from 'svelte';

	// Helpers
	import { headerWithMainToken } from '@auth';
	import { showErrorToast } from '@toasts';

	// Axios
	import axios from '@axios';

	// documents states
	let loading = false;
	let documentList = [];

	// Pagination management
	let size = 0;
	let currentPage = 0;
	let limitPerPage = 0;

	// CREATE
	let showCreateDocumentModal = false;

	// DELETE
	let selectedDocumentId = null;
	let showDeleteDocumentModal = false;

	// EDIT
	let selectedDocument = {};
	let showEditDocumentModal = false;

	// Fetch documents on load
	onMount(() => fetchDocuments());

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
			const status = error?.response?.status;
			// 1. server error
			if (status === 500) {
				showErrorToast('Ops!', $t('500ServerError'));
			}
			// 2. session expired
			else if (status === 401 || status === 403) {
				logOutWhenSessionExpires();
			}
			// Something else
			else {
				showErrorToast('Ops!', $t('somethingWentWrong'));
			}
		}
	};

	// @utility: handle edit document modal
	// const handleEditDocumentModal = (document) => {
	// 	selectedDocument = document;
	// 	showEditDocumentModal = true;
	// };

	// @utility: handle open delete document modal
	const handleDeleteDocumentModal = (id) => {
		selectedDocumentId = id;
		showDeleteDocumentModal = true;
	};
</script>

<HeadTitle title={`${$t('documents')}`} />

<div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto relative">
	<Breadcrumb title="Document List" pagetitle="Document Management" />

	<div class="card" id="employeeTable">
		<div class="card-body">
			<div class="flex items-center gap-3 mb-4">
				<h6 class="text-15 grow">
					{$t('documents')} (<b class="total-Employs">{documentList?.length}</b>)
				</h6>
				<div class="shrink-0">
					<a
						href="#!"
						type="button"
						class="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 add-employee"
						on:click={(e) => {
							e.preventDefault();
							showCreateDocumentModal = true;
						}}
						><LucideIcon name="Plus" class="inline-block size-4" />
						<span class="align-middle">{$t('addDocument')}</span></a
					>
				</div>
			</div>

			<div class="-mx-5 overflow-x-auto">
				<table class="w-full whitespace-nowrap">
					<thead class="ltr:text-left rtl:text-right">
						<tr class="bg-slate-100 dark:bg-zink-600">
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Role"
								>{$t('fileName')}</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Email"
								>{$t('description')}</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Phone"
								>{$t('fileType')}</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Country"
							>
								{$t('fileSize')}</th
							>
							<th
								class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500 Action"
							></th>
						</tr>
					</thead>
					<tbody class="list" id="employeeList">
						{#if documentList}
							{#each documentList as doc}
								<tr>
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
										>{doc.file_size + ' MB'}</td
									>
									<td
										class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 Action"
									>
										<div class="flex gap-3">
											<!-- <a
												href="#!"
												class="flex items-center justify-center size-8 rounded-md edit-item-btn"
												on:click={() => handleEditDocumentModal(doc)}
											>
												<LucideIcon name="Pencil" class="size-4" />
											</a> -->
											<a
												href="#!"
												class="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
												on:click={() => handleDeleteDocumentModal(doc._id)}
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
			<!-- <div class="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row" id="pagination-element">
				<div class="grow">
					<p class="text-slate-500 dark:text-zink-200">
						Showing <b class="showing">10</b> of <b class="total-records">{documentList?.length}</b> Results
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
			</div> -->
		</div>
	</div>
</div>
<!-- Create document modal -->
<CreateOrEditDocumentModal
	bind:visibility={showCreateDocumentModal}
	closeModal={() => {
		if (showCreateDocumentModal) {
			showCreateDocumentModal = false;
		}
	}}
	createMode={true}
	refresh={fetchDocuments}
/>

<!--  -->
<CreateOrEditDocumentModal
	bind:visibility={showEditDocumentModal}
	closeModal={() => {
		if (showEditDocumentModal) {
			showEditDocumentModal = false;
		}
	}}
	editMode={true}
	selected={selectedDocument}
	refresh={fetchDocuments}
/>

<!-- Delete Modal -->
<DeleteDocumentModal
	bind:visibility={showDeleteDocumentModal}
	closeModal={() => {
		if (showDeleteDocumentModal) {
			showDeleteDocumentModal = false;
		}
	}}
	refresh={() => {
		documentList = documentList.filter((doc) => doc._id !== selectedDocumentId);
	}}
	documentId={selectedDocumentId}
/>
