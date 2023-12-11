<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Button from './ui/button/button.svelte';
	import { ArrowDown, ArrowUp, PlusCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { toast_error_style } from '$lib/utils';
	import * as Select from '$lib/components/ui/select';
	import Separator from './ui/separator/separator.svelte';
	import Switch from './ui/switch/switch.svelte';
	export let monitorForm;
	let checksUpSelect = '';
	let checksDownSelect = '';
	let intervalSelect = '';
	let tls_verify = false;
	let follow_redir = true;
	let methodSelect = '';
	let req_timeoutSelect = '';

	let headers = [{ name: '', value: '' }];
	let auth = { name: '', value: '' };
	let monitorType = '';

	$: {
		// Whenever a header is filled, add a new empty header
		if (headers[headers.length - 1].name && headers[headers.length - 1].value) {
			headers = [...headers, { name: '', value: '' }];
		}
	}
	$: headersString = JSON.stringify(headers);
	$: authString = JSON.stringify(auth);

	let open = false;
	const {
		form: codeform,
		errors: codeerrors,
		enhance: codenhance
	} = superForm(monitorForm, {
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
		<Button variant='ghost'  class="w-fit items-start" builders={[builder]}
			><PlusCircle class=" h-4 w-4 my-auto" /></Button
		>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="w-full">
		<Sheet.Header class="mb-2">
			<Sheet.Title>New Monitor</Sheet.Title>
			<Sheet.Description class=""
				>Notifies when the response status code is diferent from the user specified.</Sheet.Description
			>
		</Sheet.Header>

		<form action="?/newcode" method="POST" use:codenhance>
			<input hidden bind:value={monitorType} name="type" />
			<div class="grid md:grid-cols-2 gap-4 my-4">
				<div>
					<Label>Name</Label><Input
						name="name"
						autocomplete="off"
						bind:value={$codeform.name}
						aria-describedby={$codeerrors.name ? 'name-error name-desc' : 'name-desc'}
						aria-invalid={$codeerrors.name ? 'true' : undefined}
					/>
					<span id="name-description" aria-live="assertive" class=" text-muted-foreground text-sm">
						{#if !$codeerrors.name}
							Friendly monitor name.
						{/if}
					</span>
					<span id="name-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.name}
							{$codeerrors.name}
						{/if}
					</span>
				</div>
				{#if monitorType === 'dns'}
					<div>
						<Label>Hostname</Label><Input
							name="hostname"
							autocomplete="off"
							bind:value={$codeform.url}
							aria-describedby={$codeerrors.url ? 'url-error url-desc' : 'url-desc'}
							aria-invalid={$codeerrors.url ? 'true' : undefined}
						/>
						<span id="url-description" aria-live="assertive" class=" text-muted-foreground text-sm">
							{#if !$codeerrors.url}
								URL to monitor, add a query string to bypass the cache.
							{/if}
						</span>
						<span id="url-error" aria-live="assertive" class=" text-destructive text-sm">
							{#if $codeerrors.url}
								{$codeerrors.url}
							{/if}
						</span>
					</div>
				{:else}
					<div>
						<Label>URL</Label><Input
							name="url"
							autocomplete="off"
							bind:value={$codeform.url}
							aria-describedby={$codeerrors.url ? 'url-error url-desc' : 'url-desc'}
							aria-invalid={$codeerrors.url ? 'true' : undefined}
						/>
						<span id="url-description" aria-live="assertive" class=" text-muted-foreground text-sm">
							{#if !$codeerrors.url}
								URL to monitor, add a query string to bypass the cache.
							{/if}
						</span>
						<span id="url-error" aria-live="assertive" class=" text-destructive text-sm">
							{#if $codeerrors.url}
								{$codeerrors.url}
							{/if}
						</span>
					</div>
				{/if}
				<div>
					<Label>Status Code</Label>
					<Input
						name="status_code"
						autocomplete="off"
						bind:value={$codeform.status_code}
						aria-describedby={$codeerrors.status_code
							? 'status_code-error status_code-desc'
							: 'status_code-desc'}
						aria-invalid={$codeerrors.status_code ? 'true' : undefined}
					/>
					<span
						id="status_code-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$codeerrors.status_code}
							Status code expteced to receive from Server.
						{/if}
					</span>
					<span id="status_code-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.status_code}
							{$codeerrors.status_code}
						{/if}
					</span>
				</div>

				<Separator class="col-span-2" />
				<div>
					<div class="flex flex-row justify-between">
						<Label>Follow Redirects</Label>

						<Switch
							class="mt-auto"
							onCheckedChange={() => {
								follow_redir = !follow_redir;
							}}
						/>
						<input hidden bind:value={follow_redir} name="follow_redir" />
					</div>
					<span
						id="follow_redir-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$codeerrors.follow_redir}
							Automatically moves to new locations specified by the server.
						{/if}
					</span>
					<span id="follow_redir-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.follow_redir}
							{$codeerrors.follow_redir}
						{/if}
					</span>
				</div>
				<div>
					<div class="flex flex-row justify-between">
						<Label>SSL/TLS verification</Label>
						<Switch
							class="mt-auto"
							onCheckedChange={() => {
								tls_verify = !tls_verify;
							}}
						/>
						<input hidden bind:value={tls_verify} name="ssl_verify" />
					</div>
					<span
						id="tls_verify-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$codeerrors.tls_verify}
							Verified that SSL certificate is valid.
						{/if}
					</span>
					<span id="tls_verify-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.tls_verify}
							{$codeerrors.tls_verify}
						{/if}
					</span>
				</div>
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
							<Select.Value placeholder="Select an interval" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value={5}>5 Minutes</Select.Item>
							<Select.Item value={1}>1 Minute</Select.Item>
							<Select.Item value={2}>2 Minutes</Select.Item>
						</Select.Content>
					</Select.Root>
					<span
						id="interval-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$codeerrors.interval}
							How often the hostname will be monitored.
						{/if}
					</span>
					<span id="interval-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.interval}
							{$codeerrors.interval}
						{/if}
					</span>
				</div>

				<div>
					<Label>Request Timeout</Label><Select.Root
						name="req_timeout"
						onSelectedChange={(value) => {
							// @ts-expect-error
							req_timeoutSelect = value?.value;
						}}
					>
						<input hidden bind:value={req_timeoutSelect} name="req_timeout" />

						<Select.Trigger type="button" class="w-full">
							<Select.Value placeholder="Select a timeout" />
						</Select.Trigger>

						<Select.Content>
							<Select.Item value={1}>1 Minutes</Select.Item>
							<Select.Item value={30}>30 Seconds</Select.Item>
							<Select.Item value={15}>15 Seconds</Select.Item>
							<Select.Item value={5}>5 Seconds</Select.Item>
							<Select.Item value={2}>2 Seconds</Select.Item>
						</Select.Content>
					</Select.Root>
					<span
						id="req_timeout-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$codeerrors.req_timeout}
							Time to establish a connection and the time to receive a response.
						{/if}
					</span>

					<span id="req_timeout-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.req_timeout}
							{$codeerrors.req_timeout}
						{/if}
					</span>
				</div>
				<div>
					<Label>HTTP Method</Label><Select.Root
						name="method"
						onSelectedChange={(value) => {
							// @ts-expect-error
							methodSelect = value?.value;
						}}
					>
						<input hidden bind:value={methodSelect} name="method" />

						<Select.Trigger type="button" class="w-full">
							<Select.Value placeholder="Select a method" />
						</Select.Trigger>

						<Select.Content>
							<Select.Item value="get">GET</Select.Item>
							<Select.Item value="post">POST</Select.Item>
							<Select.Item value="put">PUT</Select.Item>
							<Select.Item value="delete">DELETE</Select.Item>
							<Select.Item value="patch">PATCH</Select.Item>
							<Select.Item value="head">HEAD</Select.Item>
						</Select.Content>
					</Select.Root>
					<span
						id="method-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$codeerrors.method}
							HTTP Method used to make the request
						{/if}
					</span>

					<span id="method-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.method}
							{$codeerrors.method}
						{/if}
					</span>
				</div>
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
								<Select.Value placeholder="Number of successfull checks" />
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
						{#if !$codeerrors.checks_up}
							How many successfull checks before automatically declare the monitor Up.
						{/if}
					</span>
					<span id="checks_up-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.checks_up}
							{$codeerrors.checks_up}
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
								<Select.Value placeholder="Number of failed checks" />
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
						{#if !$codeerrors.checks_down}
							How many failed checks before automatically declare the monitor Down.
						{/if}
					</span>
					<span id="checks_down-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.checks_down}
							{$codeerrors.checks_down}
						{/if}
					</span>
				</div>

				<Separator class="col-span-2" />

				<div>
					<Label>HTTP Authentication</Label>
					<div class="flex flex-row gap-4">
						<div>
							<Label>Name</Label>
							<Input type="text" bind:value={auth.name} />
						</div>
						<div>
							<Label>Value</Label>
							<Input type="text" bind:value={auth.value} />
						</div>
					</div>
					<input hidden bind:value={authString} name="authentication" />

					<span id="state-description" aria-live="assertive" class=" text-muted-foreground text-sm">
						{#if !$codeerrors.state}
							Add any Authentication header to the request.
						{/if}
					</span>
					<span id="web-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.web}
							{$codeerrors.web}
						{/if}
					</span>
				</div>
				<div>
					<Label>Request Headers</Label>
					{#each headers as header (headers.indexOf(header))}
						<div class="flex flex-row gap-4">
							<div>
								<Label>Name</Label>
								<Input type="text" bind:value={header.name} />
							</div>
							<div>
								<Label>Value</Label>
								<Input type="text" bind:value={header.value} />
							</div>
						</div>
					{/each}
					<input hidden bind:value={headersString} name="req_headers" />

					<span
						id="req_headers-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$codeerrors.req_headers}
							Add any Header you many need to the request.
						{/if}
					</span>
					<span id="req_headers-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $codeerrors.req_headers}
							{$codeerrors.req_headers}
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
