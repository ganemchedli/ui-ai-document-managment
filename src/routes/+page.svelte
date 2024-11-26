<script>
	// App config
	import AppConfig from '@config';

	// Svelte imports
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// take to the main screen on page render
	onMount(async () => {
		await goto(AppConfig.defaultHomeRoute);
	});
</script>

<svelte:head>
	<title>Redirecting ...</title>
</svelte:head>

<section />
