<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	export let session: any;
</script>

<DropdownMenu.Root positioning={{ placement: 'bottom-end' }}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src={session.user.avatar} alt="avatarimage" />
				<Avatar.Fallback>{session.user.username.slice(0, 2)}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">
					{session.user.email}
				</p>
				<p class="text-xs leading-none text-muted-foreground">{session.user.username}</p>
				<p class="text-sm leading-none text-muted-foreground">{session.user.account_name}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<a href="/account/user/profile"><DropdownMenu.Item>Profile</DropdownMenu.Item></a>
			<DropdownMenu.Item>Billing</DropdownMenu.Item>
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
			<DropdownMenu.Item>Organizations</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<form method="GET" action="/logout">
			<button type="submit"><DropdownMenu.Item>Log out</DropdownMenu.Item></button>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
