<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;
	console.log(data);
</script>

<h2 class="text-xl font-semibold flex flex-row justify-between">Email Recipients</h2>
<h4 class="text-xs text-muted-foreground">Add emails to be notified.</h4>
<Card.Root class="my-2">
	<Card.Content>
		<form method="POST" action="?/validationemail" class="my-2">
			<Label>Email</Label>
			<div class="flex flex-row gap-4">
				<Input class="w-fit" />
				<Button>Validate</Button>
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
				<Table.Row>
					<Table.Cell class="font-medium">INV001</Table.Cell>
					<Table.Cell>Paid</Table.Cell>
					<Table.Cell>Credit Card</Table.Cell>
					<Table.Cell class="text-right">$250.00</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
