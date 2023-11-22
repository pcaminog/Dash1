<script lang="ts">
	import { page } from '$app/stores';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import '../../app.postcss';
	import { HomeIcon, Settings, Bell, Sliders, Loader2, Activity } from 'lucide-svelte';

	import UserNav from '$lib/components/UserNav.svelte';
	import { Toaster } from 'svelte-french-toast';

	export let data;
	console.log(data);
	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<Toaster />

<div>
	<div class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
		<div
			class={`fixed inset-0 bg-gray-900/80 transition-opacity ease-linear duration-300 ${
				isOpen ? 'opacity-100' : 'opacity-0'
			}`}
		/>
		<div class="fixed inset-0 flex">
			<div
				class={`relative flex w-full max-w-xs flex-1 transition ease-in-out duration-300 transform ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div class="absolute left-full top-0 flex w-16 justify-center pt-5">
					<button type="button" class="-m-2.5 p-2.5" on:click={toggleMenu}>
						<span class="sr-only">Close sidebar</span>
						<svg
							class="h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Sidebar component, swap this element with another sidebar if you like -->
				<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
					<div class="flex h-16 shrink-0 items-center">
						<img
							class="h-8 w-auto"
							src="https://pub-0716db0a5bc24e53a5fda54c30e7e763.r2.dev/static/logo.svg"
							alt="Your Company"
						/>
						<p class=" font-mono">HostnameNotifier</p>
					</div>
					<nav class="flex flex-1 flex-col">
						<ul role="list" class="flex flex-1 flex-col gap-y-7">
							<li>
								<ul role="list" class="-mx-2 space-y-1">
									<li>
										<!-- Current: "bg-gray-50 text-slate-600", Default: "text-gray-700 hover:text-slate-600 hover:bg-gray-50" -->
										<a
											href="/home"
											class={`${
												$page.url.pathname === `/home`
													? 'bg-gray-200 text-slate-600'
													: 'text-gray-700 hover:text-slate-600'
											} group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
										>
											<HomeIcon class=" h-4 my-auto " />
											Home
										</a>
									</li>
									<li>
										<a
											href={`/monitors?limit=50&offset=0`}
											class={`${
												$page.url.pathname === `/monitors`
													? 'bg-gray-50 text-slate-600'
													: 'text-gray-700 hover:text-slate-600'
											} group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
										>
											<Activity class=" h-4 my-auto " />
											Monitors
										</a>
									</li>

									<li>
										<a
											href="/settings"
											class={`${
												$page.url.pathname === '/settings'
													? 'bg-gray-50 text-slate-600'
													: 'text-gray-700 hover:text-slate-600'
											} group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
										>
											<Settings class=" h-4 my-auto " />
											Settings
										</a>
									</li>
								</ul>
							</li>
							<li>
								<Separator />
							</li>
							<li class="mt-auto">
								<a
									href="/account"
									class=" group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100 text-"
								>
									<Sliders class=" h-4 my-auto " />

									Account
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</div>

	<!-- Static sidebar for desktop -->
	<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<!-- Sidebar component, swap this element with another sidebar if you like -->
		<div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pb-4">
			<div class="flex h-16 shrink-0 items-center">
				<p class=" font-mono">
					<span>HostnameNotifier</span>
				</p>
			</div>
			<nav class="flex flex-1 flex-col">
				<ul role="list" class="flex flex-1 flex-col gap-y-7">
					<li>
						<ul role="list" class="-mx-2 space-y-1">
							<li>
								<a
									href={`/home`}
									class={`${
										$page.url.pathname === `/home` ? ' bg-gray-100 dark:bg-gray-700 ' : ''
									}  group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100 `}
								>
									<HomeIcon class=" h-4 my-auto " />
									Home
								</a>
							</li>
							<li>
								<a
									href={`/monitors?limit=50&offset=0`}
									class={`${
										$page.url.pathname === `/monitors` ? ' bg-gray-100 dark:bg-gray-700 ' : ''
									} group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100 `}
								>
									<Activity class=" h-4 my-auto " />
									Monitors
								</a>
							</li>

							<li>
								<a
									href={`/settings`}
									class={`${
										$page.url.pathname === `/settings` ? ' bg-gray-100 dark:bg-gray-700 ' : ''
									} group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100`}
								>
									<Settings class=" h-4 my-auto  text-primary" />

									Settings
								</a>
							</li>
						</ul>
					</li>
					<li>
						<Separator class="dark:bg-gray-100" />
					</li>
					<li class="mt-auto">
						<a
							href="/account"
							class=" group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100"
						>
							<Sliders class=" h-4 my-auto " />

							Account
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>

	<div class="lg:pl-72">
		<div class="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
			<div
				class="flex h-16 items-center gap-x-4 border-b border-gray-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none"
			>
				<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
					<span class="sr-only">Open sidebar</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</button>

				<!-- Separator -->
				<div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

				<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
					<form class="relative flex flex-1" action="#" method="GET">
						<label for="search-field" class="sr-only">Search</label>
					</form>
					<div class="flex items-center gap-x-4 lg:gap-x-6">
						<button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
							<span class="sr-only">View notifications</span>
							<Bell class=" h-5 my-auto text-muted-foreground" />
						</button>

						<!-- Separator -->
						<div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

						{#if data.session}
							<UserNav session={data.session} />
						{:else}
							<Loader2 class="h-6 w-6 animate-spin" />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<main class="py-10">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>
