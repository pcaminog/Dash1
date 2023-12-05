<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { GithubIcon, Loader2 } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { DiscordLogo } from 'radix-icons-svelte';
	let isLoading = false;
	export let data: PageData;
	let className: string | undefined | null = undefined;
</script>

{#if data.status === 'ok'}
	<div class="bg-white">
		<div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome</h2>
				<p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
					Please join the organization using any of the following login methods. Please use the
					login method link to the invitaion email address
				</p>

				<div class="p-8">
					<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<div class="flex flex-col space-y-2 text-center" />
						<div class={cn('grid gap-6', className)} {...$$restProps}>
							<Button
								variant="outline"
								on:click={() => {
									goto(`/login/github?token=${data.message}`);
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
									goto(`/login/microsoft?token=${data.message}`);
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
									goto(`/login/discord?token=${data.message}`);
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
					Email validation has failed, please try again. If that doesn't work, send a new validation
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
