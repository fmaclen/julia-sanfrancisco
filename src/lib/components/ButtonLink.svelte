<script lang="ts">
	import { playSfx } from '$lib/sfx';

	interface Props {
		href: string;
		target?: string;
		isActive?: boolean;
		children?: import('svelte').Snippet;
	}

	let { href, target = '', isActive = false, children }: Props = $props();
</script>

<a class="a {isActive ? 'a--active' : ''}" {target} {href} onclick={() => playSfx('click')}>
	{@render children?.()}
</a>

<style lang="scss">
	@use '$lib/components/mixins.scss' as *;

	a.a {
		@include plate;
		@include button;

		&:hover {
			filter: invert(1);
		}
	}
</style>
