<script lang="ts">
	import type { PageData } from './$types';
	import MonitorSheetCreateMonitor from '$lib/components/Monitor-Sheet-CreateMonitor.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import type { monitorType } from '$lib/types';
	export let data: PageData;
	let mon: monitorType[] = [];
	$: mon = data.monitors;
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui//accordion';
	import { CircleDot } from 'lucide-svelte';
</script>

{#if mon.length === 0}
	<MonitorSheetCreateMonitor monitorForm={data.monitorform} />
	<img
		class=" h-1/2 w-1/2 mx-auto mt-auto"
		src="https://assets.hostnamenotifier.com/roommon.png"
		alt="monitor imagge"
	/>
{:else}
	<h2 class="text-xl font-semibold">Standard Monitors</h2>
	<h4 class="text-lg text-muted-foreground">
		Monitors will trigger if response is not on the range 200 - 299
	</h4>
	<MonitorSheetCreateMonitor monitorForm={data.monitorform} />

	{#each mon as monitor}
		<Alert.Root class="m-5">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-xl">{monitor.name}</Alert.Title>
					<Alert.Title class="text-lg text-muted-foreground">Standard</Alert.Title>
				</div>
				<CircleDot class=" text-white fill-green-700 hover:animate-ping " />
			</div>
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger />
					<AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Alert.Description />
		</Alert.Root>
	{/each}
{/if}
