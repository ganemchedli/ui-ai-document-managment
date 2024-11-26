<script>
	// App config
	import AppConfig from '@config';

	// Svelte imports
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Components
	import Dropdown from './Dropdown.svelte';
	import DropdownMenu from './DropdownMenu.svelte';
	import DropdownToggle from './DropdownToggle.svelte';
	import LucideIcon from './LucideIcon.svelte';

	// Translations
	import { t } from 'svelte-i18n';

	// Auth
	import { emptyUserDataAfterLogOut, extractUserProfileData } from '@auth';

	// ----------------------------------------------------------------------

	// set the user details
	let profileData = {};

	// init the user details
	onMount(async () => {
		// check if the user is authed
		const userDetails = extractUserProfileData();

		// check if the user details
		if (userDetails) {
			profileData = userDetails;
		}
	});

	// @utility: handle the log out
	function handleLogout() {
		emptyUserDataAfterLogOut();
		goto(AppConfig.defaultSignInRoute); // Redirect to login after logout
	}
</script>

<Dropdown className="relative flex items-center h-header" direction="bottom-start">
	<DropdownToggle
		className="inline-block p-0 transition-all duration-200 ease-linear bg-topbar rounded-full text-topbar-item dropdown-toggle btn hover:bg-topbar-item-bg-hover hover:text-topbar-item-hover group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[topbar=dark]:dark:text-zink-200"
	>
		<div class="bg-pink-100 rounded-full">
			<img src={profileData?.avatar} alt="" class="size-[37.5px] rounded-full" />
		</div>
	</DropdownToggle>
	<DropdownMenu
		class="absolute z-50 p-4 ltr:text-left rtl:text-right bg-white rounded-md shadow-md !top-4 dropdown-menu min-w-[14rem] dark:bg-zink-600 block"
	>
		<a href="#!" class="flex gap-3 mb-3">
			<div class="relative inline-block shrink-0">
				<div class="rounded bg-slate-100 dark:bg-zink-500">
					<img src={profileData?.avatar} alt="" class="size-12 rounded" />
				</div>
			</div>
			<div>
				<h6 class="mb-1 text-15">{profileData?.fullName}</h6>
			</div>
		</a>
		<ul>
			<li class="pt-2 mt-2 border-t border-slate-200 dark:border-zink-500">
				<a
					class="block ltr:pr-4 rtl:pl-4 py-1.5 text-base font-medium transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:text-custom-500 focus:text-custom-500 dark:text-zink-200 dark:hover:text-custom-500 dark:focus:text-custom-500"
					href="#!"
					on:click={handleLogout}
					><LucideIcon name="LogOutIcon" class="inline-block size-4 ltr:mr-2 rtl:ml-2" />
					{$t('signOut')}</a
				>
			</li>
		</ul>
	</DropdownMenu>
</Dropdown>
