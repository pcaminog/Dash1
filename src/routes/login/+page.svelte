<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Sign ip</h1>
<form method="post" use:enhance>
	<label for="email">Email</label>
	<input name="email" id="email" /><br />
	<input type="submit" />
</form>
<button
	type="button"
	on:click={async () => {
		goto('/login/github');
	}}
>
	Github
</button>
{#if form?.message}
	<p class="error">{form.message}</p>
{/if}
