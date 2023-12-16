<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Check, Trash2, X } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { toast_error_style } from '$lib/utils';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { page } from '$app/stores';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	let reasonDelete: string;
	let open = false;
	$: console.log(reasonDelete);
	export let data: PageData;
	console.log(data);
	const { enhance: inviteemailenhance } = superForm(data.invitationemail, {
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Invitation email sent', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: delmemberenhance } = superForm(data.delmember, {
		id: 'delelteMember',
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Member deleted succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: resendmemberenhance } = superForm(data.memberres, {
		id: 'resendMember',
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

	const { enhance: nameenhance } = superForm(data.accountname, {
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Account Name updated succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});

	const { enhance: delaccountenhance, errors: delaccounterrors } = superForm(data.deleteaccount, {
		onError({ result }) {
			toast.error(result.error.message, {
				style: toast_error_style,
				position: 'bottom-right'
			});
			open = true;
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Account Name updated succesully', {
					style: 'border: 1px solid #000000; padding: 16px; color: #000000;',
					position: 'bottom-right'
				});
			}
		}
	});
	$: console.log(open);
</script>

<h2 class="text-xl font-semibold flex flex-row justify-between">Account Name</h2>
<h4 class="text-xs text-muted-foreground">Change the name of your organization</h4>
<Card.Root>
	<Card.Content>
		<form action="?/accountname" method="POST" use:nameenhance class="my-2">
			<Label>Name</Label>
			<div class="flex flex-row gap-4">
				<Input name="account_name" placeholder={data.session?.user.account_name} class="w-fit" />
				<Button type="submit">Update</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
<Separator class="my-4" />
<h2 class="text-xl font-semibold flex flex-row justify-between">Members</h2>
<h4 class="text-xs text-muted-foreground">Invite new members to collaborate</h4>
<Card.Root class="my-2">
	<Card.Content>
		<form method="POST" action="?/invitationemail" use:inviteemailenhance class="my-2">
			<Label>Email</Label>
			<div class="flex flex-row gap-4">
				<Input name="email" class="w-fit" />
				<Button type="submit">Invite</Button>
			</div>
			<div class="grid w-full items-center gap-4" />
		</form>

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Email</Table.Head>
					<Table.Head>Accepted</Table.Head>
					<Table.Head />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.members as email}
					<Table.Row>
						<Table.Cell class="font-medium">{email.email}</Table.Cell>
						{#if Math.floor(email.verified) === 1 || email.username}
							<Table.Cell
								><Badge variant="outline"><Check class=" text-green-600 h-4" /></Badge></Table.Cell
							>
						{:else}
							<Table.Cell
								><Badge variant="outline"><X class=" text-destructive h-4" /></Badge></Table.Cell
							>
						{/if}

						{#if email.email === data.session?.user.email}
							<Table.Cell />
							<Table.Cell />
						{:else if email.isMember}
							<Table.Cell />

							<Table.Cell class="text-right">
								<AlertDialog.Root>
									<AlertDialog.Trigger asChild let:builder>
										<Button builders={[builder]} variant="outline">
											<Trash2 class="h-4 text-destructive" /></Button
										>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
											<AlertDialog.Description>
												Removing <span class="underline font-semibold text-black"
													>{email.email}</span
												> as member will revoke their access to all organization resources and information.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<form action="?/deletemember" method="POST" use:delmemberenhance>
												<input hidden name="user_id" value={email.id} />
												<input hidden name="email" value={email.email} />

												<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
											</form>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</Table.Cell>
						{:else}
							<Table.Cell class="text-right">
								<form action="?/memberres" method="POST" use:resendmemberenhance>
									<input hidden name="email" value={email.email} />
									<Button type="submit">Re-Send</Button>
								</form>
							</Table.Cell>
							<Table.Cell class="text-right">
								<AlertDialog.Root>
									<AlertDialog.Trigger asChild let:builder>
										<Button builders={[builder]} variant="outline">
											<Trash2 class="h-4 text-destructive" /></Button
										>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
											<AlertDialog.Description>
												Removing <span class="underline font-bold">{email.email}</span> as member will
												revoke their access to all organization resources and information.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<form action="?/deletemember" method="POST" use:delmemberenhance>
												<input hidden name="user_id" value={email.id} />
												<input hidden name="email" value={email.email} />
												<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
											</form>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</Table.Cell>
						{/if}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>

<Separator class="my-4" />
<Card.Root class="ring-2 ring-destructive">
	<Card.Header>
		<Card.Title class="text-destructive">Delete Account</Card.Title>
	</Card.Header>
	<Card.Content>
		<AlertDialog.Root bind:open>
			<AlertDialog.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">Delete</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<form action="?/deleteaccount" method="POST" use:delaccountenhance>
					<AlertDialog.Header>
						<AlertDialog.Title>We are sorry to see you go.😢</AlertDialog.Title>
						<AlertDialog.Description>
							<p>
								This action is irreversible. Once confirmed, all data, settings, monitors, and user
								accounts will be permanently erased and cannot be recovered.
							</p>
							Please specify the reason you are leaving.

							<RadioGroup.Root bind:value={reasonDelete} class="my-2">
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="nolongerneed" id="nolongerneed" />
									<Label for="nolongerneed">I no longer need the service.</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="dissatisfied" id="dissatisfied" />
									<Label for="dissatisfied">I'm dissatisfied with the service.</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="foundalternate" id="foundalternate" />
									<Label for="foundalternate">I found an alternative service.</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="expensive" id="expensive" />
									<Label for="expensive">The service is too expensive.</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="privacysecurity" id="privacysecurity" />
									<Label for="privacysecurity">Concerns about privacy or data security.</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="complicated" id="complicated" />
									<Label for="complicated">The service is too complicated to use.</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="other" id="other" />
									<Label for="other">Other (please specify).</Label>
								</div>
							</RadioGroup.Root>
							<span id="name-error" aria-live="assertive" class=" text-destructive text-sm">
								{#if $delaccounterrors.reason}
									{$delaccounterrors.reason}
								{/if}
							</span>
							{#if reasonDelete === 'dissatisfied' || reasonDelete === 'other' || reasonDelete === 'complicated'}
								<Textarea name="reason_detail" />
								<span id="name-error" aria-live="assertive" class=" text-destructive text-sm">
									{#if $delaccounterrors.reason_detail}
										{$delaccounterrors.reason_detail}
									{/if}
								</span>
							{/if}
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<input hidden name="reason" value={reasonDelete} />
						<input hidden name="account_id" value={$page.params.account_id} />
						<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
					</AlertDialog.Footer>
				</form>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Card.Content>
</Card.Root>
