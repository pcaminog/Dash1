<script lang="ts">
	import type { monitorHTTPStandardDBType } from "$lib/types";
	import { toast_error_style } from "$lib/utils";
	import toast from "svelte-french-toast";
	import { superForm } from "sveltekit-superforms/client";
    import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	export let StandardMonitor: monitorHTTPStandardDBType;
	export let StandartForm
	import * as Select from '$lib/components/ui/select';
	import { ArrowDown, ArrowUp } from "radix-icons-svelte";
	import Separator from "./ui/separator/separator.svelte";
	import Button from "./ui/button/button.svelte";
	let checksUpSelect = '';
	let checksDownSelect = '';
	let intervalSelect = '';
	let tls_verify = false;
	let follow_redir = true;
	let methodSelect = '';
	let req_timeoutSelect = '';
	let auth = { name: '', value: '' };
	let headers = [{ name: '', value: '' }];
	$: headersString = JSON.stringify(headers);
	$: authString = JSON.stringify(auth);
    const {
		enhance: editenhance,
		errors: editerrors,
		form: editform
	} = superForm(StandartForm, {
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success(form.message, {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});
	let ParsedHeader: string[] = [];
	$: if (StandardMonitor.req_headers) {
		ParsedHeader = JSON.parse(StandardMonitor.req_headers);
	}

</script>

<form action="?/editstandard" method="POST" use:editenhance>
	<div>
		<Label>Name</Label><Input
			name="name"
			autocomplete="off"
			bind:value={$editform.name}
			placeholder={StandardMonitor.name}
			aria-describedby={$editerrors.name ? 'name-error name-desc' : 'name-desc'}
			aria-invalid={$editerrors.name ? 'true' : undefined}
		/>

		<span id="name-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.name}
				{$editerrors.name}
			{/if}
		</span>
	</div>

	<div>
		<Label>URL</Label><Input
			name="url"
			autocomplete="off"
			bind:value={$editform.url}
			placeholder={StandardMonitor.url}
			aria-describedby={$editerrors.url ? 'url-error url-desc' : 'url-desc'}
			aria-invalid={$editerrors.url ? 'true' : undefined}
		/>

		<span id="url-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.url}
				{$editerrors.url}
			{/if}
		</span>
	</div>

	<Separator class="my-4" />
	<div class="my-2">
		<div class="flex flex-row justify-between">
			<Label>Follow Redirects</Label>

			<Switch
				checked={StandardMonitor.follow_redir}
				class="mt-auto"
				onCheckedChange={() => {
					follow_redir = !follow_redir;
				}}
			/>
			<input hidden bind:value={follow_redir} name="follow_redir" />
		</div>

		<span id="follow_redir-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.follow_redir}
				{$editerrors.follow_redir}
			{/if}
		</span>
	</div>
	<div class="my-2">
		<div class="flex flex-row justify-between">
			<Label>SSL/TLS verification</Label>
			<Switch
				checked={StandardMonitor.ssl_verify}
				class="mt-auto"
				onCheckedChange={() => {
					tls_verify = !tls_verify;
				}}
			/>
			<input hidden bind:value={tls_verify} name="ssl_verify" />
		</div>

		<span id="tls_verify-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.ssl_verify}
				{$editerrors.ssl_verify}
			{/if}
		</span>
	</div>
	<div class="my-2">
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
				<Select.Value placeholder={StandardMonitor.interval} />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value={5}>5 Minutes</Select.Item>
				<Select.Item value={1}>1 Minute</Select.Item>
				<Select.Item value={2}>2 Minutes</Select.Item>
			</Select.Content>
		</Select.Root>

		<span id="interval-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.interval}
				{$editerrors.interval}
			{/if}
		</span>
	</div>

	<div class="my-2">
		<Label>Request Timeout</Label><Select.Root
			name="req_timeout"
			onSelectedChange={(value) => {
				// @ts-expect-error
				req_timeoutSelect = value?.value;
			}}
		>
			<input hidden bind:value={req_timeoutSelect} name="req_timeout" />

			<Select.Trigger type="button" class="w-full">
				<Select.Value placeholder={StandardMonitor.req_timeout} />
			</Select.Trigger>

			<Select.Content>
				<Select.Item value={1}>1 Minutes</Select.Item>
				<Select.Item value={30}>30 Seconds</Select.Item>
				<Select.Item value={15}>15 Seconds</Select.Item>
				<Select.Item value={5}>5 Seconds</Select.Item>
				<Select.Item value={2}>2 Seconds</Select.Item>
			</Select.Content>
		</Select.Root>

		<span id="req_timeout-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.req_timeout}
				{$editerrors.req_timeout}
			{/if}
		</span>
	</div>
	<div class="my-2">
		<Label>HTTP Method</Label><Select.Root
			name="method"
			onSelectedChange={(value) => {
				// @ts-expect-error
				methodSelect = value?.value;
			}}
		>
			<input hidden bind:value={methodSelect} name="method" />

			<Select.Trigger type="button" class="w-full">
				<Select.Value placeholder={StandardMonitor.method.toUpperCase()} />
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

		<span id="method-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.method}
				{$editerrors.method}
			{/if}
		</span>
	</div>
	<div class="my-2">
		<div>
			<Label
				><div class="flex">
					Declare Up <ArrowUp class=" text-green-500 my-auto h-4" />
				</div></Label
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
					<Select.Value placeholder={StandardMonitor.checks_up} />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={1}>1</Select.Item>
					<Select.Item value={2}>2</Select.Item>
					<Select.Item value={3}>3</Select.Item>
					<Select.Item value={4}>4</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<span id="checks_up-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.checks_up}
				{$editerrors.checks_up}
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
					<Select.Value placeholder={StandardMonitor.checks_down} />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={1}>1</Select.Item>
					<Select.Item value={2}>2</Select.Item>
					<Select.Item value={3}>3</Select.Item>
					<Select.Item value={4}>4</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<span id="checks_down-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.checks_down}
				{$editerrors.checks_down}
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
			{#if !$editerrors.state}
				Add any Authentication header to the request.
			{/if}
		</span>
		<span id="web-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.web}
				{$editerrors.web}
			{/if}
		</span>
	</div>
	<div>
		<Label>Request Headers</Label>
		{#each ParsedHeader as header}
			<div class="flex flex-row gap-4">
				<div>
					<Label>Name</Label>
					<Input placeholder={header.name} type="text" bind:value={header.name} />
				</div>
				<div>
					<Label>Value</Label>
					<Input placeholder={header.value} type="text" bind:value={header.value} />
				</div>
			</div>
		{/each}
		<input hidden bind:value={headersString} name="req_headers" />

		<span id="req_headers-description" aria-live="assertive" class=" text-muted-foreground text-sm">
			{#if !$editerrors.req_headers}
				Add any Header you many need to the request.
			{/if}
		</span>
		<span id="req_headers-error" aria-live="assertive" class=" text-destructive text-sm">
			{#if $editerrors.req_headers}
				{$editerrors.req_headers}
			{/if}
		</span>
	</div>

	<Button type="submit">Update</Button>
</form>
