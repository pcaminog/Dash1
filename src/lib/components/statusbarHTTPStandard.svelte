<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Badge from './ui/badge/badge.svelte';
	export let monitorData: { last_checked: number; url: string; status: number }[];
</script>

<div class="flex flex-row justify-between">
	<div class="md:flex">
		<div class="flex my-2 md:my-0 mr-0.5">
			{#each Array(50).fill(null) as _, i}
				{#if monitorData[i] && monitorData[i].status >= 200 && monitorData[i].status <= 299}
					<Tooltip.Root>
						<Tooltip.Trigger
							><div
								class="h-6 md:w-2 w-1 inline-block bg-green-600 rounded-md mr-0.5 min-w-min"
							/></Tooltip.Trigger
						>
						<Tooltip.Content >
							<p>{new Date(monitorData[i].last_checked).toLocaleString()}</p>
							<p>HTTP Response Code:{monitorData[i].status}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{:else if monitorData[i] && (monitorData[i].status < 200 || monitorData[i].status > 299)}
					<Tooltip.Root>
						<Tooltip.Trigger
							><div
								class="h-6 md:w-2 w-1 inline-block bg-destructive rounded-md mr-0.5"
								style="min-width: 7px;"
							/></Tooltip.Trigger
						>
						<Tooltip.Content >
							<p>{new Date(monitorData[i].last_checked).toLocaleString()}</p>
							<p>HTTP Response Code:{monitorData[i].status}</p>
						</Tooltip.Content>.
					</Tooltip.Root>
				{:else}
					<div
						class="h-6 md:w-2 w-1 inline-block border border-black rounded-md mr-0.5"
						style="min-width: 7px;"
					/>
				{/if}
			{/each}
		</div>
		<div>
			{#if monitorData[0]?.status >= 200 && monitorData[0]?.status <= 299}
				<Badge variant="outline" class="w-fit mx-auto my-auto h-6 text-green-600 border-green-600"
					>Healthy</Badge
				>
			{:else if monitorData[0]?.status < 200 || monitorData[0]?.status > 299}
				<Badge
					variant="outline"
					class="w-fit mx-auto my-auto h-6 text-destructive border-destructive ">Critical</Badge
				>
			{:else}
				<Badge variant="outline" class="w-fit mx-auto my-auto h-6 text-blue border-blue "
					>Pending</Badge
				>
			{/if}
		</div>
	</div>
</div>
