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
				toast.success('Email deleted succesully', {
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
												Removing this member will revoke their access to all organization resources
												and information.
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
												Removing this member will revoke their access to all organization resources
												and information.
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
