<script lang="ts">

	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { GithubIcon, Loader2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { DiscordLogo } from 'radix-icons-svelte';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div
	class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover max-w-"
			style="
				background-image:
					url(https://source.unsplash.com/silhouette-of-mountain-under-starry-night-LRa8IpJpytc);"
		/>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<!-- <Command class="mr-2 h-6 w-6" /> -->
			Mon1tor
		</div>
	</div>
	<div class="p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
			</div>
			<div class={cn('grid gap-6', className)} {...$$restProps}>
				<Button
					variant="outline"
					on:click={() => {
						goto('/login/github');
					}}
					type="button"
					disabled={isLoading}
				>
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<GithubIcon class="mr-2 h-4 w-4" />
					{/if}
					{' '}
					Github
				</Button>

				<Button
					variant="outline"
					on:click={() => {
						goto('/login/microsoft');
					}}
					type="button"
					disabled={isLoading}
				>
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<svg class="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<rect width="24" height="24" fill="none" />
							<path
								d="M3,12V6.75L9,5.43v6.48L3,12M20,3v8.75L10,11.9V5.21L20,3M3,13l6,.09V19.9L3,18.75V13m17,.25V22L10,20.09v-7Z"
							/>
						</svg>
					{/if}
					{' '}
					Microsoft
				</Button>
				<Button
					variant="outline"
					on:click={() => {
						goto('/login/discord');
					}}
					type="button"
					disabled={isLoading}
				>
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<DiscordLogo class="mr-2 h-4 w-4" />
					{/if}
					{' '}
					Discord
				</Button>
			</div>
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{' '}
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>{' '}
				and{' '}
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
