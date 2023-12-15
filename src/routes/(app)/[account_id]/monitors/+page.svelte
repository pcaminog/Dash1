<script lang="ts">
	import type { PageData } from './$types';
	import * as Alert from '$lib/components/ui/alert';
	import MonitorSheetCreateStandard from '$lib/components/Monitor-Sheet-CreateStandard.svelte';
	import MonitorSheetCreateCode from '$lib/components/Monitor-Sheet-CreateCode.svelte';
	import MonitorSheetCreateDns from '$lib/components/Monitor-Sheet-CreateDNS.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import type {
		monitorDNSDBType,
		monitorHTTPCodeDBType,
		monitorHTTPStandardDBType
	} from '$lib/types';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import Statusbar from '$lib/components/statusbar.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import StatusbarHttpStandard from '$lib/components/statusbarHTTPStandard.svelte';
	export let data: PageData;
	let CodeMonitor: monitorHTTPCodeDBType[] = [];
	$: CodeMonitor = data.code;
	let StandardHTTPMonitor: monitorHTTPStandardDBType[] = [];
	$: StandardHTTPMonitor = data.standard;
	let DNSMonitor: monitorDNSDBType[] = [];
	$: {
		DNSMonitor = data.dns.map((monitor: monitorDNSDBType) => ({
			...monitor,
			ips: JSON.parse(monitor.ips),
			receivedIPs: JSON.parse(monitor.checks[0].ips)
		}));
	}
	$: console.log(DNSMonitor);
</script>

{#if DNSMonitor.length === 0 && CodeMonitor.length === 0 && StandardHTTPMonitor.length === 0}
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl flex flex-col">
			<h1 class="text-lg font-semibold mb-7 mx-auto">Create your first monitor</h1>
			<div class="grid grid-cols-2 gap-4 justify-center">
				<h2 class="text-lg font-semibold text-muted-foreground text-end">HTTP Standard</h2>
				<MonitorSheetCreateStandard monitorForm={data.monitorStandardform} />
			</div>
			<div class="grid grid-cols-2 gap-4 justify-center">
				<h2 class="text-lg font-semibold text-muted-foreground text-end">HTTP Code Specific</h2>
				<MonitorSheetCreateCode monitorForm={data.monitorCodeform} />
			</div>
			<div class="grid grid-cols-2 gap-4 justify-center">
				<h2 class="text-lg font-semibold text-muted-foreground text-end">DNS</h2>
				<MonitorSheetCreateDns dnsForm={data.monitorDNSform} />
			</div>
		</div>
	</div>
	<img
		class=" h-1/2 w-1/2 mx-auto mt-auto"
		src="https://assets.hostnamenotifier.com/roommon.png"
		alt="monitor_image"
	/>
{:else}
	<h2 class="text-xl font-semibold flex flex-row justify-between">
		Standard Monitors <MonitorSheetCreateStandard monitorForm={data.monitorStandardform} />
	</h2>
	<h4 class="text-xs mb-4 text-muted-foreground">
		Monitors will trigger if response is not on the range 200 - 299
	</h4>
	<div class="grid md:grid-cols-2 grid-cols-1 gap-4">
		{#each StandardHTTPMonitor as monitor}
			<button
				on:click={() => {
					goto(`/${$page.params.account_id}/monitors/view/http/standard/${monitor.monitor_id}`);
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						goto(`/${$page.params.account_id}/monitors/view/http/standard/${monitor.monitor_id}`);
					}
				}}
			>
				<Alert.Root class=" overflow-hidden">
					<div class="grid md:grid-cols-3 grid-cols-1 justify-between">
						<div>
							<Alert.Title class="text-base truncate">{monitor.name}</Alert.Title>

							<Alert.Title class="font-light text-sm hover:underline truncate"
								><a target="_blank" href={monitor.url}>{monitor.url}</a></Alert.Title
							>
						</div>

						{#if monitor.mon_status === 'active'}
							<Badge class="w-fit h-6 my-2 md:my-0 mx-auto bg-blue hover:bg-blue-foreground"
								>Active</Badge
							>
						{:else if monitor.mon_status === 'paused'}
							<Badge class="w-fit h-6 mx-auto bg-yellow-700 hover:bg-yellow-500">Paused</Badge>
						{/if}
						<div class=" flex flex-col gap-4">
							<Tooltip.Root>
								<Tooltip.Trigger
									><p class="text-muted-foreground text-sm underline">
										{monitor.interval} minutes
									</p></Tooltip.Trigger
								>
								<Tooltip.Content>
									<p>The monitor will check the URL every {monitor.interval} minutes</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
					</div>
					<StatusbarHttpStandard monitorData={monitor.checks} />
				</Alert.Root>
			</button>
		{/each}
	</div>

	<Separator class="my-4" />

	<h2 class="text-xl font-semibold flex flex-row justify-between">
		Specific Code Monitors <MonitorSheetCreateCode monitorForm={data.monitorCodeform} />
	</h2>
	<h4 class="text-xs mb-4 text-muted-foreground">
		Monitors will trigger if response of the specified Status Code
	</h4>
	<div class="grid md:grid-cols-2 grid-cols-1 gap-4">
		{#each CodeMonitor as monitor}
			<button
				on:click={() => {
					goto(`/${$page.params.account_id}/monitors/view/http/code/${monitor.monitor_id}`);
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						goto(`/${$page.params.account_id}/monitors/view/http/code/${monitor.monitor_id}`);
					}
				}}
			>
				<Alert.Root class=" overflow-hidden">
					<div class="grid md:grid-cols-3 grid-cols-1 justify-between">
						<div>
							<Alert.Title class="text-base truncate">{monitor.name}</Alert.Title>

							<Alert.Title class="font-light text-sm hover:underline truncate"
								><a target="_blank" href={monitor.url}>{monitor.url}</a></Alert.Title
							>
						</div>

						{#if monitor.mon_status === 'active'}
							<Badge class="w-fit h-6 my-2 md:my-0 mx-auto bg-blue hover:bg-blue-foreground"
								>Active</Badge
							>
						{:else if monitor.mon_status === 'paused'}
							<Badge class="w-fit h-6 mx-auto bg-yellow-700 hover:bg-yellow-500">Paused</Badge>
						{/if}
						<div class=" flex flex-col gap-4">
							<Tooltip.Root>
								<Tooltip.Trigger
									><p class="text-muted-foreground text-sm underline">
										{monitor.interval} minutes
									</p></Tooltip.Trigger
								>
								<Tooltip.Content>
									<p>The monitor will check the URL every {monitor.interval} minutes</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
					</div>
					<StatusbarHttpStandard monitorData={monitor.checks} />
				</Alert.Root>
			</button>
		{/each}
	</div>
	<Separator class="my-4" />

	<h2 class="text-xl font-semibold flex flex-row justify-between">
		DNS Monitors <MonitorSheetCreateDns dnsForm={data.monitorDNSform} />
	</h2>
	<h4 class="text-xs mb-4 text-muted-foreground">
		Monitors will trigger if the DNS lookup reply with an error or with new IPs
	</h4>
	<div class="grid md:grid-cols-2 grid-cols-1 gap-4">
		{#each DNSMonitor as monitor}
			<button
				on:click={() => {
					goto(`/${$page.params.account_id}/monitors/view/dns/${monitor.monitor_id}`);
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						goto(`/${$page.params.account_id}/monitors/view/dns/${monitor.monitor_id}`);
					}
				}}
			>
				<Alert.Root class="overflow-hidden">
					<div class="grid md:grid-cols-3 grid-cols-1 justify-between">
						<div>
							<Alert.Title class="text-base truncate">{monitor.name}</Alert.Title>

							<Alert.Title class={`text-sm text-muted-foreground truncate`}
								><span class="text-xs font-light">Set IPs:</span>{monitor.ips}</Alert.Title
							>
							<Alert.Title
								class={`${
									!monitor.checks[0].ok ? 'text-sm text-destructive truncate' : ' text-sm truncate'
								}`}
								><span class="text-xs font-light">Received IPs:</span
								>{monitor.receivedIPs}</Alert.Title
							>
						</div>

						{#if monitor.mon_status === 'active'}
							<Badge class="w-fit h-6 my-2 md:my-0 mx-auto bg-blue hover:bg-blue-foreground"
								>Active</Badge
							>
						{:else if monitor.mon_status === 'paused'}
							<Badge class="w-fit h-6 mx-auto bg-yellow-500  hover:bg-yellow-700">Paused</Badge>
						{/if}
						<div class=" flex flex-col gap-4">
							<Tooltip.Root>
								<Tooltip.Trigger
									><p class="text-muted-foreground text-sm underline">
										{monitor.interval} minutes
									</p></Tooltip.Trigger
								>
								<Tooltip.Content>
									<p>The monitor will check the URL every {monitor.interval} minutes</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
					</div>
					<Statusbar monitorData={monitor.checks} />
				</Alert.Root>
			</button>
		{/each}
	</div>
{/if}
