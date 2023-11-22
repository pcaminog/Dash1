<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Button from './ui/button/button.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { toast_error_style } from '$lib/utils';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import Separator from './ui/separator/separator.svelte';
	import Switch from './ui/switch/switch.svelte';
	export let monitorForm;

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
	$: headersString = JSON.stringify(headers)
	$: authString = JSON.stringify(auth);

	let open = false;
	const {
		form: monform,
		errors: monerrors,
		enhance: monenhance
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
		<Button builders={[builder]}><PlusCircle class=" h-4 w-4 mr-2 my-auto" /> New monitor</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="w-full">
		<Sheet.Header class="mb-2">
			<Sheet.Title>New Monitor</Sheet.Title>
			<Sheet.Description class="">Monitor Type</Sheet.Description>
		</Sheet.Header>

		<form action="?/newmonitor" method="POST" use:monenhance>
			<RadioGroup.Root
				value={monitorType}
				onValueChange={(e) => (monitorType = e?.toString() || '')}
			>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="standard" id="Standard" />
					<Label for="Standard">Standard</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="codespecific" id="codespecific" />
					<Label for="r2">Code Specific</Label>
				</div>
				<RadioGroup.Input name="spacing" />
			</RadioGroup.Root>

			{#if monitorType === 'standard'}
				<Alert.Root class="m-5 w-fit">
					<Alert.Title>Standard</Alert.Title>
					<Alert.Description
						>Notifies when the response status code is not in the 2XX success range</Alert.Description
					>
				</Alert.Root>
			{/if}
			{#if monitorType === 'codespecific'}
				<Alert.Root class="m-5 w-fit">
					<Alert.Title>Code Specific</Alert.Title>
					<Alert.Description
						>Notifies when the response differs from a user-specified HTTP status code.</Alert.Description
					>
				</Alert.Root>
			{/if}
			<span id="type-error" aria-live="assertive" class=" text-destructive text-sm">
				{#if $monerrors.type}
					{$monerrors.type}
				{/if}
			</span>
			<input hidden bind:value={monitorType} name="type" />
			<div class="grid md:grid-cols-2 gap-4 my-4">
				<div>
					<Label>Name</Label><Input
						name="name"
						autocomplete="off"
						bind:value={$monform.name}
						aria-describedby={$monerrors.name ? 'name-error name-desc' : 'name-desc'}
						aria-invalid={$monerrors.name ? 'true' : undefined}
					/>
					<span id="name-description" aria-live="assertive" class=" text-muted-foreground text-sm">
						{#if !$monerrors.name}
							Friendly monitor name.
						{/if}
					</span>
					<span id="name-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.name}
							{$monerrors.name}
						{/if}
					</span>
				</div>
				<div>
					<Label>URL</Label><Input
						name="url"
						autocomplete="off"
						bind:value={$monform.url}
						aria-describedby={$monerrors.url ? 'url-error url-desc' : 'url-desc'}
						aria-invalid={$monerrors.url ? 'true' : undefined}
					/>
					<span id="url-description" aria-live="assertive" class=" text-muted-foreground text-sm">
						{#if !$monerrors.url}
							URL to monitor, add a query string to bypass the cache.
						{/if}
					</span>
					<span id="url-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.url}
							{$monerrors.url}
						{/if}
					</span>
				</div>
				{#if monitorType === 'codespecific'}
					<div>
						<Label>Status Code</Label>
						<Input
							name="status_code"
							autocomplete="off"
							bind:value={$monform.status_code}
							aria-describedby={$monerrors.status_code
								? 'status_code-error status_code-desc'
								: 'status_code-desc'}
							aria-invalid={$monerrors.status_code ? 'true' : undefined}
						/>
						<span
							id="status_code-description"
							aria-live="assertive"
							class=" text-muted-foreground text-sm"
						>
							{#if !$monerrors.status_code}
								Status code expteced to receive from Server.
							{/if}
						</span>
						<span id="status_code-error" aria-live="assertive" class=" text-destructive text-sm">
							{#if $monerrors.status_code}
								{$monerrors.status_code}
							{/if}
						</span>
					</div>
				{/if}

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
						{#if !$monerrors.follow_redir}
							Automatically moves to new locations specified by the server.
						{/if}
					</span>
					<span id="follow_redir-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.follow_redir}
							{$monerrors.follow_redir}
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
						{#if !$monerrors.tls_verify}
							Verified that SSL certificate is valid.
						{/if}
					</span>
					<span id="tls_verify-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.tls_verify}
							{$monerrors.tls_verify}
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
							<Select.Item value={24}>24 Hours</Select.Item>
							<Select.Item value={60}>60 min</Select.Item>
							<Select.Item value={5}>5 min</Select.Item>
							<Select.Item value={1}>1 min</Select.Item>
						</Select.Content>
					</Select.Root>
					<span
						id="interval-description"
						aria-live="assertive"
						class=" text-muted-foreground text-sm"
					>
						{#if !$monerrors.interval}
							How often the URL will be monitored.
						{/if}
					</span>
					<span id="interval-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.interval}
							{$monerrors.interval}
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
						{#if !$monerrors.req_timeout}
							Time to establish a connection and the time to receive a response.
						{/if}
					</span>

					<span id="req_timeout-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.req_timeout}
							{$monerrors.req_timeout}
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
						{#if !$monerrors.method}
							HTTP Method used to make the request
						{/if}
					</span>

					<span id="method-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.method}
							{$monerrors.method}
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
						{#if !$monerrors.state}
							Add any Authentication header to the request.
						{/if}
					</span>
					<span id="web-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.web}
							{$monerrors.web}
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
						{#if !$monerrors.req_headers}
							Add any Header you many need to the request.
						{/if}
					</span>
					<span id="req_headers-error" aria-live="assertive" class=" text-destructive text-sm">
						{#if $monerrors.req_headers}
							{$monerrors.req_headers}
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
