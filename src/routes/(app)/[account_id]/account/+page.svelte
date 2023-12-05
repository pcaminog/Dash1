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

	export let data: PageData;

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
		<form method="POST" action="?/invitationemail" use:emailenhance class="my-2">
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
