<script>
	// Svelte imports
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';

	// Component imports
	import LightDark from '@components/LightDark.svelte';
	import LucideIcon from '@components/LucideIcon.svelte';
	import ProfileDropdown from '@components/ProfileDropdown.svelte';
	import LanguageDropdown from '@components/languageDropdown.svelte';

	const toggleSidebar = () => {
		if (browser) {
			if (document.documentElement) {
				var windowSize = document.documentElement.clientWidth;
				var verticalOverlay = document.getElementById('sidebar-overlay');
				if (windowSize < 768) {
					document.body.classList.add('overflow-hidden');
					if (verticalOverlay.classList.contains('hidden')) {
						verticalOverlay.classList.remove('hidden');
						document.querySelector('.app-menu').classList.remove('hidden');
					}
					if (document.getElementById('sidebarSizelg')) {
						document.getElementById('sidebarSizelg').click();
					}
				} else {
					if (document.documentElement.getAttribute('data-sidebar-size') == 'sm') {
						if (document.getElementById('sidebarSizelg')) {
							document.getElementById('sidebarSizelg').click();
						}
					} else if (document.documentElement.getAttribute('data-sidebar-size') == 'lg') {
						if (document.getElementById('sidebarSizesm')) {
							document.getElementById('sidebarSizesm').click();
						}
					}
				}
			}
		}
	};
</script>

<header
	id="page-topbar"
	class="ltr:md:left-vertical-menu rtl:md:right-vertical-menu group-data-[sidebar-size=md]:ltr:md:left-vertical-menu-md group-data-[sidebar-size=md]:rtl:md:right-vertical-menu-md group-data-[sidebar-size=sm]:ltr:md:left-vertical-menu-sm group-data-[sidebar-size=sm]:rtl:md:right-vertical-menu-sm group-data-[layout=horizontal]:ltr:left-0 group-data-[layout=horizontal]:rtl:right-0 fixed right-0 z-[1000] left-0 print:hidden group-data-[navbar=bordered]:m-4 group-data-[navbar=bordered]:[&.is-sticky]:mt-0 transition-all ease-linear duration-300 group-data-[navbar=hidden]:hidden group-data-[navbar=scroll]:absolute group/topbar group-data-[layout=horizontal]:z-[1004]"
>
	<div class="layout-width">
		<div
			class="flex items-center px-4 mx-auto bg-topbar border-b-2 border-topbar group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-brand shadow-md h-header shadow-slate-200/50 group-data-[navbar=bordered]:rounded-md group-data-[navbar=bordered]:group-[.is-sticky]/topbar:rounded-t-none group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:border-zink-700 dark:shadow-none group-data-[topbar=dark]:group-[.is-sticky]/topbar:dark:shadow-zink-500 group-data-[topbar=dark]:group-[.is-sticky]/topbar:dark:shadow-md group-data-[navbar=bordered]:shadow-none group-data-[layout=horizontal]:group-data-[navbar=bordered]:rounded-b-none group-data-[layout=horizontal]:shadow-none group-data-[layout=horizontal]:dark:group-[.is-sticky]/topbar:shadow-none"
		>
			<div
				class="flex items-center w-full group-data-[layout=horizontal]:mx-auto group-data-[layout=horizontal]:max-w-screen-2xl navbar-header group-data-[layout=horizontal]:ltr:xl:pr-3 group-data-[layout=horizontal]:rtl:xl:pl-3"
			>
				<!-- LOGO -->
				<div
					class="items-center justify-center hidden px-5 text-center h-header group-data-[layout=horizontal]:md:flex group-data-[layout=horizontal]:ltr::pl-0 group-data-[layout=horizontal]:rtl:pr-0"
				>
					<a href="/">
						<span class="hidden">
							<img src="/assets/images/logo-sm.png" alt="" class="h-6 mx-auto" />
						</span>
						<span class="group-data-[topbar=dark]:hidden group-data-[topbar=brand]:hidden">
							<img src="/assets/images/logo-dark.png" alt="" class="h-6 mx-auto" />
						</span>
					</a>
					<a href="/" class="hidden group-data-[topbar=dark]:block group-data-[topbar=brand]:block">
						<span class="group-data-[topbar=dark]:hidden group-data-[topbar=brand]:hidden">
							<img src="/assets/images/logo-sm.png" alt="" class="h-6 mx-auto" />
						</span>
						<span class="group-data-[topbar=dark]:block group-data-[topbar=brand]:block">
							<img src="/assets/images/logo-light.png" alt="" class="h-6 mx-auto" />
						</span>
					</a>
				</div>

				<button
					type="button"
					on:click={toggleSidebar}
					class="inline-flex relative justify-center items-center p-0 text-topbar-item transition-all size-[37.5px] duration-75 ease-linear bg-topbar rounded-md btn hover:bg-slate-100 group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-dark group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-brand group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:text-zink-200 group-data-[topbar=dark]:dark:border-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[layout=horizontal]:flex group-data-[layout=horizontal]:md:hidden hamburger-icon"
					id="topnav-hamburger-icon"
				>
					<LucideIcon name="ChevronsLeft" class="size-5 group-data-[sidebar-size=sm]:hidden" />
					<LucideIcon
						name="ChevronsRight"
						class="hidden size-5 group-data-[sidebar-size=sm]:block"
					/>
				</button>

				<div class="flex gap-3 ms-auto">
					<LanguageDropdown />

					<LightDark />

					<ProfileDropdown />
				</div>
			</div>
		</div>
	</div>
</header>
