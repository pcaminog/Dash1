<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let isAnnual = false;
	let info: string;
	// $: info = data.userInfo.plan;
	info = 'free';
</script>

<div class="isolate overflow-hidden">
	<div class="flow-root pb-16 pt-8 lg:pb-0">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="relative z-10">
				<h2 class="mx-auto max-w-4xl text-center text-5xl font-bold tracking-tight">
					Straightforward Pricing for Web Asset Monitoring
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-center text-lg leading-8">
					Our specialized services ensure your web assets are meticulously monitored, providing you
					with peace of mind and reliability without the hassle of long-term commitments.
				</p>
				<div class="mt-16 flex justify-center">
					<fieldset
						class="grid grid-cols-2 gap-x-1 rounded-full bg-foreground p-1 text-center text-xs font-semibold leading-5"
					>
						<legend class="sr-only">Payment frequency</legend>
						<button
							on:click={() => {
								isAnnual = !isAnnual;
							}}
							class={`cursor-pointer rounded-full px-2.5 py-1 ${isAnnual ? '' : 'bg-blue'}`}
						>
							<input type="radio" name="frequency" value="monthly" class="sr-only" />
							<span class="text-white">Monthly</span>
						</button>
						<button
							on:click={() => {
								isAnnual = !isAnnual;
							}}
							class={`cursor-pointer rounded-full px-2.5 py-1 ${isAnnual ? 'bg-blue' : ''}`}
						>
							<input type="radio" name="frequency" value="annually" class="sr-only" />
							<span class="text-white">Annually</span>
						</button>
					</fieldset>
				</div>
			</div>
			<div
				class="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:-mb-14 lg:max-w-none lg:grid-cols-3"
			>
				<div
					class="hidden lg:absolute lg:inset-x-px lg:bottom-0 lg:top-4 lg:block lg:rounded-t-2xl lg:bg-primary lg:ring-1 lg:ring-white/10"
					aria-hidden="true"
				/>
				<div
					class={` ${
						info === 'free'
							? 'relative rounded-2xl z-10 bg-white shadow-xl ring-1 ring-gray-900/10'
							: 'relative rounded-2xl bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0'
					}`}
				>
					<div class="p-8 lg:pt-12 xl:p-10 xl:pt-14">
						<h3
							id="tier-free"
							class={`text-2xl font-semibold leading-6 ${info === 'free' ? '' : 'text-white'}`}
						>
							Free
						</h3>
						<div
							class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch"
						>
							<div class="mt-2 flex items-center gap-x-4">
								{#if isAnnual}
									<p
										class={`text-4xl font-bold tracking-tight  ${
											info === 'free' ? '' : 'text-white'
										}`}
									>
										$0
									</p>
								{:else}
									<p
										class={`text-4xl font-bold tracking-tight  ${
											info === 'free' ? '' : 'text-white'
										}`}
									>
										0
									</p>
								{/if}
								<!-- Price, update based on frequency toggle state -->
								<div class="text-sm leading-5">
									<p class={`${info === 'free' ? '' : 'text-white'}`}>USD</p>
									<!-- Payment frequency, update based on frequency toggle state -->
									{#if isAnnual}
										<p class="text-gray-400">Billed annually</p>
									{:else}
										<p class="text-gray-400">Billed monthly</p>
									{/if}
								</div>
							</div>
							{#if info === 'free'}
								<Button
									disabled
									class={`${
										info === 'free'
											? ''
											: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									}`}
									aria-describedby="tier-free">Your current plan!</Button
								>
							{:else}
								<Button
									class={`${
										info === 'free'
											? ''
											: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									}`}
									aria-describedby="tier-free">Buy this plan</Button
								>
							{/if}
						</div>
						<div class="mt-8 flow-root sm:mt-10">
							<ul
								role="list"
								class={`-my-2 divide-y border-t text-sm leading-6 lg:border-t-0 divide-white/5 border-white/5 ${
									info === 'free' ? '' : 'text-white'
								}`}
							>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									5 minutes checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									2 minutes checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									1 minute checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									5 monitors
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									Single user account
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div
					class={` ${
						info === 'starter'
							? 'relative rounded-2xl z-10 bg-white shadow-xl ring-1 ring-gray-900/10'
							: 'relative rounded-2xl bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0'
					}`}
				>
					<div class="p-8 lg:pt-12 xl:p-10 xl:pt-14">
						<h3
							id="tier-starter"
							class={`text-2xl font-semibold leading-6 ${info === 'starter' ? '' : 'text-white'}`}
						>
							Starter
						</h3>
						<div
							class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch"
						>
							<div class="mt-2 flex items-center gap-x-4">
								{#if isAnnual}
									<p
										class={`text-4xl font-bold tracking-tight  ${
											info === 'starter' ? '' : 'text-white'
										}`}
									>
										$150
									</p>
								{:else}
									<p
										class={`text-4xl font-bold tracking-tight  ${
											info === 'starter' ? '' : 'text-white'
										}`}
									>
										$15
									</p>
								{/if}
								<div class="text-sm leading-5">
									<p class={`${info === 'starter' ? '' : 'text-white'}`}>USD</p>
									{#if isAnnual}
										<p class="text-gray-400">Billed annually</p>
									{:else}
										<p class="text-gray-400">Billed monthly</p>
									{/if}
								</div>
							</div>
							{#if info === 'starter'}
								<Button
									disabled
									class={`${
										info === 'starter'
											? ''
											: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									}`}
									aria-describedby="tier-free">Your current plan!</Button
								>
							{:else}
								<Button
									class={`${
										info === 'starter'
											? ''
											: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									}`}
									aria-describedby="tier-free">Buy this plan</Button
								>
							{/if}
						</div>
						<div class="mt-8 flow-root sm:mt-10">
							<ul
								role="list"
								class={`-my-2 divide-y border-t text-sm leading-6 lg:border-t-0 divide-white/5 border-white/5 ${
									info === 'starter' ? '' : 'text-white'
								}`}
							>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									5 minutes checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									2 minutes checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									1 minute checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									20 monitors
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									Up to 5 members
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div
					class={` ${
						info === 'pro'
							? 'relative rounded-2xl z-10 bg-white shadow-xl ring-1 ring-gray-900/10'
							: 'relative rounded-2xl bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0'
					}`}
				>
					<div class="p-8 lg:pt-12 xl:p-10 xl:pt-14">
						<h3
							id="tier-pro"
							class={`text-2xl font-semibold leading-6 ${info === 'pro' ? '' : 'text-white'}`}
						>
							Pro
						</h3>
						<div
							class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch"
						>
							<div class="mt-2 flex items-center gap-x-4">
								{#if isAnnual}
									<p
										class={`text-4xl font-bold tracking-tight ${
											info === 'pro' ? '' : 'text-white'
										}`}
									>
										$500
									</p>
								{:else}
									<p
										class={`text-4xl font-bold tracking-tight ${
											info === 'pro' ? '' : 'text-white'
										}`}
									>
										$50
									</p>
								{/if}
								<div class="text-sm leading-5">
									<p class={`${info === 'pro' ? '' : 'text-white'}`}>USD</p>
									{#if isAnnual}
										<p class="text-gray-400">Billed annually</p>
									{:else}
										<p class="text-gray-400">Billed monthly</p>
									{/if}
								</div>
							</div>
							{#if info === 'pro'}
								<Button
									disabled
									class={`${
										info === 'pro'
											? ''
											: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									}`}
									aria-describedby="tier-free">Your current plan!</Button
								>
							{:else}
								<Button
									class={`${
										info === 'pro'
											? ''
											: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									}`}
									aria-describedby="tier-free">Buy this plan</Button
								>
							{/if}
						</div>
						<div class="mt-8 flow-root sm:mt-10">
							<ul
								role="list"
								class={`-my-2 divide-y border-t text-sm leading-6 lg:border-t-0 divide-white/5 border-white/5 ${
									info === 'pro' ? '' : 'text-white'
								}`}
							>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									5 minutes checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									2 minutes checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									1 minute checks
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									50 monitors
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									Unlimited members
								</li>
								<li class="flex gap-x-3 py-2">
									<svg
										class="h-6 w-5 flex-none text-blue"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									SSO (Coming Soon)
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="relative bg-gray-50 lg:pt-14">
		<div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
			<!-- Feature comparison (up to lg) -->
			<section aria-labelledby="mobile-comparison-heading" class="lg:hidden">
				<h2 id="mobile-comparison-heading" class="sr-only">Feature comparison</h2>

				<div class="mx-auto max-w-2xl space-y-16">
					<div class="border-t border-gray-900/10">
						<div class="-mt-px w-72 border-t-2 pt-10 md:w-80 border-transparent">
							<h3 class="text-sm font-semibold leading-6 text-gray-900">Free</h3>
							<p class="mt-1 text-sm leading-6 text-gray-600">
								Basic monitoring, free, yeah forever
							</p>
						</div>

						<div class="mt-10 space-y-10">
							<div>
								<div class="relative mt-6">
									<!-- Fake card background -->
									<div
										aria-hidden="true"
										class="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white shadow-sm sm:block"
									/>

									<div
										class="relative rounded-lg bg-white shadow-sm sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0 ring-1 ring-gray-900/10"
									>
										<dl class="divide-y divide-gray-200 text-sm leading-6">
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">5 minutes checks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">2 minutes checks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>

											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">1 minute check</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Users</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<span class="text-gray-900">1</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Monitors</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<span class="text-gray-900">5</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Slack</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Google Chat</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Microsoft Teams</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Webhooks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Single Sign-On</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-gray-400"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
														/>
													</svg>
													<span class="sr-only">No</span>
												</dd>
											</div>
										</dl>
									</div>

									<!-- Fake card border -->
									<div
										aria-hidden="true"
										class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block ring-1 ring-gray-900/10"
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="border-t border-gray-900/10">
						<div class="-mt-px w-72 border-t-2 pt-10 md:w-80 border-blue">
							<h3 class="text-sm font-semibold leading-6 text-blue">Starter</h3>
							<p class="mt-1 text-sm leading-6 text-gray-600">
								Best for professional teams that needs advanced monitoring
							</p>
						</div>

						<div class="mt-10 space-y-10">
							<div>
								<div class="relative mt-6">
									<!-- Fake card background -->
									<div
										aria-hidden="true"
										class="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white shadow-sm sm:block"
									/>

									<div
										class="relative rounded-lg bg-white shadow-sm sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0 ring-2 ring-blue"
									>
										<dl class="divide-y divide-gray-200 text-sm leading-6">
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">5 minutes checks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">2 minutes checks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>

											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">1 minute check</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Users</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<span class="text-gray-900">5</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Monitors</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<span class="text-gray-900">20</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Slack</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Google Chat</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Microsoft Teams</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Webhooks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Single Sign-On</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-gray-400"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
														/>
													</svg>
													<span class="sr-only">No</span>
												</dd>
											</div>
										</dl>
									</div>

									<!-- Fake card border -->
									<div
										aria-hidden="true"
										class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block ring-2 ring-blue"
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="border-t border-gray-900/10">
						<div class="-mt-px w-72 border-t-2 pt-10 md:w-80 border-transparent">
							<h3 class="text-sm font-semibold leading-6 text-gray-900">Pro</h3>
							<p class="mt-1 text-sm leading-6 text-gray-600">Best for enterprise companies</p>
						</div>

						<div class="mt-10 space-y-10">
							<div>
								<div class="relative mt-6">
									<!-- Fake card background -->
									<div
										aria-hidden="true"
										class="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white shadow-sm sm:block"
									/>

									<div
										class="relative rounded-lg bg-white shadow-sm sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0 ring-1 ring-gray-900/10"
									>
										<dl class="divide-y divide-gray-200 text-sm leading-6">
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">5 minutes checks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">2 minutes checks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">1 minute checks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Users</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<span class="text-gray-900">Unlimited</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Monitors</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<span class="text-gray-900">50</span>
												</dd>
											</div>

											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">1 minute check</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Slack</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Google Chat</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Microsoft Teams</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Webhooks</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
											<div
												class="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
											>
												<dt class="pr-4 text-gray-600">Single Sign-On</dt>
												<dd class="flex items-center justify-end sm:justify-center sm:px-4">
													<svg
														class="mx-auto h-5 w-5 text-blue"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													<span class="sr-only">Yes</span>
												</dd>
											</div>
										</dl>
									</div>

									<!-- Fake card border -->
									<div
										aria-hidden="true"
										class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block ring-1 ring-gray-900/10"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Feature comparison (lg+) -->
			<section aria-labelledby="comparison-heading" class="hidden lg:block">
				<h2 id="comparison-heading" class="sr-only">Feature comparison</h2>

				<div class="grid grid-cols-4 gap-x-8 border-t border-gray-900/10 before:block">
					<div aria-hidden="true" class="-mt-px">
						<div
							class={` border-t-2 pt-10 ${info === 'free' ? ' border-blue' : 'border-transparent'}`}
						>
							<p class={` text-sm font-semibold leading-6 ${info === 'free' ? 'text-blue' : ''}`}>
								Free
							</p>
							<p class="mt-1 text-sm leading-6 text-gray-600">Basic monitoring free forever</p>
						</div>
					</div>
					<div aria-hidden="true" class="-mt-px">
						<div
							class={` border-t-2 pt-10 ${
								info === 'starter' ? ' border-blue' : 'border-transparent'
							}`}
						>
							<p
								class={` text-sm font-semibold leading-6 ${info === 'starter' ? 'text-blue' : ''}`}
							>
								Starter
							</p>
							<p class="mt-1 text-sm leading-6 text-gray-600">
								Best for professional teams that needs advanced monitoring
							</p>
						</div>
					</div>
					<div aria-hidden="true" class="-mt-px">
						<div
							class={` border-t-2 pt-10 ${info === 'pro' ? ' border-blue' : 'border-transparent'}`}
						>
							<p class={` text-sm font-semibold leading-6 ${info === 'pro' ? 'text-blue' : ''}`}>
								Pro
							</p>
							<p class="mt-1 text-sm leading-6 text-gray-600">Best for enterprise companies</p>
						</div>
					</div>
				</div>

				<div class="-mt-6 space-y-16">
					<div>
						<div class="relative -mx-8 mt-10">
							<!-- Fake card backgrounds -->
							<div
								class="absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
								aria-hidden="true"
							>
								<div class="h-full w-full rounded-lg bg-white shadow-sm" />
								<div class="h-full w-full rounded-lg bg-white shadow-sm" />
								<div class="h-full w-full rounded-lg bg-white shadow-sm" />
							</div>

							<table class="relative w-full border-separate border-spacing-x-8">
								<thead>
									<tr class="text-left">
										<th scope="col">
											<span class="sr-only">Feature</span>
										</th>
										<th scope="col">
											<span class="sr-only">Starter tier</span>
										</th>
										<th scope="col">
											<span class="sr-only">Scale tier</span>
										</th>
										<th scope="col">
											<span class="sr-only">Growth tier</span>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
										>
											5 minutes checks
											<div class="absolute inset-x-8 mt-3 h-px bg-gray-200" />
										</th>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
										>
											2 minutes checks
											<div class="absolute inset-x-8 mt-3 h-px bg-gray-200" />
										</th>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>

									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
										>
											1 minute check
											<div class="absolute inset-x-8 mt-3 h-px bg-gray-200" />
										</th>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
										>
											Users
											<div class="absolute inset-x-8 mt-3 h-px bg-gray-200" />
										</th>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="text-gray-900">1 </span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="text-gray-900">5 </span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="text-gray-900">Unlimited </span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
										>
											Monitors
											<div class="absolute inset-x-8 mt-3 h-px bg-gray-200" />
										</th>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="text-gray-900">5 </span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="text-gray-900">20 </span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="text-gray-900">50 </span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
											>Webhooks</th
										>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
											>Slack Integration</th
										>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
											>Google Chat</th
										>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
											>Microsoft Teams</th
										>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>
									<tr>
										<th
											scope="row"
											class="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
											>Single Sign-On <Badge variant="outline">Beta</Badge></th
										>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-gray-400"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
													/>
												</svg>
												<span class="sr-only">No</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-gray-400"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
													/>
												</svg>
												<span class="sr-only">No</span>
											</span>
										</td>
										<td class="relative w-1/4 px-4 py-0 text-center">
											<span class="relative h-full w-full py-3">
												<svg
													class="mx-auto h-5 w-5 text-blue"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clip-rule="evenodd"
													/>
												</svg>
												<span class="sr-only">Yes</span>
											</span>
										</td>
									</tr>
								</tbody>
							</table>

							<!-- Fake card borders -->
							<div
								class="pointer-events-none absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
								aria-hidden="true"
							>
								<div
									class={` rounded-lg ${
										info === 'free' ? 'ring-2 ring-blue' : 'ring-1 ring-gray-900/10'
									}`}
								/>
								<div
									class={` rounded-lg ${
										info === 'starter' ? 'ring-2 ring-blue' : 'ring-1 ring-gray-900/10'
									}`}
								/>
								<div
									class={` rounded-lg ${
										info === 'pro' ? 'ring-2 ring-blue' : 'ring-1 ring-gray-900/10'
									}`}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
