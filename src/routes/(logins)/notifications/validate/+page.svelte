<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.status === 'ok'}
	<div class="bg-white">
		<div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Congratulations!!!
				</h2>
				<p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
					You have successfully verified an email address. You can now start sending notifications
					to this email address.
				</p>

				<p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
					You can close this window.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					<Button
						on:click={() => {
							goto('https://app.mon1tor.com');
						}}
						href="https://app.mon1tor.com">App</Button
					>
					<Button
						on:click={() => {
							goto('https://docs.mon1tor.com');
						}}
						variant="outline">Learn more <span aria-hidden="true">→</span></Button
					>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-white">
		<div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Something didn't work...
				</h2>
				<p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
					Email validation has failed, please try again.
					If that doesn't work, send a new validation
					email.
				</p>
				<p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
					You can close this window.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					<Button
						on:click={() => {
							goto('https://app.mon1tor.com');
						}}
						href="https://app.mon1tor.com">App</Button
					>
					<Button
						on:click={() => {
							goto('https://docs.mon1tor.com');
						}}
						variant="outline">Learn more <span aria-hidden="true">→</span></Button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
