<script lang="ts">
	import type { PageData } from './$types';
	import * as Alert from '$lib/components/ui/alert';
	import * as Accordion from '$lib/components/ui/accordion';
	import { CircleDot, RefreshCcw, Trash2 } from 'lucide-svelte';
	import MonitorSheetCreateStandard from '$lib/components/Monitor-Sheet-CreateStandard.svelte';
	import MonitorSheetCreateCode from '$lib/components/Monitor-Sheet-CreateCode.svelte';
	import MonitorSheetCreateDns from '$lib/components/Monitor-Sheet-CreateDNS.svelte';
	import type {
		monitorDNSDBType,
		monitorHTTPCodeDBType,
		monitorHTTPStandardDBType
	} from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { toast_error_style } from '$lib/utils';
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
			ips: JSON.parse(monitor.ips)
		}));
	}
	console.log(data);

	const { enhance: delenhance } = superForm(data.delMonitorForm, {
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Monitor delete succesfully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});
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
	<h4 class="text-xs text-muted-foreground">
		Monitors will trigger if response is not on the range 200 - 299
	</h4>

	{#each StandardHTTPMonitor as monitor}
		<Alert.Root class="m-5 overflow-hidden">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-base">{monitor.name}</Alert.Title>

					<Alert.Title class="font-light text-sm hover:underline"
						><a target="_blank" href={monitor.url}>{monitor.url}</a></Alert.Title
					>
				</div>
				<div class=" flex flex-col gap-4">
					{#if monitor.mon_status === 'active'}
						<Badge class="w-fit mx-auto bg-blue">Active</Badge>
					{:else if monitor.mon_status === 'paused'}
						<Badge class="w-fit mx-auto">Paused</Badge>
					{/if}

					<p class="text-muted-foreground text-sm">
						Checks every {monitor.interval} minutes
					</p>

					{#if monitor.checks[0]?.status >= 200 && monitor.checks[0]?.status <= 299}
						<Badge class="w-fit mx-auto h-6 bg-green-600 hover:bg-green-800 ">Healthy</Badge>
					{:else if monitor.checks[0]?.status < 200 || monitor.checks[0]?.status > 299}
						<Badge class="w-fit mx-auto h-6 bg-destructive ">Critical</Badge>
					{:else}
						<Badge class="w-fit mx-auto h-6 bg-blue ">Pending</Badge>
					{/if}
				</div>
			</div>
			<StatusbarHttpStandard monitorData={monitor.checks} />

			<Alert.Description class="my-4"
				><Button
					variant="link"
					on:click={() => {
						goto(`/${$page.params.account_id}/monitors/view/http/standard/${monitor.monitor_id}`);
					}}>Details</Button
				></Alert.Description
			>
		</Alert.Root>
	{/each}

	<Separator class="mb-4" />

	<h2 class="text-xl font-semibold flex flex-row justify-between">
		Specific Code Monitors <MonitorSheetCreateCode monitorForm={data.monitorCodeform} />
	</h2>
	<h4 class="text-xs text-muted-foreground">
		Monitors will trigger if response of the specified Status Code
	</h4>

	{#each CodeMonitor as monitor}
		<Alert.Root class="m-5 overflow-hidden">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-base">{monitor.name}</Alert.Title>

					<Alert.Title class="font-light text-sm hover:underline"
						><a target="_blank" href={monitor.url}>{monitor.url}</a></Alert.Title
					>
				</div>
				<div class=" flex flex-col gap-4">
					{#if monitor.mon_status === 'active'}
						<Badge class="w-fit mx-auto bg-blue">Active</Badge>
					{:else if monitor.mon_status === 'paused'}
						<Badge class="w-fit mx-auto">Paused</Badge>
					{/if}

					<p class="text-muted-foreground text-sm">
						Checks every {monitor.interval} minutes
					</p>

					{#if monitor.checks[0]?.status >= 200 && monitor.checks[0]?.status <= 299}
						<Badge class="w-fit mx-auto h-6 bg-green-600 hover:bg-green-800 ">Healthy</Badge>
					{:else if monitor.checks[0]?.status < 200 || monitor.checks[0]?.status > 299}
						<Badge class="w-fit mx-auto h-6 bg-destructive ">Critical</Badge>
					{:else}
						<Badge class="w-fit mx-auto h-6 bg-blue ">Pending</Badge>
					{/if}
				</div>
			</div>
			<StatusbarHttpStandard monitorData={monitor.checks} />

			<Alert.Description class="my-4"
				><Button
					variant="link"
					on:click={() => {
						goto(`/${$page.params.account_id}/monitors/view/http/code/${monitor.monitor_id}`);
					}}>Details</Button
				></Alert.Description
			>
		</Alert.Root>
	{/each}
	<Separator class="mb-4" />

	<h2 class="text-xl font-semibold flex flex-row justify-between">
		DNS Monitors <MonitorSheetCreateDns dnsForm={data.monitorDNSform} />
	</h2>
	<h4 class="text-xs text-muted-foreground">
		Monitors will trigger if the DNS lookup reply with an error or with new IPs
	</h4>
	{#each DNSMonitor as monitor}
		<Alert.Root class="m-5 overflow-hidden">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-base">{monitor.name}</Alert.Title>
					{#each monitor.ips as ip}
						<Alert.Title class={`text-sm text-muted-foreground`}>{ip}</Alert.Title>
					{/each}
				</div>
				<div class=" flex flex-col gap-4">
					{#if monitor.mon_status === 'active'}
						<Badge class="w-fit mx-auto bg-blue">Active</Badge>
					{:else if monitor.mon_status === 'paused'}
						<Badge class="w-fit mx-auto">Paused</Badge>
					{/if}

					<p class="text-muted-foreground text-sm">
						Checks every {monitor.interval} minutes
					</p>

					{#if monitor.checks[0]?.ok}
						<Badge class="w-fit mx-auto h-6 bg-green-600 hover:bg-green-800 ">Healthy</Badge>
					{:else if !monitor.checks[0]?.ok}
						<Badge class="w-fit mx-auto h-6 bg-destructive ">Critical</Badge>
					{:else}
						<Badge class="w-fit mx-auto h-6 bg-blue ">Pending</Badge>
					{/if}
				</div>
			</div>
			<Statusbar monitorData={monitor.checks} />

			<Alert.Description class="my-4"
				><Button
					variant="link"
					on:click={() => {
						goto(`/${$page.params.account_id}/monitors/view/dns/${monitor.monitor_id}`);
					}}>Details</Button
				></Alert.Description
			>
		</Alert.Root>
	{/each}
{/if}
