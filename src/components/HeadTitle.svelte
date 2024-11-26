<script>
	// Config
	import AppConfig from '@config';

	// Props
	export let title;
</script>

<svelte:head>
	<title>{title} | {AppConfig.appName}</title>
</svelte:head>
