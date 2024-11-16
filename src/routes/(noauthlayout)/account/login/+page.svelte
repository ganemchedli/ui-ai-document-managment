<script>
	// axios
	import { OAuthLinks } from '@config/axios';
	// Svelte imports
	import { onMount, onDestroy } from 'svelte';
	// dependencies
	import HeadTitle from '@components/HeadTitle.svelte';
	import { classList } from 'svelte-body';
	import { browser } from '$app/environment';

	if (browser) {
		document.body.setAttribute('class', '');
	}
</script>

<svelte:body
	use:classList={'flex items-center justify-center min-h-screen py-16 lg:py-10 bg-slate-50 dark:bg-zink-800 dark:text-zink-100 font-public'}
/>

<HeadTitle title="Sign In" />

<div class="relative">
	<div class="absolute hidden opacity-50 ltr:-left-16 rtl:-right-16 -top-10 md:block">
		<svg
			version="1.2"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 125 316"
			width="125"
			height="316"
		>
			<title>&lt;Group&gt;</title>
			<g id="&lt;Group&gt;">
				<path
					id="&lt;Path&gt;"
					class="fill-custom-100/50 dark:fill-custom-950/50"
					d="m23.4 221.8l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-100 dark:fill-custom-950"
					d="m31.2 229.6l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-200/50 dark:fill-custom-900/50"
					d="m39 237.4l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-200/75 dark:fill-custom-900/75"
					d="m46.8 245.2l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-200 dark:fill-custom-900"
					d="m54.6 253.1l-1.3-3.1v-315.4l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-300/50 dark:fill-custom-800/50"
					d="m62.4 260.9l-1.2-3.1v-315.4l1.2 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-300/75 dark:fill-custom-800/75"
					d="m70.3 268.7l-1.3-3.1v-315.4l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-300 dark:fill-custom-800"
					d="m78.1 276.5l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-400/50 dark:fill-custom-700/50"
					d="m85.9 284.3l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-400/75 dark:fill-custom-700/75"
					d="m93.7 292.1l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-400 dark:fill-custom-700"
					d="m101.5 299.9l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-500/50 dark:fill-custom-600/50"
					d="m109.3 307.8l-1.3-3.1v-315.4l1.3 3.1z"
				/>
			</g>
		</svg>
	</div>

	<div
		class="absolute hidden -rotate-180 opacity-50 ltr:-right-16 rtl:-left-16 -bottom-10 md:block"
	>
		<svg
			version="1.2"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 125 316"
			width="125"
			height="316"
		>
			<title>&lt;Group&gt;</title>
			<g id="&lt;Group&gt;">
				<path
					id="&lt;Path&gt;"
					class="fill-custom-100/50 dark:fill-custom-950/50"
					d="m23.4 221.8l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-100 dark:fill-custom-950"
					d="m31.2 229.6l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-200/50 dark:fill-custom-900/50"
					d="m39 237.4l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-200/75 dark:fill-custom-900/75"
					d="m46.8 245.2l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-200 dark:fill-custom-900"
					d="m54.6 253.1l-1.3-3.1v-315.4l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-300/50 dark:fill-custom-800/50"
					d="m62.4 260.9l-1.2-3.1v-315.4l1.2 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-300/75 dark:fill-custom-800/75"
					d="m70.3 268.7l-1.3-3.1v-315.4l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-300 dark:fill-custom-800"
					d="m78.1 276.5l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-400/50 dark:fill-custom-700/50"
					d="m85.9 284.3l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-400/75 dark:fill-custom-700/75"
					d="m93.7 292.1l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-400 dark:fill-custom-700"
					d="m101.5 299.9l-1.3-3.1v-315.3l1.3 3.1z"
				/>
				<path
					id="&lt;Path&gt;"
					class="fill-custom-500/50 dark:fill-custom-600/50"
					d="m109.3 307.8l-1.3-3.1v-315.4l1.3 3.1z"
				/>
			</g>
		</svg>
	</div>

	<div
		class="mb-0 w-screen lg:mx-auto lg:w-[500px] card shadow-lg border-none shadow-slate-100 relative"
	>
		<div class="!px-10 !py-12 card-body">
			<a href="#!">
				<img src="/assets/images/logo-light.png" alt="" class="hidden h-6 mx-auto dark:block" />
				<img src="/assets/images/logo-dark.png" alt="" class="block h-6 mx-auto dark:hidden" />
			</a>
			<div class="mt-8 text-center">
				<h4 class="mb-1 text-custom-500 dark:text-custom-500">Welcome Back !</h4>
				<p class="text-slate-500 dark:text-zink-200">Sign in to continue to Tailwick.</p>
			</div>
			<div class="mt-10">
				<button
					type="submit"
					class="w-full text-black btn bg-[#f2f3f6] border-none hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
					on:click={() => {
						window.location.href = OAuthLinks.googleLink;
					}}><i class="ri-google-fill pr-5"></i>Sign in with Google</button
				>
			</div>
			<!-- <div class="mt-10">
				<button
					type="submit"
					class="w-full text-black btn bg-[#f2f3f6] border-none hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
					on:click={() => {
						window.location.href = OAuthLinks.outlookLink;
					}}><i class="ri-windows-line pr-5"></i>Sign in with Outlook</button
				>
			</div> -->
		</div>
	</div>
</div>
