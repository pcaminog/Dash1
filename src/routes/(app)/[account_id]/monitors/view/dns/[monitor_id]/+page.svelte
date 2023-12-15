<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import {
		AlertOctagon,
		AlertTriangle,
		CalendarDays,
		CandlestickChart,
		CheckCheck,
		ChevronsUp,
		Edit,
		Fingerprint,
		Info,
		Link2,
		Pause,
		Pencil,
		Play,
		PowerCircle,
		Timer,
		Trash2,
		XOctagon
	} from 'lucide-svelte';
	import type { AlertType, monitorDNSDBType } from '$lib/types';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { QuestionMarkCircled } from 'radix-icons-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import StatusbarDetail from '$lib/components/statusbarDetail.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { page } from '$app/stores';

	export let data: PageData;
	console.log(data);
	let monitorStats: {
		checks: number;
		uptime: number;
		healthy: number;
		rawChecks: {
			last_checked: number;
			ok: boolean;
			ips: string;
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

<BackButton />
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
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Set IPs</Card.Title>
				<Link2 class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-xs truncate">
					<p>{DNSMonitor.ips}</p>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Interval</Card.Title>
				<Timer class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-xs">
					{DNSMonitor.interval} minutes
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Name</Card.Title>
				<Pencil class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-xs">
					{DNSMonitor.name}
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Created at</Card.Title>
				<CalendarDays class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-xs">
					{DNSMonitor.created_at}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-span-4">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class=" font-medium">Activity check log</Card.Title>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Caption>Activity logs from the last checks</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head>Event</Table.Head>
							<Table.Head>DNS status</Table.Head>
							<Table.Head>DNS response</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Time</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each monitorStats.rawChecks.slice(0, 25) as check}
							<Table.Row>
								<Table.Cell>Check</Table.Cell>
								<Table.Cell>0</Table.Cell>
								<Table.Cell>{data.monDns.monitor[0].ips}</Table.Cell>

								{#if check.ok}
									<Table.Cell><Badge class="bg-green-600">Healthy</Badge></Table.Cell>
								{:else}
									<Table.Cell><Badge class="bg-destructive">Critical</Badge></Table.Cell>
								{/if}
								<Table.Cell>{new Date(check.last_checked).toLocaleString()}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="col-span-2">
		<Card.Root class="col-span-2 h-fit">
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
				<p class="text-xs mb-4 text-muted-foreground">Closed</p>
				<Accordion.Root class="w-full ">
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
				</Accordion.Root>
			</Card.Content>
		</Card.Root>
		<Card.Root class="my-4"
			><Card.Header>
				<Card.Title>Monitor Actions</Card.Title>
			</Card.Header>
			<Card.Content>
				<Button class="font-light"><Edit class="h-4 my-auto" />Edit</Button>

				<AlertDialog.Root>
					<AlertDialog.Trigger asChild let:builder>
						<Button class="font-light" builders={[builder]} variant="destructive">
							<Trash2 class="h-4 my-auto" /> Delete</Button
						>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you sure you want to delete the monitor?</AlertDialog.Title>
							<AlertDialog.Description>
								<p>
									This action is irreversible and will permanently remove the monitor, along with
									all its associated data and logs.
								</p>
								<p>
									This means you will lose access to historical HTTP traffic records and analysis.
								</p>
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<form action="?/deletemonitor" method="POST">
								<input hidden name="account_id" value={$page.params.account_id} />
								<input hidden name="monitor_id" value={$page.params.monitor_id} />

								<AlertDialog.Action class="bg-destructive hover:bg-red-700" type="submit"
									>Continue</AlertDialog.Action
								>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>

				<AlertDialog.Root>
					<AlertDialog.Trigger asChild let:builder>
						<Button class="font-light" builders={[builder]} variant="outline">
							<Pause class="h-4 my-auto" /> Pause</Button
						>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you sure you want to pause the monitor?</AlertDialog.Title>
							<AlertDialog.Description>
								This action will temporarily stop monitoring and logging of all HTTP traffic.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<form action="?/pausedmonitor" method="POST">
								<input hidden name="status" value={DNSMonitor.mon_status} />
								<input hidden name="monitor_id" value={$page.params.monitor_id} />

								<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
