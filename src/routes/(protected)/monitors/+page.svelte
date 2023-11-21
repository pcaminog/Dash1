<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import * as Sheet from '$lib/components/ui/sheet';
	import MonitorSheetCreateMonitor from '$lib/components/Monitor-Sheet-CreateMonitor.svelte';

	export let data: PageData;
	console.log(data);
	let mon = [];
	$: mon = data.monitors;
</script>

{#if mon.length === 0}
	<MonitorSheetCreateMonitor monitorForm={data.monitorform} />
	<img
		class=" h-1/2 w-1/2 mx-auto mt-auto"
		src="https://assets.hostnamenotifier.com/roommon.png"
		alt="monitor imagge"
	/>
{/if}
