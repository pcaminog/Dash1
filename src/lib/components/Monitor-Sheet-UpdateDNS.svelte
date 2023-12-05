<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Button from './ui/button/button.svelte';
	import { ArrowDown, ArrowUp, PlusCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { toast_error_style } from '$lib/utils';
	import Separator from './ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { DNSResponse, monitorDNSDBType } from '$lib/types';
	import { writable } from 'svelte/store';

	export let dnsForm;

	export let monData: monitorDNSDBType;
	let checksUpSelect = '';
	let checksDownSelect = '';
	let intervalSelect = '';
	let IPs_client = writable([]);
	let IPs_error: number = 0;
	monData.ips.forEach((data: { data: string }) => {
		IPs_client.update((value) => [...value, data]);
	});

	export async function checkDNSHostname(hostname: string) {
		const getDNS = await fetch(`https://1.1.1.1/dns-query?name=${hostname}`, {
			headers: {
				accept: 'application/dns-json'
			}
		});
		const { Answer, Status } = await (getDNS.json() as Promise<DNSResponse>);
		if (Status === 0) {
			Answer.forEach((data: { data: string }) => {
				if (data.type === 1) {
					IPs_client.update((value) => [...value, data.data]);
				}
			});
		} else {
			IPs_error = Status;
		}
	}

	let open = false;
	const {
		form: updatednsform,
		errors: updatednsformerrors,
		enhance: updatednsformenhance
	} = superForm(dnsForm, {
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Monitor created succesfully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
				open = false;
			}
		}
	});
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]}>Update</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="w-full">
		<Sheet.Header class="mb-2">
			<Sheet.Title>Update Monitor</Sheet.Title>
		</Sheet.Header>

		<form action="?/updatedns" method="POST" use:updatednsformenhance>
			<div class="grid md:grid-cols-2 gap-4 my-4">
				<div>
					<Label>Name</Label><Input
						name="name"
						autocomplete="off"
						placeholder={monData.name}
						bind:value={$updatednsform.name}
						aria-describedby={$updatednsformerrors.name ? 'name-error name-desc' : 'name-desc'}
						aria-invalid={$updatednsformerrors.name ? 'true' : undefined}
					/>
					<span id="name-description" aria-live="assertive" class=" text-muted-foreground text-sm">
						{#if !$updatednsformerrors.name}
							Friendly monitor name.
						{/if}
					</span>
					<span id="name-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $updatednsformerrors.name}
							{$updatednsformerrors.name}
						{/if}
					</span>
				</div>
				<div />
				<div>
					<Label>Hostname</Label><Input
						name="hostname"
						autocomplete="off"
						on:change={(e) => {
							$IPs_client = [];
							checkDNSHostname(e.target.value);
						}}
						placeholder={monData.hostname}
						bind:value={$updatednsform.hostname}
						aria-describedby={$updatednsformerrors.hostname ? 'url-error url-desc' : 'url-desc'}
						aria-invalid={$updatednsformerrors.hostname ? 'true' : undefined}
					/>
					<span
						id="hostname-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$updatednsformerrors.hostname}
							Hostname to monitor
						{/if}
					</span>
					<span id="hostname-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $updatednsformerrors.hostname}
							{$updatednsformerrors.hostname}
						{/if}
					</span>
				</div>

				<Separator class="col-span-2" />

				<div class=" col-span-2">
					<Label>IP addresses</Label>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each $IPs_client as ip, index}
							<div>
								<Label>IP Address {index + 1}</Label>
								<Input type="text" bind:value={ip} />
							</div>
						{/each}
					</div>
					<input hidden bind:value={$IPs_client} name="IPs" />

					<span id="IPs-description" aria-live="assertive" class=" text-muted-foreground text-sm">
						{#if !$updatednsformerrors.IPs}
							Type the hostname first, you can add any IP address.
						{/if}
					</span>
					<span id="IPs-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $updatednsformerrors.IPs}
							{$updatednsformerrors.IPs}
						{/if}
					</span>
				</div>
				<Separator class="col-span-2" />
				<div>
					<Label>Interval</Label>
					<Select.Root
						name="interval"
						onSelectedChange={(value) => {
							// @ts-expect-error
							intervalSelect = value?.value;
						}}
					>
						<input hidden bind:value={intervalSelect} name="interval" />

						<Select.Trigger type="button" class="w-full">
							<Select.Value placeholder={monData.interval} />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value={30}>30 Seconds</Select.Item>
							<Select.Item value={1}>1 Minute</Select.Item>
							<Select.Item value={2}>2 Minutes</Select.Item>
						</Select.Content>
					</Select.Root>
					<span
						id="interval-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$updatednsformerrors.interval}
							How often the hostname will be monitored.
						{/if}
					</span>
					<span id="interval-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $updatednsformerrors.interval}
							{$updatednsformerrors.interval}
						{/if}
					</span>
				</div>
				<div />
				<div>
					<div>
						<Label
							><div class="flex">Declare Up <ArrowUp class=" text-green my-auto h-4" /></div></Label
						>
						<Select.Root
							name="checks_up"
							onSelectedChange={(value) => {
								// @ts-expect-error
								checksUpSelect = value?.value;
							}}
						>
							<input hidden bind:value={checksUpSelect} name="checks_up" />

							<Select.Trigger type="button" class="w-full">
								<Select.Value placeholder={monData.checks_up} />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={1}>1</Select.Item>
								<Select.Item value={2}>2</Select.Item>
								<Select.Item value={3}>3</Select.Item>
								<Select.Item value={4}>4</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<span
						id="checks_up-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$updatednsformerrors.checks_up}
							How many successfull checks before automatically declare the monitor Up.
						{/if}
					</span>
					<span id="checks_up-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $updatednsformerrors.checks_up}
							{$updatednsformerrors.checks_up}
						{/if}
					</span>
				</div>
				<div>
					<div>
						<Label
							><div class="flex">
								Declare Down <ArrowDown class=" text-destructive my-auto h-4" />
							</div></Label
						>
						<Select.Root
							name="checks_down"
							onSelectedChange={(value) => {
								// @ts-expect-error
								checksDownSelect = value?.value;
							}}
						>
							<input hidden bind:value={checksDownSelect} name="checks_down" />

							<Select.Trigger type="button" class="w-full">
								<Select.Value placeholder={monData.checks_down} />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={1}>1</Select.Item>
								<Select.Item value={2}>2</Select.Item>
								<Select.Item value={3}>3</Select.Item>
								<Select.Item value={4}>4</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<span
						id="checks_down-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$updatednsformerrors.checks_down}
							How many failed checks before automatically declare the monitor Down.
						{/if}
					</span>
					<span id="checks_down-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $updatednsformerrors.checks_down}
							{$updatednsformerrors.checks_down}
						{/if}
					</span>
				</div>
			</div>

			<Sheet.Footer>
				<Sheet.Close asChild let:builder>
					<Button type="submit">Submit</Button>
				</Sheet.Close>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
