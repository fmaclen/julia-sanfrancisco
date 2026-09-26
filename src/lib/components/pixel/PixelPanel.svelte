<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		terminal?: boolean;
		class?: string;
		children: Snippet;
	}

	let { label, terminal = false, class: className = '', children }: Props = $props();
</script>

<section
	class={[
		'pixel-frame relative px-6 pt-5 pb-6 max-md:px-3.5 max-md:pt-3 max-md:pb-4',
		terminal
			? 'bg-terminal-bg text-terminal [--frame-color:var(--color-terminal-edge)]'
			: 'bg-panel',
		className
	]}
>
	{#if label}
		<span
			class={[
				'font-pixel-small max-md:font-pixel absolute -top-9 -left-(--frame) px-3 pt-2 pb-3 text-base leading-none uppercase max-md:-top-7.5 max-md:px-2 max-md:pt-1.5 max-md:pb-2',
				terminal ? 'bg-terminal-edge text-terminal' : 'bg-edge'
			]}
		>
			{label}
		</span>
	{/if}
	{@render children()}
</section>
