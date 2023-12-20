<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Blocks, BookLock, Check, Mail, Slack, Trash2, Webhook, X } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { toast_error_style } from '$lib/utils';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { page } from '$app/stores';
	let isBlurred = true;
	export let data: PageData;
	console.log(data);

	const { enhance: emailenhance } = superForm(data.email, {
		id: 'send-email',
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Verification Email sent', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: notimainenhance } = superForm(data.emaildel, {
		id: 'delete-email',
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Email deleted succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: resendenhance } = superForm(data.emailres, {
		id: 'resend-email',
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Validation email send succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: createwebenhance } = superForm(data.createwebhooks, {
		id: 'create-web',
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Validation email send succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: validwebenhance } = superForm(data.validatewebhooks, {
		id: 'validate-web',

		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Validation email send succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: delwebenhance } = superForm(data.deletewebhooks, {
		id: 'delete-web',
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Validation email send succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});
</script>

<h2 class="text-xl font-semibold flex flex-row justify-between">
	<div class=" flex"><Mail class="my-auto mr-2" />Email Recipients</div>
</h2>
<h4 class="text-xs text-muted-foreground">Add emails to be notified.</h4>
<Card.Root class="my-2">
	<Card.Content>
		<form method="POST" action="?/validationemail" use:emailenhance class="my-2">
			<Label>Email</Label>
			<div class="flex flex-row gap-4">
				<Input name="email" class="w-fit" />
				<Button type="submit">Validate</Button>
			</div>
			<div class="grid w-full items-center gap-4" />
		</form>

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Email</Table.Head>
					<Table.Head>Verified</Table.Head>
					<Table.Head />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.Notiemails as email}
					<Table.Row>
						<Table.Cell class="font-medium">{email.email}</Table.Cell>
						{#if Math.floor(email.verified) === 1}
							<Table.Cell><Check class=" text-green-600 h-4" /></Table.Cell>
						{:else}
							<Table.Cell><X class=" text-destructive" /></Table.Cell>
						{/if}

						{#if Math.floor(email.verified) === 1}
							<Table.Cell />

							<Table.Cell class="text-right">
								<form action="?/deleteemail" method="POST" use:notimainenhance>
									<input hidden name="email" value={email.email} />
									<Button type="submit" variant="outline"
										><Trash2 class="h-4 text-destructive" /></Button
									>
								</form>
							</Table.Cell>
						{:else}
							<Table.Cell class="text-right">
								<form action="?/resendEmail" method="POST" use:resendenhance>
									<input hidden name="email" value={email.email} />
									<Button type="submit">Re-Send</Button>
								</form>
							</Table.Cell>
							<Table.Cell class="text-right">
								<form action="?/deleteemail" method="POST" use:notimainenhance>
									<input hidden name="email" value={email.email} />
									<Button type="submit" variant="outline">
										<Trash2 class="h-4 text-destructive" /></Button
									>
								</form>
							</Table.Cell>
						{/if}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
<h2 class="text-xl font-semibold flex flex-row justify-between  mt-10">
	<div class=" flex"><Webhook class="my-auto mr-2" />Webhooks Endpoints</div>
</h2>
<h4 class="text-xs text-muted-foreground">Add a webhook enpoint to be notified</h4>
<Card.Root class="my-2">
	<Card.Content>
		<form method="POST" action="?/createwebhook" use:createwebenhance class="my-2">
			<Label>URL</Label>
			<div class="flex flex-row gap-4">
				<Input name="url" class="w-full" />
				<Button type="submit">Add</Button>
			</div>
			<div class="grid w-full items-center gap-4" />
		</form>

		<p class="text-muted-foreground text-sm">
			To guarantee the security of our communications, each webhook endpoint needs to go through a
			verification procedure prior to the dispatch of any events.
		</p>
		<p class="text-muted-foreground text-sm">The steps for this verification are as follows:</p>
		<ul class="list-decimal text-sm text-muted-foreground px-7">
			<li class="gap-x-3">Provide your endpoint URL where you wish to receive webhook events.</li>
			<li class="gap-x-3">We will supply you with a unique validation token.</li>
			<li class="gap-x-3">Append this token to your endpoint URL.</li>
			<li class="gap-x-3">Your endpoint must return a 2XX HTTP status code.</li>
		</ul>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>URL</Table.Head>
					<Table.Head>Active</Table.Head>
					<Table.Head>Validation Token</Table.Head>
					<Table.Head>Secret</Table.Head>
					<Table.Head />
					<Table.Head />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.Webhooks as web}
					<Table.Row>
						<Table.Cell class="font-medium">{web.url}</Table.Cell>
						{#if web.isValidated}
							<Table.Cell><Check class=" text-green-600 h-4" /></Table.Cell>
						{:else}
							<Table.Cell><X class=" text-destructive" /></Table.Cell>
						{/if}
						{#if !web.isValidated}
							<Table.Cell class="font-medium">{web.token}</Table.Cell>
						{:else}
							<Table.Cell />
						{/if}
						<Table.Cell class="font-medium"
							><AlertDialog.Root>
								<AlertDialog.Trigger asChild let:builder>
									<Button builders={[builder]} variant="outline"><BookLock class="h-4 " /></Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Secret Key</AlertDialog.Title>
										<AlertDialog.Description>
											<Input
												class={` ${isBlurred ? 'blur-sm' : ''}  font-mono`}
												value={web.secret}
											/>
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<Button
											on:click={() => {
												isBlurred = !isBlurred;
											}}>Reveal</Button
										>
										<AlertDialog.Action
											on:click={() => {
												isBlurred = true;
											}}>Close</AlertDialog.Action
										>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root></Table.Cell
						>

						{#if web.isValidated}
							<Table.Cell />

							<Table.Cell class="text-right">
								<form action="?/deletewebhook" method="POST" use:delwebenhance>
									<input hidden name="webhook_id" value={web.webhook_id} />
									<Button type="submit" variant="outline"
										><Trash2 class="h-4 text-destructive" /></Button
									>
								</form>
							</Table.Cell>
						{:else}
							<Table.Cell class="text-right">
								<AlertDialog.Root>
									<AlertDialog.Trigger asChild let:builder>
										<Button builders={[builder]} variant="outline">Validate</Button>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<form action="?/validatewebhook" method="POST" use:validwebenhance>
											<AlertDialog.Header>
												<AlertDialog.Title>Validate Endpoint</AlertDialog.Title>
												<AlertDialog.Description>
													<p class="text-center text-xs text-black">
														{web.url + '/' + web.token}
													</p>
													<p class="my-4 text-center">
														Endpoint response must be in 200 - 299 range
													</p>
													<input hidden name="webhook_id" value={web.webhook_id} />
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Action type="submit">Confirm</AlertDialog.Action>
											</AlertDialog.Footer>
										</form>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</Table.Cell>
							<Table.Cell class="text-right">
								<form action="?/deletewebhook" method="POST" use:delwebenhance>
									<input hidden name="email" value={web.webhook_id} />
									<Button type="submit" variant="outline">
										<Trash2 class="h-4 text-destructive" /></Button
									>
								</form>
							</Table.Cell>
						{/if}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
<h2 class="text-xl mt-10 font-semibold flex flex-row justify-between">
	<div class=" flex"><Blocks class="my-auto mr-2" />Integrations</div>
</h2>
<h4 class="text-xs text-muted-foreground">Integrate with your instant message service</h4>
<Card.Root class="my-2">
	<Card.Header />
	<Card.Content class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<Alert.Root class=" w-full">
			<div class="flex">
				<div>
					<Alert.Title class="text-base flex"
						><svg class="mr-2 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8"
							><path
								d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
								fill="#e01e5a"
							/><path
								d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
								fill="#36c5f0"
							/><path
								d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
								fill="#2eb67d"
							/><path
								d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
								fill="#ecb22e"
							/></svg
						>
						Slack</Alert.Title
					>

					<Alert.Description class="font-light text-sm truncate"
						>Post new mon1tor alerts to Slack</Alert.Description
					>
				</div>
				{#if data.integrations.length === 0}
					<Button
						variant="default"
						class="mx-4 my-auto"
						href="https://slack.com/oauth/v2/authorize?response_type=code&amp&;redirect_uri=https%3A%2F%2Fwww.mon1tor.com%2Fintegration%2Fslack%2Fcallback&amp;client_id=6006831542100.6391104467360&scope=channels%3Amanage%2Cchat%3Awrite%2Cchat%3Awrite.public%2Ccommands%2Cincoming-webhook%2Cusers%3Aread%2Cusers%3Aread.email&state={$page
							.params.account_id}">Add</Button
					>
				{:else}
					<Button type="submit" class="mx-4" variant="outline">
						<Trash2 class="h-4 text-destructive" /></Button
					>
				{/if}
			</div>
			{#if data.integrations.length > 0}
				{#each data.integrations as channel}
					<Alert.Description class="font-light text-sm text-muted-foreground  truncate"
						>{channel.channel_name}</Alert.Description
					>
				{/each}
			{/if}
		</Alert.Root>
		<Alert.Root class=" w-full">
			<div class="">
				<div>
					<Alert.Title class="text-base flex"
						><img
							src="https://mailmeteor.com/logos/assets/PNG/Google_Chat_Logo_256px.png"
							alt="google chat logo"
							class="h-6 my-auto mr-2"
						/>
						Google Chat</Alert.Title
					>
				</div>

				<Button disabled class="mx-4" variant="ghost">Coming soon</Button>
			</div>
		</Alert.Root>
		<Alert.Root class=" w-full">
			<div class="">
				<div>
					<Alert.Title class="text-base flex"
						><img
							src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg"
							alt="Teams logo"
							class="h-6 my-auto mr-2"
						/>
						Microsoft Teams</Alert.Title
					>
				</div>

				<Button disabled class="mx-4" variant="ghost">Coming soon</Button>
			</div>
		</Alert.Root>
	</Card.Content>
</Card.Root>
