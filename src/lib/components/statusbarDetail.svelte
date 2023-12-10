<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	export let monitorData: { last_checked: string; ok: boolean; status: number }[];
</script>

<div class="flex flex-row justify-between">
	<div class="">
		<div class="flex mr-0.5">
			{#each Array(50).fill(null) as _, i}
				{#if monitorData[i] && monitorData[i].ok}
					<Tooltip.Root>
						<Tooltip.Trigger
							><div
								class="h-5 w-2 inline-block bg-green-600 rounded-md mr-0.5 min-w-min"
							/></Tooltip.Trigger
						>
						<Tooltip.Content class="bg-blue">
							<p>{new Date(monitorData[i].last_checked).toLocaleString()}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{:else if monitorData[i] && !monitorData[i].ok}
					<Tooltip.Root>
						<Tooltip.Trigger
							><div
								class="h-5 w-2 inline-block bg-destructive rounded-md mr-0.5"
								style="min-width: 10px;"
							/></Tooltip.Trigger
						>
						<Tooltip.Content class="bg-blue">
							<p>{new Date(monitorData[i].last_checked).toLocaleString()}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{:else}
					<div
						class="h-5 w-2 inline-block border border-black rounded-md mr-0.5"
						style="min-width: 10px;"
					/>
				{/if}
			{/each}
		</div>
	</div>
</div>
