<script lang="ts">
	import type { PageData } from './$types';
	import * as Alert from '$lib/components/ui/alert';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui//accordion';
	import { CircleDot, CloudFog, RefreshCcw, Trash2 } from 'lucide-svelte';
	import MonitorSheetCreateStandard from '$lib/components/Monitor-Sheet-CreateStandard.svelte';
	import MonitorSheetCreateCode from '$lib/components/Monitor-Sheet-CreateCode.svelte';
	import MonitorSheetCreateDns from '$lib/components/Monitor-Sheet-CreateDNS.svelte';
	import type {
		monitorDNSDBType,
		monitorHTTPCodeDBType,
		monitorHTTPCodeType,
		monitorHTTPStandardDBType,
		monitorHTTPStandardType
	} from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { toast_error_style } from '$lib/utils';
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

	const {
		form: delform,
		errors: delerrors,
		enhance: delenhance
	} = superForm(data.delMonitorForm, {
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
	<MonitorSheetCreateStandard monitorForm={data.monitorStandardform} />
	<MonitorSheetCreateCode monitorForm={data.monitorCodeform} />
	<MonitorSheetCreateDns dnsForm={data.monitorDNSform} />

	<img
		class=" h-1/2 w-1/2 mx-auto mt-auto"
		src="https://assets.hostnamenotifier.com/roommon.png"
		alt="monitor imagge"
	/>
{:else}
	<h2 class="text-xl font-semibold flex flex-row justify-between">
		Standard Monitors <MonitorSheetCreateStandard monitorForm={data.monitorStandardform} />
	</h2>
	<h4 class="text-xs  text-muted-foreground">
		Monitors will trigger if response is not on the range 200 - 299
	</h4>

	{#each StandardHTTPMonitor as monitor}
		<Alert.Root class="m-5">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-xl"
						>{monitor.name}
						<Button variant="link" href={monitor.url}>{monitor.url}</Button></Alert.Title
					>

					<Alert.Title class="text-lg text-muted-foreground">
						<p class="text-sm underline decoration-green-900 text-muted-foreground">
							{Math.floor(monitor.checks[0].status)} at {new Date(
								Math.floor(monitor.checks[0].last_checked)
							).toLocaleString()}
						</p>
					</Alert.Title>
				</div>
				<div class=" flex flex-col gap-4">
					<CircleDot
						class={`mx-auto text-white ${
							monitor.open_incident ? ' fill-destructive' : 'fill-green-700'
						} hover:animate-ping`}
					/>
					{#if monitor.interval === 1 || monitor.interval === 2}
						<p class="text-muted-foreground text-sm">{monitor.interval} minutes</p>
					{:else}
						<p class="text-muted-foreground text-sm">{monitor.interval} seconds</p>
					{/if}
				</div>
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
								<p class=" text-sm text-muted-foreground">{JSON.parse(check.status)}</p>
							</div>
						{/each}
						<Separator class="mb-4" />
						<div class="flex flex-row gap-4">
							<Button variant="ghost"><RefreshCcw class="h-5 hover:animate-spin" /> Refresh</Button>

							<AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]} variant="destructive">
										<Trash2 class="h-4" /> Delete</Button
									>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This will permanently delete your monitor and
											the monitor data from our servers.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<form action="?/deldns" method="POST" use:delenhance>
											<input hidden name="mon_id" value={monitor.monitor_id} />
											<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Alert.Description />
		</Alert.Root>
	{/each}

	<Separator class="mb-4" />

	<h2 class="text-xl font-semibold flex flex-row justify-between">
		Specific Code Monitors <MonitorSheetCreateCode monitorForm={data.monitorCodeform} />
	</h2>
	<h4 class="text-xs  text-muted-foreground">
		Monitors will trigger if response of the specified Status Code
	</h4>

	{#each CodeMonitor as monitor}
		<Alert.Root class="m-5">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-xl"
						>{monitor.name}
						<Button variant="link" href={monitor.url}>{monitor.url}</Button></Alert.Title
					>

					<Alert.Title class="text-lg text-muted-foreground">
						<p class="text-sm underline decoration-green-900 text-muted-foreground">
							{Math.floor(monitor.checks[0].status)} at {new Date(
								Math.floor(monitor.checks[0].last_checked)
							).toLocaleString()}
						</p>
					</Alert.Title>
				</div>
				<div class=" flex flex-col gap-4">
					<CircleDot
						class={`mx-auto text-white ${
							monitor.open_incident ? ' fill-destructive' : 'fill-green-700'
						} hover:animate-ping`}
					/>
					{#if monitor.interval === 1 || monitor.interval === 2}
						<p class="text-muted-foreground text-sm">{monitor.interval} minutes</p>
					{:else}
						<p class="text-muted-foreground text-sm">{monitor.interval} seconds</p>
					{/if}
				</div>
			</div>
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger />
					<AccordionContent
						><h3 class=" text-base font-semibold">Last 3 Checks</h3>
						{#each monitor.checks as check}
							<div class="flex flex-row justify-between leading-3 my-2">
								<p class=" text-sm text-muted-foreground">
									{new Date(Math.floor(check.last_checked)).toLocaleString()}
								</p>
								<p class=" text-sm text-muted-foreground">{JSON.parse(check.status)}</p>
							</div>
						{/each}
						<Separator class="mb-4" />
						<div class="flex flex-row gap-4">
							<Button variant="ghost"><RefreshCcw class="h-5 hover:animate-spin" /> Refresh</Button>

							<AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]} variant="destructive">
										<Trash2 class="h-4" /> Delete</Button
									>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This will permanently delete your monitor and
											the monitor data from our servers.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<form action="?/deldns" method="POST" use:delenhance>
											<input hidden name="mon_id" value={monitor.monitor_id} />
											<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Alert.Description />
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
		<Alert.Root class="m-5">
			<div class="flex flex-row justify-between">
				<div>
					<Alert.Title class="text-xl">{monitor.name}</Alert.Title>
					{#each monitor.ips as ip}
						<Alert.Title
							class={`text-sm ${monitor.open_incident ? ' text-destructive' : 'text-green-700'}`}
							>{ip}</Alert.Title
						>
					{/each}
				</div>
				<div class=" flex flex-col gap-4">
					<CircleDot
						class={`mx-auto text-white ${
							monitor.open_incident ? ' fill-destructive' : 'fill-green-700'
						} hover:animate-ping`}
					/>
					{#if monitor.interval === 1 || monitor.interval === 2}
						<p class="text-muted-foreground text-sm">{monitor.interval} minutes</p>
					{:else}
						<p class="text-muted-foreground text-sm">{monitor.interval} seconds</p>
					{/if}
				</div>
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
						<Separator class="mb-4" />
						<div class="flex flex-row gap-4">
							<Button variant="ghost"><RefreshCcw class="h-5 hover:animate-spin" /> Refresh</Button>

							<AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]} variant="destructive">
										<Trash2 class="h-4" /> Delete</Button
									>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This will permanently delete your monitor and
											the monitor data from our servers.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<form action="?/deldns" method="POST" use:delenhance>
											<input hidden name="mon_id" value={monitor.monitor_id} />
											<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Alert.Description />
		</Alert.Root>
	{/each}
{/if}
