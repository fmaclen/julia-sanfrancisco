<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		active?: boolean;
		small?: boolean;
		onclick?: () => void;
		class?: string;
		children: Snippet;
	}

	let { active = false, small = false, onclick, class: className = '', children }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	class={[
		'cursor-pointer border-0 text-left [--frame-color:var(--color-edge)] [box-shadow:0_0_0_var(--frame)_var(--frame-color)]',
		small
			? 'font-pixel-small max-md:font-pixel px-4 py-3 text-base leading-none uppercase max-md:px-2.5 max-md:py-2'
			: 'font-pixel px-4 py-2 text-[length:inherit] leading-[inherit]',
		active
			? small
				? 'bg-highlight text-black [--frame-color:var(--color-highlight)]'
				: 'bg-panel text-highlight'
			: 'bg-panel text-ink hover:text-highlight',
		className
	]}
>
	{@render children()}
</button>
