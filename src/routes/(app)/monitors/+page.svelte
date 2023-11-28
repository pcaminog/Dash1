<script lang="ts">
	import type { PageData } from './$types';
	import * as Alert from '$lib/components/ui/alert';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui//accordion';
	import { CircleDot } from 'lucide-svelte';
	import MonitorSheetCreateStandard from '$lib/components/Monitor-Sheet-CreateStandard.svelte';
	import MonitorSheetCreateCode from '$lib/components/Monitor-Sheet-CreateCode.svelte';
	import MonitorSheetCreateDns from '$lib/components/Monitor-Sheet-CreateDNS.svelte';
	import type { monitorDNSDBType, monitorHTTPCodeType, monitorHTTPStandardType } from '$lib/types';
	export let data: PageData;
	console.log(data);
	let DNSMonitor: monitorDNSDBType[] = [];
	$: {
		DNSMonitor = data.dns.map((monitor: monitorDNSDBType) => ({
			...monitor,
			ips: JSON.parse(monitor.ips)
		}));
	}

	let StandardHTTPMonitor: monitorHTTPStandardType[] = [];
	$: StandardHTTPMonitor = data.standard;
	let CodeHTTPMonitor: monitorHTTPCodeType[] = [];
	$: CodeHTTPMonitor = data.code;
	$: console.log(DNSMonitor);
</script>

{#if DNSMonitor.length === 0 && CodeHTTPMonitor.length === 0 && StandardHTTPMonitor.length === 0}
	<MonitorSheetCreateStandard monitorForm={data.monitorStandardform} />
	<MonitorSheetCreateCode monitorForm={data.monitorCodeform} />
	<MonitorSheetCreateDns dnsForm={data.monitorDNSform} />

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
	<MonitorSheetCreateStandard monitorForm={data.monitorStandardform} />

	{#each StandardHTTPMonitor as monitor}
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
	<h2 class="text-xl font-semibold">Specific Code Monitors</h2>
	<h4 class="text-lg text-muted-foreground">
		Monitors will trigger if response of the specified Status Code
	</h4>
	<MonitorSheetCreateCode monitorForm={data.monitorCodeform} />

	{#each CodeHTTPMonitor as monitor}
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
	<h2 class="text-xl font-semibold">DNS Monitors</h2>
	<h4 class="text-lg text-muted-foreground">
		Monitors will trigger if the DNS lookup reply with an error or with new IPs
	</h4>
	<MonitorSheetCreateDns dnsForm={data.monitorDNSform} />

	{#each DNSMonitor as monitor}
		<Alert.Root class="m-5">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-xl">{monitor.name}</Alert.Title>
					{#each monitor.ips as ip}
						<Alert.Title class="text-lg text-muted-foreground">{ip}</Alert.Title>
					{/each}
				</div>
				<CircleDot class=" text-white fill-green-700 hover:animate-ping " />
			</div>
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger />
					<AccordionContent>
						<h3 class=" text-base font-semibold">Last 3 Checks</h3>
						{#each monitor.checks as check}
							<div class="flex flex-row justify-between leading-3 my-2">
								<p class=" text-sm text-muted-foreground">
									{new Date(Math.floor(check.last_checked)).toLocaleString()}
								</p>
								<p class=" text-sm text-muted-foreground">{JSON.parse(check.ips)}</p>
							</div>
						{/each}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Alert.Description />
		</Alert.Root>
	{/each}
{/if}
