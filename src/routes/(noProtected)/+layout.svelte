<script>
	import '../../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header" />
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter" />
	<!-- (footer) -->
</AppShell>
