<script>
	import { browser } from '$app/environment';
	import { ArrowLeft } from 'radix-icons-svelte';
	import Button from './ui/button/button.svelte';

	function navigateBack() {
		window.history.back();
	}
</script>

{#if browser}
	<Button variant="outline" class="border-primary mb-2" on:click={navigateBack}
		><div class="flex"><ArrowLeft class="h-4 w-4 mr-2 my-auto" /> Back</div></Button
	>
{/if}
