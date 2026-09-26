<script lang="ts">
	import { page } from '$app/state';
	import LL, { locale } from '$i18n/i18n-svelte';
	import PixelButton from '$lib/components/pixel/PixelButton.svelte';
	import PixelIcon, { type PixelIconName } from '$lib/components/pixel/PixelIcon.svelte';
	import PixelPanel from '$lib/components/pixel/PixelPanel.svelte';
	import PixelScene from '$lib/components/pixel/PixelScene.svelte';
	import { isSfxMuted, setSfxMuted } from '$lib/sfx';

	type View = 'city' | 'walk' | 'fly' | 'clue' | 'menu' | 'computer';
	const VIEWS: View[] = ['city', 'walk', 'fly', 'clue', 'menu', 'computer'];

	let view = $state<View>((page.url.searchParams.get('state') as View) ?? 'city');
	let muted = $state(isSfxMuted());

	const forceSrc = page.url.searchParams.get('src');
	const art = $derived(
		view === 'clue'
			? { tall: 'museum-v2-curator-wide', wide: 'museum-v2-curator-wide' }
			: {
					tall: forceSrc === 'wide' ? 'cairo-day-wide' : 'cairo-day-tall',
					wide: forceSrc === 'tall' ? 'cairo-day-tall' : 'cairo-day-wide'
				}
	);
	const isOverlay = $derived(view !== 'city' && view !== 'clue');

	const PLACES = [
		{ name: 'Museum', icon: 'place-museum' },
		{ name: 'Riverfront', icon: 'place-riverfront' },
		{ name: 'Bank', icon: 'place-bank' }
	];

	// Equirectangular map bounds, matching static/prototype/world-map.png
	const MAP = { north: 80, south: -58 };
	const CITIES = [
		{ name: 'Paris', lat: 48.86, lon: 2.35, current: true, labelLeft: true },
		{ name: 'Budapest', lat: 47.5, lon: 19.04 },
		{ name: 'Cairo', lat: 30.04, lon: 31.24 },
		{ name: 'Lima', lat: -12.05, lon: -77.04 },
		{ name: 'Kyoto', lat: 35.01, lon: 135.77 }
	];
	const mapX = (lon: number) => ((lon + 180) / 360) * 100;
	const mapY = (lat: number) => ((MAP.north - lat) / (MAP.north - MAP.south)) * 100;

	const WARRANT_OPTIONS = {
		sex: ['male', 'female'],
		hobby: ['hiking', 'tennis', 'cycling', 'guitar', 'golf', 'gambler', 'pickleball'],
		hair: ['black', 'brown', 'red', 'blond'],
		feature: ['scar', 'glasses', 'tattoo', 'birthmark', 'ring', 'necklace'],
		vehicle: [
			'bike',
			'motorcycle',
			'hoverboard',
			'exotic',
			'convertible',
			'limousine',
			'transit',
			'jet'
		]
	} as const;
	type WarrantField = keyof typeof WARRANT_OPTIONS;
	const FIELDS = Object.keys(WARRANT_OPTIONS) as WarrantField[];

	// -1 means unknown
	let warrant = $state<Record<WarrantField, number>>({
		sex: 1,
		hobby: -1,
		hair: 2,
		feature: -1,
		vehicle: -1
	});

	function cycle(field: WarrantField, step: number): void {
		const count = WARRANT_OPTIONS[field].length + 1;
		warrant[field] = ((warrant[field] + 1 + step + count) % count) - 1;
	}

	function warrantValue(field: WarrantField): string {
		const index = warrant[field];
		if (index < 0) return $LL.warrants.labels.unknown();
		const group = $LL.warrants[field] as unknown as Record<string, () => string>;
		return group[WARRANT_OPTIONS[field][index]]();
	}

	// Dialogue shows three lines at a time; tapping pages through the rest
	let dialogue = $state<HTMLElement>();
	let hasMore = $state(false);

	function measure(): void {
		if (!dialogue) return;
		hasMore = dialogue.scrollTop + dialogue.clientHeight < dialogue.scrollHeight - 1;
	}

	function nextPage(): void {
		if (!dialogue) return;
		dialogue.scrollTop = hasMore ? dialogue.scrollTop + dialogue.clientHeight : 0;
		measure();
	}

	$effect(() => {
		view;
		if (dialogue) dialogue.scrollTop = 0;
		measure();
	});

	const ACTIONS: { view: View | null; label: string; icon: PixelIconName }[] = [
		{ view: 'walk', label: 'Walk', icon: 'walk' },
		{ view: 'fly', label: 'Fly', icon: 'fly' },
		{ view: null, label: 'Dossiers', icon: 'dossiers' },
		{ view: 'computer', label: 'Warrant', icon: 'warrant' }
	];

	function toggle(target: View): void {
		view = view === target ? 'city' : target;
	}
</script>

<div
	class="pixel-crisp font-pixel text-ink fixed inset-0 z-20 flex flex-col overflow-hidden bg-[#0b0a10] p-10 text-[32px] leading-10 [--frame:4px] max-md:p-5 max-md:text-2xl max-md:leading-7 max-md:[--frame:2px]"
>
	<PixelScene
		tall="/prototype/{art.tall}.webp"
		wide="/prototype/{art.wide}.webp"
		dimmed={isOverlay}
	/>

	<header class="relative flex items-stretch justify-between gap-4">
		<div class="pixel-frame bg-panel flex flex-col justify-center px-4 py-2 max-md:px-3">
			<h1 class="m-0 text-[32px] leading-8 font-bold max-md:text-2xl max-md:leading-6">Cairo</h1>
			<p class="font-pixel-small text-ink-dim m-0 mt-1 text-base leading-4 uppercase">
				Tue 1:00 pm{#if view === 'clue'}&nbsp;· Museum{/if}
			</p>
		</div>
		<PixelButton
			small
			class="grid aspect-square place-items-center px-0! py-0!"
			active={view === 'menu'}
			onclick={() => toggle('menu')}
		>
			<PixelIcon name="menu" class="size-8" />
		</PixelButton>
	</header>

	<footer class="relative mt-auto flex flex-col items-center gap-6 max-md:gap-4">
		<PixelPanel label={view === 'clue' ? 'Curator' : undefined} class="w-full max-w-[880px]">
			<button
				type="button"
				class="block w-full cursor-pointer border-0 bg-transparent p-0 text-left font-[inherit] text-[length:inherit] leading-[inherit] text-inherit"
				onclick={nextPage}
			>
				<div bind:this={dialogue} class="h-[3lh] overflow-hidden" onscroll={measure}>
					{#if view === 'clue'}
						<p class="m-0">
							A reliable source told me she asked about the exchange rate for
							<span class="text-highlight">Hungarian forints</span>. She had
							<span class="text-highlight">red hair</span>, if that helps.
						</p>
					{:else}
						<p class="m-0">
							Welcome to Cairo, where history lives on every corner. From the breathtaking Pyramids
							of Giza to the bustling markets of Khan El Khalili, this city never ceases to amaze.
						</p>
					{/if}
				</div>
			</button>
			{#if hasMore}
				<span class="text-highlight pointer-events-none absolute right-3 bottom-1 animate-pulse"
					>▼</span
				>
			{/if}
		</PixelPanel>

		<nav class="grid w-full max-w-[880px] grid-cols-4 gap-3 max-md:gap-2">
			{#if view === 'clue'}
				<PixelButton small onclick={() => (view = 'walk')}
					>&lt; {$LL.components.buttons.goBack()}</PixelButton
				>
			{:else}
				{#each ACTIONS as action}
					<PixelButton
						small
						class="flex flex-col items-center gap-2 py-3! max-md:gap-1.5 max-md:py-2!"
						active={action.view !== null && view === action.view}
						onclick={() => action.view && toggle(action.view)}
					>
						<PixelIcon name={action.icon} class="size-8" />
						{action.label}
					</PixelButton>
				{/each}
			{/if}
		</nav>
	</footer>

	{#if isOverlay}
		<div
			class="absolute inset-0 grid place-items-center bg-[#0b0a10cc] p-10 max-md:p-6"
			onclick={(event) => event.target === event.currentTarget && (view = 'city')}
			role="presentation"
		>
			{#if view === 'walk'}
				<PixelPanel label={$LL.game.actions.walk()} class="w-full max-w-[880px]">
					<div class="grid grid-cols-3 gap-6 max-md:gap-3">
						{#each PLACES as place}
							<button
								type="button"
								class="group text-ink hover:text-highlight flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] leading-[inherit]"
								onclick={() => (view = 'clue')}
							>
								<img
									src="/prototype/{place.icon}.webp"
									alt=""
									class="pixel-crisp aspect-square w-full transition-transform group-hover:-translate-y-1"
								/>
								<span>{place.name}</span>
							</button>
						{/each}
					</div>
				</PixelPanel>
			{:else if view === 'fly'}
				<PixelPanel label={$LL.game.actions.fly()} class="w-max p-4! max-md:p-2!">
					<div class="relative w-[960px] max-md:w-[320px]">
						<img src="/prototype/world-map.png" alt="" class="pixel-crisp block w-full" />
						{#each CITIES as city}
							<button
								type="button"
								class="group absolute flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 max-md:gap-1"
								style:left="{mapX(city.lon)}%"
								style:top="{mapY(city.lat)}%"
								style:transform={city.labelLeft
									? 'translate(calc(-100% + 8px), -50%)'
									: 'translate(-8px, -50%)'}
								disabled={city.current}
							>
								{#if city.labelLeft}
									<span
										class="font-pixel bg-panel text-ink-dim px-2 text-base leading-6 max-md:px-1 max-md:leading-4"
										>{city.name}</span
									>
								{/if}
								<span
									class={[
										'block size-4 shadow-[0_0_0_2px_#000] max-md:size-2',
										city.current ? 'bg-alert' : 'bg-highlight group-hover:bg-white'
									]}
								></span>
								{#if !city.labelLeft}
									<span
										class="font-pixel bg-panel text-ink group-hover:text-highlight px-2 text-base leading-6 max-md:px-1 max-md:leading-4"
										>{city.name}</span
									>
								{/if}
							</button>
						{/each}
					</div>
				</PixelPanel>
			{:else if view === 'menu'}
				<PixelPanel label="Menu" class="w-full max-w-[640px]">
					<div class="grid gap-3 max-md:gap-2">
						<PixelButton
							class="flex justify-between"
							onclick={() => {
								muted = !muted;
								setSfxMuted(muted);
							}}
						>
							<span>Sound</span><span class="text-highlight">{muted ? 'Off' : 'On'}</span>
						</PixelButton>
						<PixelButton class="flex justify-between">
							<span>Language</span><span class="text-highlight"
								>{$locale === 'es' ? 'Español' : 'English'}</span
							>
						</PixelButton>
						<PixelButton class="flex justify-between">
							<span>{$LL.warrants.suspectDossiers()}</span><span>&gt;</span>
						</PixelButton>
						<PixelButton class="flex justify-between" onclick={() => (view = 'computer')}>
							<span>{$LL.warrants.getWarrant()}</span><span>&gt;</span>
						</PixelButton>
						<PixelButton class="text-alert">{$LL.game.actions.abandon()}</PixelButton>
					</div>
				</PixelPanel>
			{:else if view === 'computer'}
				<PixelPanel
					terminal
					label="{$LL.warrants.worldPolice()} · {$LL.warrants.warrants()}"
					class="w-full max-w-[720px]"
				>
					{#each FIELDS as field}
						<div class="grid grid-cols-[1fr_auto] items-center py-1">
							<span class="text-terminal-dim">{$LL.warrants.labels[field]()}</span>
							<span class="flex items-center gap-3">
								<button
									type="button"
									class="text-terminal-dim hover:text-terminal cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[length:inherit]"
									onclick={() => cycle(field, -1)}>&lt;</button
								>
								<span class="min-w-[8ch] text-center">{warrantValue(field)}</span>
								<button
									type="button"
									class="text-terminal-dim hover:text-terminal cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[length:inherit]"
									onclick={() => cycle(field, 1)}>&gt;</button
								>
							</span>
						</div>
					{/each}
					<p class="text-terminal-dim m-0 mt-4">{$LL.warrants.provideDetails()}</p>
					<button
						type="button"
						class="bg-terminal text-terminal-bg font-pixel mt-5 block w-full cursor-pointer border-0 py-3 text-[length:inherit] leading-[inherit] uppercase"
					>
						{$LL.warrants.compute()}
					</button>
				</PixelPanel>
			{/if}
		</div>
	{/if}

	<!-- Prototype-only switcher -->
	<div
		class="font-pixel absolute top-0 left-1/2 flex -translate-x-1/2 gap-1 text-[16px] leading-none opacity-40 hover:opacity-100"
	>
		{#each VIEWS as v}
			<button
				type="button"
				class={[
					'cursor-pointer border-0 px-1.5 py-0.5 font-[inherit]',
					view === v ? 'bg-highlight text-black' : 'bg-panel text-ink'
				]}
				onclick={() => (view = v)}>{v}</button
			>
		{/each}
	</div>
</div>
