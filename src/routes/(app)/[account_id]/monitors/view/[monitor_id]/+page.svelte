<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';

	import {
		AlertOctagon,
		AlertTriangle,
		CandlestickChart,
		CheckCheck,
		ChevronsUp,
		Fingerprint,
		Info,
		PowerCircle,
		XOctagon
	} from 'lucide-svelte';
	import type { monitorDNSDBType } from '$lib/types';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { QuestionMarkCircled } from 'radix-icons-svelte';

	export let data: PageData;
	console.log(data);
	let monitorStats: {
		checks: number;
		uptime: number;
		healthy: number;
		alerts: {
			alert_id: string;
			account_id: string;
			closed_at: string | null;
			created_at: string;
			error_detail: string;
			isActive: number;
			monitor_id: string;
			state: string;
		}[];
	};
	$: monitorStats = data.monDns.statistics;
	let DNSMonitor: monitorDNSDBType;

	$: {
		DNSMonitor = {
			...data.monDns.monitor[0],
			ips: JSON.parse(data.monDns.monitor[0].ips)
		};
	}
	let groupedAlerts = data.monDns.statistics.alerts.reduce((acc, alert) => {
		if (!acc[alert.alert_id]) {
			acc[alert.alert_id] = [];
		}
		if (alert.error_detail) {
			try {
				alert.error_detail = JSON.parse(alert.error_detail);
			} catch (e) {
				console.error('Error parsing JSON for alert:', alert.alert_id);
			}
		}
		acc[alert.alert_id].push(alert);
		acc[alert.alert_id].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
		return acc;
	}, {});

	let mergedAlerts = Object.entries(groupedAlerts).reduce((acc, [key, value]) => {
		acc[key] = value.reduce((merged, current) => {
			const newState = { ...merged, ...current };
			if (current.state) {
				newState[`is${current.state}`] = true;
				newState[`is${current.state}_time`] = current.created_at;
				if (current.error_detail) {
					newState[`error_detail_${current.state}`] = current.error_detail;
				}
			}
			return newState;
		}, {});
		return acc;
	}, {});
	$: console.log(mergedAlerts);
</script>

<div class="grid grid-cols-6 gap-4">
	<div class=" col-span-4 grid grid-cols-4 h-fit gap-4">
		<Card.Root class="ring-1 ring-green-600">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">State</Card.Title>
				<PowerCircle class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{DNSMonitor.mon_status}</div>
			</Card.Content>
		</Card.Root>
		<Card.Root
			class={monitorStats.healthy === 1 ? 'ring-1 ring-green-600' : 'ring-1  ring-destructive'}
		>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Status</Card.Title>
				<CandlestickChart class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				{#if monitorStats.healthy === 1}
					<div class="text-2xl font-bold">Healthy</div>
				{:else}
					<div class="text-2xl font-bold">Critical</div>
				{/if}
				<p class="text-xs text-muted-foreground">Since ...</p>
			</Card.Content>
		</Card.Root>
		<Card.Root
			class={monitorStats.uptime < 70
				? 'ring-1 ring-destructive'
				: monitorStats.uptime >= 90
				? 'ring-1 ring-green-600'
				: 'ring-1  ring-orange-600'}
		>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Uptime</Card.Title>
				<ChevronsUp class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{monitorStats.uptime}%</div>
				<p class="text-xs text-muted-foreground">Last 24 hours</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Checks</Card.Title>
				<CheckCheck class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{monitorStats.checks}</div>
				<p class="text-xs text-muted-foreground">Last 24 hours</p>
			</Card.Content>
		</Card.Root>
	</div>
	<Card.Root class="col-span-2">
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Alerts</Card.Title>
			<AlertTriangle class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<p class="text-xs text-muted-foreground">Active</p>

			{#each monitorStats.alerts as alert}
				{#if alert.isActive}
					{alert.created_at}
					{alert.closed_at}
					{alert.alert_id}
					{alert.error_detail}
					{alert.state}
				{/if}
			{/each}
			<Separator class="my-2" />
			<p class="text-xs mb-4 text-muted-foreground">Closed</p>
			<Accordion.Root class="w-full ">
				{#each Object.values(mergedAlerts) as alert}
					{#if !alert.isActive}
						<Accordion.Item value={alert.alert_id}>
							<Accordion.Trigger>{alert.alert_id}</Accordion.Trigger>
							<Accordion.Content>
								<div class="flow-root m-4">
									<ul role="list" class="-mb-8">
										<li>
											<div class="relative pb-8">
												<span
													class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
													aria-hidden="true"
												/>
												<div class="relative flex space-x-3">
													<div>
														<AlertOctagon
															class=" h-8 w-8 ring-8 ring-white bg-white text-destructive"
														/>
													</div>
													<div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
														<div>
															<p class="text-sm text-gray-500">
																Alert created at {new Date(alert.isopened_time).toLocaleString()}
															</p>
														</div>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="relative pb-8">
												<span
													class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
													aria-hidden="true"
												/>
												<div class="relative flex space-x-3">
													<div>
														<Fingerprint class=" h-8 w-8 ring-8 ring-white bg-white " />
													</div>
													<div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
														<div>
															<p class="text-sm text-gray-500">
																Alert ID: {alert.alert_id}
															</p>
														</div>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="relative pb-8">
												<span
													class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
													aria-hidden="true"
												/>
												<div class="relative flex space-x-3">
													<div>
														<Info class=" h-8 w-8 ring-8 ring-white bg-white " />
													</div>
													<div class=" min-w-0 flex-1 justify-between space-x-4 pt-1.5">
														<div>
															<p class="text-sm text-gray-500">Details</p>
														</div>
														<div class="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
															<div class="flex justify-between gap-x-4" />
															<p class="text-sm leading-6 text-gray-500">
																{#if alert.error_detail_opened}
																	<p class="text-xs text-muted-foreground">
																		Added IPs: {alert.error_detail_opened.addedIPs.join(', ')}
																	</p>
																	<p class="text-xs text-muted-foreground">
																		Removed IPs: {alert.error_detail_opened.removedIPs.join(', ')}
																	</p>
																{/if}
															</p>
														</div>
													</div>
												</div>
											</div>
										</li>
										{#if alert.state !== 'opened' && alert.state !== 'closed'}
											<li>
												<div class="relative pb-8">
													<span
														class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
														aria-hidden="true"
													/>
													<div class="relative flex space-x-3">
														<div>
															<QuestionMarkCircled
																class=" h-8 w-8 ring-8 ring-white bg-white text-green-600"
															/>
														</div>
														<div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
															<div>
																<p class="text-sm text-gray-500">
																	New Alert state: {alert.state}
																</p>
															</div>
														</div>
													</div>
												</div>
											</li>
										{/if}
										{#if alert.isclosed}
											<li>
												<div class="relative pb-8">
													<div class="relative flex space-x-3">
														<div>
															<XOctagon
																class=" h-8 w-8 ring-8 ring-white bg-white text-green-600"
															/>
														</div>
														<div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
															<div>
																<p class="text-sm text-gray-500">
																	Closed at: {new Date(alert.isclosed_time).toLocaleString()}
																</p>
															</div>
														</div>
													</div>
												</div>
											</li>
										{/if}
									</ul>
								</div>
							</Accordion.Content>
						</Accordion.Item>
					{/if}
				{/each}
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</div>
