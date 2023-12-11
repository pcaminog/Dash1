<script lang="ts">
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
	import type { AlertType, monitorHTTPStandardDBType } from '$lib/types';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { QuestionMarkCircled } from 'radix-icons-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import StatusbarDetail from '$lib/components/statusbarDetail.svelte';
	import StatusbarDetailHttpStandard from '$lib/components/statusbarDetailHTTPStandard.svelte';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	let chart: ApexCharts | undefined; // Define chart variable in the outer scope
	let container: HTMLElement;
	let transformedRawChecks: string[][] = [];
	let labels: string[] = [];
	$: if (monitorStats && monitorStats.rawChecks) {
		if (monitorStats.rawChecks.length > 0) {
			transformedRawChecks = monitorStats.rawChecks.map((check) => [
				check.last_checked,
				check.timing
			]);
		}
	}
	$: if (transformedRawChecks) {
		if (transformedRawChecks.length > 0) {
			labels = transformedRawChecks.map((check) => new Date(check[0]).toLocaleString());
		}
	}

	$: console.log(labels);
	let options = {};
	$: if (transformedRawChecks && transformedRawChecks.length > 0) {
		labels = transformedRawChecks.map((check) => new Date(check[0]).toLocaleString());
		options = {
			chart: {
				toolbar: {
					show: false
				},
				type: 'line'
			},

			series: [
				{
					name: 'latency',
					data: transformedRawChecks
				}
			],
			stroke: {
				curve: 'smooth',
				width: 2,
				lineCap: 'round'
			},
			xaxis: {
				type: 'datetime'
			},
			tooltip: {
				x: {
					formatter: function (value: number) {
						return new Date(value).toLocaleString();
					}
				}
			}
		};
		if (chart) {
			chart.updateOptions(options);
		} else {
			onMount(async () => {
				const ApexCharts = (await import('apexcharts')).default;
				chart = new ApexCharts(container, options);
				chart.render();
			});
		}
	}

	let chartData = {};
	export let data: PageData;
	console.log(data);

	let monitorStats: {
		checks: number;
		uptime: number;
		healthy: number;
		rawChecks: {
			last_checked: number;
			status: number;
			url: string;
			timing: number;
		}[];
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

	$: monitorStats = data.monStandard.statistics;

	let StandardMonitor: monitorHTTPStandardDBType;
	$: StandardMonitor = data.monStandard.monitor[0];
	let groupedAlerts = data.monStandard.statistics.alerts.reduce((acc, alert) => {
		if (!acc[alert.alert_id]) {
			acc[alert.alert_id] = [];
		}

		if (alert.error_detail && typeof alert.error_detail === 'string') {
			try {
				const parsed = JSON.parse(alert.error_detail);
				if (parsed && typeof parsed === 'object') {
					alert.error_detail = parsed;
				}
			} catch (e) {
				console.error('Error parsing JSON for alert:', alert.alert_id);
			}
		}
		acc[alert.alert_id].push(alert);
		acc[alert.alert_id].sort(
			(a: { created_at: string }, b: { created_at: string }) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		);
		return acc;
	}, {});

	let rawChecksObject = {};
	let isLoading = true;

	$: if (monitorStats && monitorStats.rawChecks) {
		if (monitorStats.rawChecks.length > 0) {
			rawChecksObject = monitorStats.rawChecks.reduce((acc, check) => {
				acc[new Date(check.last_checked).toLocaleString()] = check.timing;
				return acc;
			}, {});
			isLoading = false;
		}
	}

	let mergedAlerts = Object.entries(groupedAlerts).reduce<Record<string, AlertType>>(
		//@ts-expect-error
		(acc: Record<string, unknown>, [key, value]: [string, Array<Record<string, unknown>>]) => {
			acc[key] = value.reduce<Record<string, unknown>>(
				(merged: Record<string, unknown>, current: Record<string, unknown>) => {
					const newState = { ...merged, ...current };
					if (current.state) {
						newState[`is${current.state}`] = true;
						newState[`is${current.state}_time`] = current.created_at;
						if (current.error_detail) {
							newState[`error_detail_${current.state}`] = current.error_detail;
						}
					}
					return newState;
				},
				{}
			);
			return acc;
		},
		{}
	);
</script>

<div class="grid grid-cols-6 gap-4">
	<div class=" col-span-4 grid grid-cols-4 h-fit gap-4">
		<Card.Root class="ring-1 ring-green-600">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">State</Card.Title>
				<PowerCircle class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{StandardMonitor.mon_status.charAt(0).toUpperCase() + StandardMonitor.mon_status.slice(1)}
				</div>
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
		<Card.Root class="col-span-4 overflow-hidden">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class=" font-medium mb-3">Uptime</Card.Title>
			</Card.Header>
			<Card.Content>
				<StatusbarDetailHttpStandard monitorData={monitorStats.rawChecks} />
			</Card.Content>
			<Card.Footer class="font-medium ">Last 50 checks</Card.Footer>
		</Card.Root>
		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>Latency</Card.Title>
			</Card.Header>
			<Card.Content>
				<div bind:this={container} />
			</Card.Content>
		</Card.Root>
		<Card.Root class="col-span-4">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class=" font-medium">Activity check log</Card.Title>
			</Card.Header>
			<Card.Content>
				<Table.Root class="table-auto">
					<Table.Caption>Activity logs from the last checks</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head>Event</Table.Head>
							<Table.Head>URL</Table.Head>
							<Table.Head>HTTP Status</Table.Head>
							<Table.Head>Latency</Table.Head>
							<Table.Head>Time</Table.Head>
							<Table.Head>Monitor Status</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each monitorStats.rawChecks.slice(0, 25) as check}
							<Table.Row>
								<Table.Cell>Check</Table.Cell>
								<Table.Cell>{check.url}</Table.Cell>
								<Table.Cell>{check.status}</Table.Cell>
								<Table.Cell>{check.timing} ms</Table.Cell>
								<Table.Cell>
									{#if check.status >= 200 && check.status <= 299}
										<Badge class="w-fit mx-auto h-6 bg-green-600 hover:bg-green-800 ">Healthy</Badge
										>
									{:else if check.status < 200 || check.status > 299}
										<Badge class="w-fit mx-auto h-6 bg-destructive ">Critical</Badge>
									{:else}
										<Badge class="w-fit mx-auto h-6 bg-blue ">Pending</Badge>
									{/if}
								</Table.Cell>
								<Table.Cell>{new Date(check.last_checked).toLocaleString()}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
	<!-- <Card.Root class="col-span-2 h-fit">
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Alerts</Card.Title>
			<AlertTriangle class="h-4 w-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content>
			<p class="text-xs text-muted-foreground">Active</p>
			<Accordion.Root class="w-full ">
				{#each Object.values(mergedAlerts) as alert}
					{#if alert.isActive}
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
										<!-- <span
											class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
											aria-hidden="true"
										/> -->
	<!-- <div class="relative flex space-x-3">
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
													<XOctagon class=" h-8 w-8 ring-8 ring-white bg-white text-green-600" />
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
					{/if}
				{/each}
			</Accordion.Root>
			<Separator class="my-2" />
			<p class="text-xs mb-4 text-muted-foreground">Closed</p> -->
	<!-- <Accordion.Root class="w-full ">
				{#each Object.values(mergedAlerts) as alert}
					{#if !alert.isActive}
						<Accordion.Item value={alert.alert_id}>
							<Accordion.Trigger class="truncate text-xs"
								>{new Date(alert.isopened_time).toLocaleString() +
									' - ' +
									alert.alert_id}</Accordion.Trigger
							>
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
			</Accordion.Root> -->
	<!-- </Card.Content>
	</Card.Root> -->
</div>
