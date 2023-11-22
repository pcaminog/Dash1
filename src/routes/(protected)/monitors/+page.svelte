<script lang="ts">
	import type { PageData } from './$types';
	import MonitorSheetCreateMonitor from '$lib/components/Monitor-Sheet-CreateMonitor.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import type { monitorType } from '$lib/types';
	export let data: PageData;
	console.log(data);
	let mon: monitorType[] = [];
	$: mon = data.monitors;
</script>

{#if mon.length === 0}
	<MonitorSheetCreateMonitor monitorForm={data.monitorform} />
	<img
		class=" h-1/2 w-1/2 mx-auto mt-auto"
		src="https://assets.hostnamenotifier.com/roommon.png"
		alt="monitor imagge"
	/>
{:else}

{#each mon as monitor}
<Alert.Root class="m-5">
	<Alert.Title class='text-xl'>{monitor.name}</Alert.Title>
	<Alert.Title class='text-lg text-muted-foreground'>Standard</Alert.Title>

	<Alert.Description
		></Alert.Description
	>
</Alert.Root>

{/each}

{/if}


